import { TableRef } from "../query_builder/query-expression-map";
import { QueryRunner } from "../query_runner/query_runner.interface";
import { Entity } from "./entity";

export class EntityManager<E> {
  constructor(private entity: Entity<E>, private runner: QueryRunner) {}

  public createTable() {
    const table = this.entity.ref;
    const items = Array.from(this.entity.columns.values());

    const columns = items.map((col) => {
      const name = TableRef.addQuotes(col.name);
      const length = col.length ?? 255;

      let type: string = col.type;

      if (col.autoIncrement) {
        type = 'SERIAL';
      }

      if (length >= 0 && col.type === "varchar") {
        type = type.concat(`(${length})`);
      }

      let sql = `${name} ${type} `;

      if (col.primary) {
        sql = sql.concat("PRIMARY KEY ");
      }

      if (col.unique) {
        sql = sql.concat("UNIQUE ");
      }

      if (col.default) {
        sql = sql.concat(`DEFAULT ${col.default}`);
      }

      if (!col.nullable) {
        sql = sql.concat("NOT NULL ");
      }

      if (col.reference) {        
        sql = sql.concat(`, FOREIGN KEY(${name}) REFERENCES ${col.reference}`);
      }

      return sql;
    });

    return `CREATE TABLE IF NOT EXISTS ${table.ref} (${columns})`;
  }
}
