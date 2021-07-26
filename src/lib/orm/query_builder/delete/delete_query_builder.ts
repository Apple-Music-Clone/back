import { TableRef } from "../query-expression-map";
import { QueryBuilder } from "../query_builder";

export class DeleteQueryBuilder<T> extends QueryBuilder<T> {
  public createDeleteExpression(): string {
    const table = this.expressionMap.table;

    return `DELETE FROM ${table.ref} `;
  }

  public from(table: TableRef) {
    this.expressionMap.table = table;

    return this;
  }

  public where(where: string, parameters?: any): this {
    return this.andWhere(where, parameters);
  }

  public andWhere(where: string, parameters?: any): this {
    if (parameters) {
      this.setParameters(parameters);
    }

    this.expressionMap.wheres.push({
      params: parameters,
      type: "and",
      condition: where,
    });

    return this;
  }

  public orWhere(where: string, parameters?: any): this {
    if (parameters) {
      this.setParameters(parameters);
    }

    this.expressionMap.wheres.push({
      params: parameters,
      type: "or",
      condition: where,
    });

    return this;
  }

  public getQuery(): string {
    return this.createDeleteExpression()
      .concat(this.createWhereExpression())
      .trim();
  }
}
