import express from "express";

export type Class<T> = new (...args: any[]) => T;

const singletons = new Map<Class<any>, any>();

function initialize<T>(klass: Class<T>): T {
  const deps = (Reflect.getMetadata("design:paramtypes", klass) ?? []).map(
    getInstance
  );

  return new klass(...deps);
}

export function getInstance<T>(klass: Class<T>): T {
  if (singletons.has(klass)) {
    return singletons.get(klass) as T;
  }

  const instance = initialize(klass);

  singletons.set(klass, instance);

  return instance;
}

export function createParamDecorator<T>(
  fn: (
    req: express.Request,
    res: express.Response,
    options?: T,
    target?: any,
    key?: string | symbol,
    index?: number
  ) => any
) {
  return (options?: T): ParameterDecorator => {
    return (target, key, index) => {
      const decorators =
        Reflect.getMetadata("paramdecorators", target.constructor) ?? new Map();
      const current = decorators.get(key) ?? [];

      decorators.set(key, current.concat({ index, options, fn }));

      Reflect.defineMetadata("paramdecorators", decorators, target.constructor);
    };
  };
}
