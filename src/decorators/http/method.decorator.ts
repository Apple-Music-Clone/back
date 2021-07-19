// Criando o decorator de method ""abstrato"" que recebe um method e o path com padrão o /
function Method(method: string, path: string = '/'): MethodDecorator {
  // Verificando se tem alguma "/" duplicada e removendo
  path = ('/' + path).replace(/\/+/g, '/');

  return (target, key) => {
    // Pegando o construtor da classe
    const klass = target.constructor;

    // Pegando as rotas da classe
    const routes: any[] = Reflect.getMetadata("routes", klass) ?? [];

    // Adicionando a nova rota
    routes.push({method, path, key});

    // Adicionando as rotas no metadata da classe
    Reflect.defineMetadata("routes", routes, klass);
  };
}

// Criando todos os decorators de métodos

export function Get(path?: string): MethodDecorator {
  return Method('get', path);
}

export function Post(path?: string): MethodDecorator {
  return Method('post', path);
}

export function Put(path?: string): MethodDecorator {
  return Method('put', path);
}

export function Patch(path?: string): MethodDecorator {
  return Method('patch', path);
}

export function Delete(path?: string): MethodDecorator {
  return Method('delete', path);
}
