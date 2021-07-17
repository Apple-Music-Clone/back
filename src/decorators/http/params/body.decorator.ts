import { createParamDecorator } from "../../../lib/utils/utils";

// Criando decorator do Body
// Exemplo: nomeDaFuncao(@Body() body: any) {}
export const Body = createParamDecorator((req) => req.body)
