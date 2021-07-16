import App from "./app";
import UsersController from "./users/users.controller";

const app = new App(3000, [new UsersController()]);
app.listen();
