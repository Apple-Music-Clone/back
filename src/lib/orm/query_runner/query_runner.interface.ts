import {Connection} from "../../../connection/connection.interface";
import {QueryResult} from "./query_result.interface";

export interface QueryRunner {
    connection: Connection;

    startTransaction(): Promise<void>;

    commitTransaction(): Promise<void>;

    rollbackTransaction(): Promise<void>;

    query(query: string, params: any[] | Record<string, any>): Promise<QueryResult>;
}
