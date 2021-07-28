import { Class } from "../../lib/utils/utils";

export type ForeignKeyActions =
  | "cascade"
  | "set null"
  | "restrict"
  | "no action"
  | "default";

export interface RelationOptions {
  onUpdate?: ForeignKeyActions;
  onDelete?: ForeignKeyActions;
  name?: string;
  nullable?: boolean;
  foreignKey?: string;
  reference?: Class<any>
}
