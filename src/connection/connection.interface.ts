import {TableRef} from "../lib/orm/query_builder/query-expression-map";

export interface Driver {
    query(query: string, params?: any[]): Promise<any>;

    createTable(table: TableRef, fields: any[]): Promise<void>;

    dropTable(table: TableRef): Promise<void>;

    alterTable(table: TableRef, updates: object[]): Promise<void>;

    open(): Promise<void>;

    close(): Promise<void>;

    escapeQueryWithParameters(sql: string, parameters: any): [string, any[]];

    createParameter(parameterName: string, index: number): string;
}

export interface Connection<O extends object = any> extends Driver {
    options: O,
}

// host: string;
// user: string;
// password: string;
// database: string;

