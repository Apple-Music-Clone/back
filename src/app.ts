import express from "express";

import { Class, getInstance } from "./lib/utils/utils";

class App<T extends Class<any>[]> {
  public app: express.Application;
  public port: number;

  constructor(port: number, controllers: T) {
    this.port = port;
    this.app = express();

    this.app.use(express.json());

    // Inicializando controllers
    this.initializeControllers(controllers);
  }

  private initializeControllers(controllers: T): void {
    // Percorre todos os controllers que foi passado pra classe
    controllers.forEach((controller) => {
      // Pegando o path do controller pelo reflect (Que é a dependência usada no main.ts)
      // Da pra acessar coisas da classe facilmente com o reflect, é muito bom.
      const path = Reflect.getMetadata("path", controller);

      // Pegando os decorators do controller
      const controllersParamsDecorators =
        Reflect.getMetadata("paramdecorators", controller) ?? new Map();

      // Pegando todas as rotas do controller
      const routes = Reflect.getMetadata("routes", controller) ?? [];

      // Se não tiver rota, retorna
      if (routes.length === 0) {
        return;
      }

      // Gerando router do express
      const router = express.Router();

      // Pegando a instância do controller
      const instance = getInstance(controller);

      // Percorrendo todas as rotas
      routes.forEach((route) => {
        // Pegando método da rota
        const method = router[route.method];

        // Pegando todos os decorators da rota
        const decorators = controllersParamsDecorators.get(route.key) ?? [];

        // Se existir o método
        if (method) {
          // Chama o método passando o router, o path e o callback da rota
          method.call(router, route.path, async (req, res) => {
            // Aqui definimos os params que usaremos para os valores dos decorators
            const params = [];

            // Percorrendo todos decorators
            for (const decorator of decorators) {
              // Para o index do decorator (exemplo: nomeDaFuncao(@Query('teste') teste: string))
              // o index do decorator será 0, e assim por diante..

              // Aí resolvemos para pegar o valor de dentro do decorator
              params[decorator.index] = await Promise.resolve(
                decorator.fn(
                  req,
                  res,
                  decorator.options,
                  controller.prototype,
                  route.key,
                  decorator.index
                )
              );
            }

            try {
              // Pega o retorno da função do controller e salva na constante
              const result = await Promise.resolve(
                instance[route.key](...params)
              );

              // Retorna em json o resultado
              return res.json(result);
            } catch (err) {
              // Caso de erro, retorna o erro com o json certinho
              res.status(500).send({
                name: err.name,
                error: err.message,
              });
            }
          });
        }
      });

      this.app.use(path, router);
    });
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(
        `⚡️ [server]: Server is running at https://localhost:${this.port}`
      );
    });
  }
}

export default App;
