import express from "express";

export type Class<T> = new (...args: any[]) => T;

const singletons = new Map<Class<any>, any>();

function initialize<T>(klass: Class<T>): T {
  // Pegando todas as dependências da classe, pois necessita-se ser de dentro para fora
  // Exemplo: Temos o UserController, e ele usa o UserService e o UserService usa o Connection
  // Primeiro temos que setar inicializar o Connection, depois o UserServie e depois o Controller
  const deps = (Reflect.getMetadata("design:paramtypes", klass) ?? []).map(
    getInstance
  );

  return new klass(...deps);
}

// Criando a função para instânciar e setar no singletons
export function getInstance<T>(klass: Class<T>): T {
  // Verifica se essa classe já foi instânciada
  // Se sim, so retorna a classe, para não instânciar de novo
  if (singletons.has(klass)) {
    return singletons.get(klass) as T;
  }

  // Inicializando a classe
  const instance = initialize(klass);

  // Setando a classe nos singletons
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
