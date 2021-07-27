import {Connection} from "../../../connection/connection.interface";

export interface SelectQuery {
    selection: string;
    aliasName?: string;
}

export interface JoinAttribute {
    direction: "inner" | "left";
    relation: string;
    condition: string;
    alias: string;
}

export interface WhereClause {
    condition: WhereClauseCondition;
    type: "simple" | "and" | "or";
    params: any;
}

export type WhereClauseCondition = string | WhereClause | WhereClause[];

export interface OrderBy {
    [columnName: string]: 'asc' | 'desc'
}

export class TableRef {
    get ref() {
        const parts: string[] = [];

        if (this.scheme) {
            parts.push(this.scheme);
        }

        parts.push(this.table);

        return parts.map((part) => TableRef.addQuotes(part)).join('.');
    };

    public static addQuotes(text: string) {
        if (/^".*"$/g.test(text)) {
            return text;
        }

        return `"${text}"`;
    }

    public columnRef(columnName: string) {
        return this.ref.concat('.', TableRef.addQuotes(columnName));
    }

    constructor(public table: string, public scheme?: string) {
    }
}

export class QueryExpressionMap {
    constructor(public connection: Connection) {
    }

    table: TableRef;

    queryType: 'select' | 'update' | 'delete' | 'insert' = 'select';

    selects: SelectQuery[] = [];

    selectDistinct: boolean = false;

    valuesSet: Record<string, any> | Record<string, any>[] = {};

    returning: string[] = [];

    joinAttributes: JoinAttribute[] = [];

    wheres: WhereClause[] = [];

    ordersBys: OrderBy[] = [];

    groupBys: string[] = [];

    limit: number;

    offset: number;

    parameters: Record<string, any> = {};

    insertColumns: string[] = [];

    useTransaction: boolean = false;

    subQuery: boolean = false;
}
