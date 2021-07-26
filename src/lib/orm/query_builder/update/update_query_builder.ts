import {QueryBuilder} from "../query_builder";
import {TableRef} from "../query-expression-map";

export class UpdateQueryBuilder<T> extends QueryBuilder<T> {

    protected createUpdateExpression(): string {
    //    UPDATE table SET x = 1, y = 2, z = 3
        const table = this.expressionMap.table;


        return `UPDATE ${table.ref} SET `;
    }

    public table(table: TableRef) {
        this.expressionMap.table = table;

        return this;
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

    public where(where: string, parameters?: any): this {
        return this.andWhere(where, parameters);
    }

    public andWhere(where: string, parameters?: any): this {
        if (parameters) {
            this.setParameters(parameters)
        }

        this.expressionMap.wheres.push({params: parameters, type: "and", condition: where});

        return this;
    }

    public orWhere(where: string, parameters?: any): this {
        if (parameters) {
            this.setParameters(parameters)
        }

        this.expressionMap.wheres.push({params: parameters, type: "or", condition: where});

        return this;
    }

    public returning(fields: string[]) {
        this.expressionMap.returning = fields;

        return this;
    }

    public getQuery(): string {
        return this.createUpdateExpression();
    }

}
