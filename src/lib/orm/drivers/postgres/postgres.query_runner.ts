import {QueryRunner} from "../../query_runner/query_runner.interface";
import {Connection} from "../../../../connection/connection.interface";
import {QueryResult} from "../../query_runner/query_result.interface";

export class PostgresQueryRunner implements QueryRunner {
    constructor(public connection: Connection) {
    }

    query(query: string, params: any[] | Record<string, any>): Promise<QueryResult> {
        const [sql, parameters] = this.connection.escapeQueryWithParameters(query, params);
        console.log(sql, parameters);

        return this.connection.query(sql, parameters).then((r) => ({
            raw: r,
            records: r.rows,
            affected: r.rowCount
        } as QueryResult));
    }

    startTransaction(): Promise<void> {
        return this.connection.query('BEGIN');
    }

    commitTransaction(): Promise<void> {
        return this.connection.query('COMMIT');
    }

    rollbackTransaction(): Promise<void> {
        return this.connection.query('ROLLBACK');
    }

}
