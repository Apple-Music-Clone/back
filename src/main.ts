// Importando este pacote para controlar as classes melhor
import "reflect-metadata";
import App from "./app";
import UsersController from "./users/users.controller";

import { User } from "./users/user.entity";

// Criando o app e gerando os controllers
const app = new App(3000, [UsersController]);
app.listen();
