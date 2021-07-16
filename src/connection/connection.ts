import { Client } from "pg";

class Connection {
  private client;
  private host: string;
  private user: string;
  private password: string;
  private database: string;

  constructor() {
    this.host = "motty.db.elephantsql.com";
    this.user = "nhhtrilt";
    this.database = "nhhtrilt";
    this.password = "079rgDk8jAjySHV-ddzL66ggSVCu6SiO";

    this.client = new Client({
      host: this.host,
      user: this.user,
      password: this.password,
      database: this.database,
    });
    this.client.connect();
  }

  public async query<T>(query: string): Promise<T> {
    try {
      const queryRes = await this.client.query("SELECT * FROM public.User");

      return queryRes.rows as T;

    } catch (error) {
      throw error;
    }
  }
}

const connection = new Connection();

export default connection;
