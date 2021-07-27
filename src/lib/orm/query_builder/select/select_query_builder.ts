import {QueryBuilder} from "../query_builder";
import {Connection} from "../../../../connection/connection.interface";
import {QueryRunner} from "../../query_runner/query_runner.interface";
import {JoinAttribute, TableRef} from "../query-expression-map";

export class SelectQueryBuilder<T> extends QueryBuilder<T> {
    public from(table: TableRef) {
        this.expressionMap.table = table;

        return this;
    }

    protected createSelectExpression() {
        const tableRef = this.expressionMap.table;

        const selection = this.expressionMap.selects.map((select) => {
            if (select.selection === "*") {
                return select.selection;
            }

            if (select.selection.includes(".")) {
                return select.selection.split(".", 2).map((item) => TableRef.addQuotes(item)).join(".");
            }

            let selectText = tableRef.columnRef(select.selection);

            if (select.aliasName) {
                selectText = selectText.concat(' AS ', TableRef.addQuotes(select.aliasName))
            }

            return selectText;
        }).join(',');

        return `SELECT ${selection} FROM ${tableRef.ref} `;
    }

    protected createJoinExpression() {
        let filterParts = [];

        for (let i = 0; i < this.expressionMap.joinAttributes.length; i++) {
            const join = this.expressionMap.joinAttributes[i];

            if (join.direction === "inner") {
                filterParts.push("INNER JOIN");
            } else if (join.direction === "left") {
                filterParts.push("LEFT JOIN");
            }

            filterParts.push(TableRef.addQuotes(join.relation));

            if (join.alias) {
                filterParts.push(TableRef.addQuotes(join.alias));
            }

            if (join.condition) {
                filterParts.push(`ON ${join.condition}`);
            }
        }

        return filterParts.join(" ").concat(" ");
    }

    protected createLimitExpression() {
        const {limit, offset} = this.expressionMap;

        const sqlParts = [];

        if (typeof limit === "number" && !Number.isNaN(limit)) {
            sqlParts.push(`LIMIT ${limit}`)
        }

        if (typeof offset === "number" && !Number.isNaN(offset)) {
            sqlParts.push(`OFFSET ${offset}`)
        }

        return sqlParts.join(" ").concat(" ");
    }

    protected join(direction: 'inner' | 'left', table: TableRef, alias: string, condition: string, params?: Record<string, any>) {
        this.setParameters(params ?? {});

        const joinAttribute: JoinAttribute = {
            direction,
            condition,
            alias,
            relation: table.ref,
        };

        this.expressionMap.joinAttributes.push(joinAttribute);

        return this;
    }

    public innerJoin(table: TableRef, alias: string, condition: string, params?: Record<string, any>) {
        return this.join("inner", table, alias, condition, params);
    }

    public leftJoin(table: TableRef, alias: string, condition: string, params?: Record<string, any>) {
        return this.join("left", table, alias, condition, params);
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

    public limit(value: number): this {
        this.expressionMap.limit = value;

        return this;
    }

    public offset(value: number): this {
        this.expressionMap.offset = value;

        return this;
    }

    public createQueryBuilder() {
        return new (this.constructor as any)(this.connection, this.runner)
    }

    public subQuery() {
        const qb = this.createQueryBuilder();

        qb.expressionMap.subQuery = true;
        qb.parentQueryBuilder = this;

        return qb;
    }

    public getQuery(): string {
        let sql = this.createSelectExpression()
            .concat(
                this.createJoinExpression(),
                this.createWhereExpression(),
                // this.createGroupByExpression(),
                // this.createOrderByExpression(),
                this.createLimitExpression()
            ).trim()

        if (this.expressionMap.subQuery) {
            sql = `(${sql})`;
        }

        return sql;
    }

    public getMany() {
        return this.execute().then(r => r.records);
    }

    public getOne() {
        return this.limit(1).execute().then(r => r.records[0]);
    }
}
