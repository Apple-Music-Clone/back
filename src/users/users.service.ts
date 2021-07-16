import connection from "../connection/connection";
import Tables from "../enums/tables.enums";
import User from "./users.interface";


class UsersService {
  public async getAll(): Promise<User[]> {
    const users = await connection.query<User[]>(
      `SELECT * FROM ${Tables.USER}`
    );

    return users;
  }
}

export default UsersService;
