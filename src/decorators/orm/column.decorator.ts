export type ColumnType =
  | "integer"
  | "varchar"
  | "timestamp"
  | "float"
  | "bigint"
  | "date"
  | "datetime"
  | "simplearray"
  | "json"
  | "uuid";

export interface ColumnOptions {
  type: ColumnType;
  name?: string;
  length?: number;
  nullable?: boolean;
  unique?: boolean;
  primary?: boolean;
  autoIncrement?: boolean;
}

export function Column(options: ColumnOptions): PropertyDecorator {
  return (target, key: string) => {
    if (!options.name) {
      options.name = key;
    }

    const columns: Map<string, ColumnOptions> =
      Reflect.getMetadata("entity:columns", target.constructor) ??
      new Map<string, ColumnOptions>();

    const column = columns.get(key) ?? {};

    columns.set(key, { ...column, ...options });

    Reflect.defineMetadata("entity:columns", columns, target.constructor);
  };
}
