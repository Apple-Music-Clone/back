import { createParamDecorator } from "../../../lib/utils/utils";

// Criando decorator do Query
// Exemplo: nomeDaFuncao(@Query('teste') teste: string) {}
export const Query = createParamDecorator((req, _, name: string) => {
  if (name ?? false) {
    return req.query[name];
  }

  return req.query;
})
