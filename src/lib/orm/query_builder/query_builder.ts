import {QueryExpressionMap, TableRef, WhereClause, WhereClauseCondition} from "./query-expression-map";
import {Connection} from "../../../connection/connection.interface";
import {QueryRunner} from "../query_runner/query_runner.interface";

export abstract class QueryBuilder<T = any> {
    public expressionMap: QueryExpressionMap;

    public parentQueryBuilder: QueryBuilder;

    constructor(public connection: Connection, public runner: QueryRunner) {
        this.expressionMap = new QueryExpressionMap(this.connection);
    }

    public select(fields: string[]) {
        const qb = new new (require('./select/select_query_builder').SelectQueryBuilder)(this.connection, this.runner);
        qb.expressionMap.queryType = 'select';
        qb.expressionMap.selects = fields.map((field) => ({selection: field}));


        return qb;
    }

    public insert() {
        const qb = new (require('./insert/insert_query_builder').InsertQueryBuilder)(this.connection, this.runner);
        qb.expressionMap.queryType = 'insert';

        return qb;
    }

    protected parameterIndex = 0;

    protected createWhereClausesExpression(clauses: WhereClause[]): string {
        return clauses.map((clause, index) => {
            const expression = this.createWhereConditionExpression(clause.condition);

            switch (clause.type) {
                case "and":
                    return (index > 0 ? "AND " : "") + expression;
                case "or":
                    return (index > 0 ? "OR " : "") + expression;
            }

            return expression;
        }).join(" ").trim();
    }

    protected createWhereConditionExpression(condition: WhereClauseCondition): string {
        if (typeof condition === 'string') {
            return condition;
        }

        if (Array.isArray(condition) && condition.length > 0) {
            if (condition.length === 1) {
                return this.createWhereClausesExpression(condition);
            }

            return "(" + this.createWhereClausesExpression(condition) + ")";
        }

        return this.createWhereClausesExpression([condition as WhereClause]);
    }

    protected createWhereExpression(): string {
        if (this.expressionMap.wheres.length === 0) {
            return '';
        }

        const expressions = this.createWhereClausesExpression(this.expressionMap.wheres);

        return `WHERE ${expressions} `;
    }

    public hasParameter(paramName: string): boolean {
        return this.parentQueryBuilder?.hasParameter(paramName) || paramName in this.expressionMap.parameters
    }

    public createParameter(value: any) {
        let parameterName: string;

        do {
            parameterName = `orm_${this.parameterIndex++}`;
        } while (this.hasParameter(parameterName))

        this.setParameter(parameterName, value);

        return `:${parameterName}`
    }

    public setParameter(key: string, value: any) {
        if (this.parentQueryBuilder) {
            this.parentQueryBuilder.setParameter(key, value);
        }

        this.expressionMap.parameters[key] = value;

        return this;
    }

    public setParameters(params: Record<string, any>) {
        for (const [key, value] of Object.entries(params)) {
            this.setParameter(key, value);
        }

        return this;
    }

    public getParameters(): Record<string, any> {
        return this.expressionMap.parameters;
    }

    public getQueryAndParameters(): [string, any[]] {
        const query = this.getQuery();
        const parameters = this.getParameters();

        return this.connection.escapeQueryWithParameters(query, parameters);
    }

    abstract getQuery(): string;

    public execute() {
        return this.runner.query(this.getQuery(), this.getParameters());
    }
}
