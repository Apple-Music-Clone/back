import { QueryBuilder } from "../query_builder";
import { TableRef } from "../query-expression-map";

export class UpdateQueryBuilder<T> extends QueryBuilder<T> {
  protected createUpdateExpression(): string {
    const table = this.expressionMap.table;
    let data = this.expressionMap.valuesSet ?? {};

    if (Array.isArray(data)) {
      data = data[0] ?? {};
    }

    const fields = Array.from(new Set(Object.keys(data)));

    const setParams = fields
      .map((field) => {
        const param = this.createParameter(data[field]);

        return `${field} = ${param}`;
      })
      .join(",");

    return `UPDATE ${table.ref} SET ${setParams} `;
  }

  protected createReturningExpression(): string {
    if (!this.expressionMap.returning?.length) {
      return "";
    }

    const tableRef = this.expressionMap.table;

    const selection = this.expressionMap.returning
      .map((select) => {
        if (select === "*") {
          return select;
        }

        if (select.includes(".")) {
          return select
            .split(".", 2)
            .map((item) => TableRef.addQuotes(item))
            .join(".");
        }

        return tableRef.columnRef(select);
      })
      .join(",");

    return `RETURNING ${selection} `;
  }

  public table(table: TableRef) {
    this.expressionMap.table = table;

    return this;
  }

  public addValue(data: any | any[]) {
    this.expressionMap.valuesSet = [].concat(
      this.expressionMap.valuesSet,
      data
    );

    return this;
  }

  public addValues(data: any[]) {
    this.expressionMap.valuesSet = this.expressionMap.valuesSet.concat(data);

    return this;
  }

  public values(data: any | any[]) {
    this.expressionMap.valuesSet = data;

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

  public returning(fields: string[]) {
    this.expressionMap.returning = fields;

    return this;
  }

  public getQuery(): string {
    return this.createUpdateExpression()
      .concat(this.createWhereExpression(), this.createReturningExpression())
      .trim();
  }

  public save(): Promise<any> {
    return this.execute().then((r) => {
      if (Array.isArray(this.expressionMap.valuesSet)) {
        return r.records;
      }

      return r.records[0];
    });
  }
}
