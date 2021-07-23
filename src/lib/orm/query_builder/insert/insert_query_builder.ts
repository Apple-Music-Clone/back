import {QueryBuilder} from "../query_builder";
import {TableRef} from "../query-expression-map";

export class InsertQueryBuilder<T> extends QueryBuilder<T> {
    protected createInsertExpression(): string {
        const table = this.expressionMap.table;
        const data = [].concat(this.expressionMap.valuesSet);

        const fields = Array.from(
            new Set(
                data.flatMap((item) => Object.keys(item))
            )
        );

        const fieldNames = fields.map((field) => TableRef.addQuotes(field)).join(',');

        const rows: any[] = data.map(item => {
            return fields.map((field) => {
                return item[field] ?? null;
            })
        });

        const rowParams = rows.map((row, ri) => {
            const rowParams = row.map((value) => {
                return this.createParameter(value);
            }).join(',');

            return `(${rowParams})`
        }).join(',')

        return `INSERT INTO ${table.ref}(${fieldNames}) VALUES ${rowParams} `;
    }

    protected createReturningExpress(): string {
        if (!this.expressionMap.returning) {
            return '';
        }

        const tableRef = this.expressionMap.table

        const selection = this.expressionMap.returning.map((select) => {
            if (select === "*") {
                return select;
            }

            if (select.includes(".")) {
                return select.split(".", 2).map((item) => TableRef.addQuotes(item)).join(".");
            }

            return tableRef.columnRef(select)
        }).join(',');

        return `RETURNING ${selection} `;
    }

    public addValue(data: any) {
        this.expressionMap.valuesSet.push(data);

        return this;
    }

    public addValues(data: any[]) {
        this.expressionMap.valuesSet = this.expressionMap.valuesSet.concat(data);

        return this;
    }

    public values(data: any | any[]) {
        if (!Array.isArray(data)) {
            data = [data];
        }

        this.expressionMap.valuesSet = data;

        return this;
    }

    public into(table: TableRef) {
        this.expressionMap.table = table;

        return this;
    }

    public getQuery(): string {
        return this.createInsertExpression().concat(this.createReturningExpress()).trim();
    }

    public save(): Promise<any> {
        return this.execute().then(r => r.records);
    }

    public returning(fields: string[]) {
        this.expressionMap.returning = fields;

        return this;
    }

}
