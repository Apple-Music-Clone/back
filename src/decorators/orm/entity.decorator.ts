import { Entity as EntityClass } from "../../lib/orm/entity/entity";

export interface EntityOptions {
  name?: string;
  scheme?: string;
}

export function Entity(options: EntityOptions = {}): ClassDecorator {
  return (target) => {
    if (!options.name) {
      options.name = target.name.toLowerCase();
    }

    Reflect.defineMetadata("entity:options", options, target);
    Reflect.defineMetadata("entity:entity", EntityClass.create(target as any), target);
  };
}
