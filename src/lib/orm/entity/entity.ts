import { ColumnOptions } from "../../../decorators/orm/column.decorator";
import { EntityOptions } from "../../../decorators/orm/entity.decorator";
import { Class } from "../../utils/utils";
import { TableRef } from "../query_builder/query-expression-map";

export class Entity<T> {
  constructor(public entity: Class<T>) {}

  get columns(): Map<string, ColumnOptions> {
    return (
      Reflect.getMetadata("entity:columns", this.entity) ??
      new Map<string, ColumnOptions>()
    );
  }

  get columnNames(): string[] {
    return Array.from(this.columns.values()).map((col) => col.name);
  }

  get options(): EntityOptions {
    return (
      Reflect.getMetadata("entity:options", this.entity) ?? {
        name: this.entity.name.toLowerCase(),
        scheme: "public",
      }
    );
  }

  get name(): string {
    return this.options.name;
  }

  get scheme(): string {
    return this.options.scheme ?? "public";
  }

  get ref(): TableRef {
    return new TableRef(this.name, this.scheme);
  }

  get pk(): ColumnOptions {
    for (const column of this.columns.values()) {
      if (column.primary) {
        return column;
      }
    }

    throw new Error(
      `A entidade ${this.entity.name} não possuí chave primária.`
    );
  }

  get pkName(): string {
    for (const [name, column] of this.columns.entries()) {
      if (column.primary) {
        return name;
      }
    }

    throw new Error(
      `A entidade ${this.entity.name} não possuí chave primária.`
    );
  }

  static create<T>(entity: Class<T>): Entity<T> {
    return new Entity(entity);
  }

  public create(data: any): T {
    const result = new this.entity();

    for (const [name, column] of this.columns.entries()) {
      result[name] = data[column.name];
    }

    return result;
  }

  static toRaw<E>(data: E) {
    const result = {};
    const entity: Entity<E> = Reflect.getMetadata(
      "entity:entity",
      data.constructor
    );

    if (!entity) {
      return data;
    }

    for (const [name, column] of entity.columns.entries()) {
      if (data[name] !== undefined) {
        result[column.name] = data[name];
      }
    }

    return result;
  }
}
