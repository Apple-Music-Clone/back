// Criando o decorator do Service
export function Service(scope: 'singleton' | 'transient' = 'singleton'): ClassDecorator {
  return (target) => {
    // Seta o scope do metadata da classe com o scope que passamos no decorator
    // exemplo: @Service('transient')
    // poderiamos executar o comando: Reflect.getMetadata('scope', service); para pegar o scope do service.
    Reflect.defineMetadata("scope", scope, target);
  };
}
