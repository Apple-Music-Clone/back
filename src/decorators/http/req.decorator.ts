import { createParamDecorator } from "../../lib/utils/utils";

// Criando decorator do Req
// Exemplo: nomeDaFuncao(@Req() req: express.Request) {}
export const Req = createParamDecorator((req) => req);
