import { Connection } from "../../../connection/connection.interface";
import { QueryBuilder } from "../query_builder/query_builder";
import { QueryResult } from "./query_result.interface";

export interface QueryRunner {
  connection: Connection;

  startTransaction(): Promise<void>;

  commitTransaction(): Promise<void>;

  rollbackTransaction(): Promise<void>;

  query(
    query: string,
    params: any[] | Record<string, any>
  ): Promise<QueryResult>;

  build<T>(): QueryBuilder<T>;

  transaction<R>(fn: (runner: QueryRunner) => R): Promise<R>;
}
