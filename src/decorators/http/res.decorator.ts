import { createParamDecorator } from "../../lib/utils/utils";

// Criando decorator do Res
// Exemplo: nomeDaFuncao(@Res() Res: express.Response) {}
export const Res = createParamDecorator((_, res) => res);
