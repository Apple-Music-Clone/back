import express from "express";

class App {
  public app: express.Application;
  public port: number;

  constructor(port: number, controllers: any[]) {
    this.app = express();
    this.port = port;
    this.initializeControllers(controllers);
  }

  private initializeControllers(controllers: any[]): void {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(
        `⚡️[server]: Server is running at https://localhost:${this.port}`
      );
    });
  }
}

export default App;
