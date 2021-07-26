import {Connection} from "../../../../connection/connection.interface";
import {Pool, PoolConfig} from 'pg';
import {TableRef} from "../../query_builder/query-expression-map";

export class PostgresConnectionDriver implements Connection<PoolConfig> {
    public pool: Pool;

    constructor(public options: PoolConfig) {
        this.pool = new Pool(options);
    }

    public query(query: string, params?: any[]): Promise<any> {
        return this.pool.query(query, params);
    }

    // TODO: implement method
    public createTable(table: TableRef, fields: any[]): Promise<void> {
        return this.query(`CREATE TABLE IF NOT EXISTS ${table.ref} ()`);
    }

    public dropTable(table: TableRef): Promise<void> {
        return this.query(`DROP TABLE ${table.ref}`);
    }

    // TODO: implement method
    public alterTable(table: TableRef, updates: object[]): Promise<void> {
        return this.query(`ALTER TABLE "${table.ref}"`);
    }

    public async open(): Promise<void> {
        await this.pool.connect();
    }

    public async close(): Promise<void> {
        await this.pool.end();
    }

    public escapeQueryWithParameters(sql: string, parameters: any): [string, any[]] {
        const escapedParameters: any[] = [];

        if (!parameters || !Object.keys(parameters).length) {
            return [sql, escapedParameters];
        }

        sql = sql.replace(/:(\.\.\.)?([A-Za-z0-9_]+)/g, (full, isArray: string, key: string): string => {
            if (!parameters.hasOwnProperty(key)) {
                return full;
            }

            let value: any = parameters[key];

            if (isArray) {
                return value.map((v: any) => {
                    escapedParameters.push(v);
                    return this.createParameter(key, escapedParameters.length - 1);
                }).join(", ");

            }

            if (value instanceof Function) {
                return value();
            }

            escapedParameters.push(value);
            return this.createParameter(key, escapedParameters.length - 1);
        });

        return [sql, escapedParameters];
    }

    public createParameter(parameterName: string, index: number): string {
        return "$" + (index + 1);
    }
}
