// Criando decorator do controller, que recebe o path da rota que será
export function Controller(path?: string): ClassDecorator {
  return (target) => {
    // Seta o path do metadata da classe com o path que passamos no decorator
    // exemplo: @Controller('/users')
    // poderiamos executar o comando: Reflect.getMetadata('path', controller); para pegar o path.
    Reflect.defineMetadata("path", path, target);
  };
}
