import { QueryRunner } from "../../query_runner/query_runner.interface";
import { Connection } from "../../../../connection/connection.interface";
import { QueryResult } from "../../query_runner/query_result.interface";
import { SelectQueryBuilder } from "../../query_builder/select/select_query_builder";
import { QueryBuilder } from "../../query_builder/query_builder";

export class PostgresQueryRunner implements QueryRunner {
  constructor(public connection: Connection) {}

  public query(
    query: string,
    params: any[] | Record<string, any>
  ): Promise<QueryResult> {
    const [sql, parameters] = this.connection.escapeQueryWithParameters(
      query,
      params
    );
    // console.log(sql, parameters);

    return this.connection.query(sql, parameters).then(
      (r) =>
        ({
          raw: r,
          records: r.rows,
          affected: r.rowCount,
        } as QueryResult)
    );
  }

  public startTransaction(): Promise<void> {
    return this.connection.query("BEGIN");
  }

  public commitTransaction(): Promise<void> {
    return this.connection.query("COMMIT");
  }

  public rollbackTransaction(): Promise<void> {
    return this.connection.query("ROLLBACK");
  }

  public build<T = any>(): QueryBuilder<T> {
    return new SelectQueryBuilder<T>(this.connection, this);
  }

  public async transaction<T = any>(
    fn: (runner: PostgresQueryRunner) => T
  ): Promise<T> {
    await this.startTransaction();

    try {
      const result = await Promise.resolve(fn(this));

      await this.commitTransaction();

      return result;
    } catch (error) {
      await this.rollbackTransaction();

      return Promise.reject(error);
    }
  }
}
