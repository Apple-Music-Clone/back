import express from "express";
import UsersService from "./users.service";

class UsersController {
  public path = "/users";
  public router = express.Router();
  private service: UsersService;

  constructor() {
    this.service = new UsersService();
    this.initializeRoutes();
  }

  public initializeRoutes(): void {
    this.router.get(this.path, async (req, res) => {
      const users = await this.service.getAll();

      res.send(users);
    });
  }
}

export default UsersController;
