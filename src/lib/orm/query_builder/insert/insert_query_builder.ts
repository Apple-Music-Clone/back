import Connection from "../../../../connection/connection";
import QueryBuilder from "../query_builder";

export class InsertQueryBuilder<T> extends QueryBuilder<T> {
  constructor(
    public runner: Connection,
    public fields: string[],
    public tableName: string
  ) {
    super(runner);
  }

  public getSQL() {
    const fields = this.fields.join(",");

    // Gerando nome da tabela
    let table = this.tableName.includes(".")
      ? this.tableName
      : `"${this.tableName}"`;

    const sqlParts = [`INSERT INTO ${table}(${fields}) VALUES(`];

    this.params.forEach((_, index) => {
      const comma = index === this.fields.length - 1 ? '' : ',';

      // sqlParts.push(`\$${index}${comma} `);
      sqlParts.push(`'${_}'${comma}`);
    });
    
    sqlParts.push(")");

    return sqlParts.join(" ");
  }

  public from(tableName: string) {
    this.tableName = tableName;

    return this;
  }

  public setParams(values: any[]) {
    this.params = values;

    return this;
  }
}
