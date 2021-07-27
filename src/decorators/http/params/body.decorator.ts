import { createParamDecorator } from "../../../lib/utils/utils";

// Criando decorator do Body
// Exemplo: nomeDaFuncao(@Body() body: any) {}
export const Body = createParamDecorator((req, _, __, target, key, index) => {
  const type =
    Reflect.getMetadata("design:paramtypes", target, key)[index] ?? Object;

  return Object.assign(Object.create(type.prototype), req.body);
});
