import { DatabaseService } from "../connection/database.service";
import { Service } from "../decorators/http/service.decorator";
import Tables from "../enums/tables.enums";
import User from "./users.interface";
import { TableRef } from "../lib/orm/query_builder/query-expression-map";

@Service()
class UsersService {
  public table: TableRef = new TableRef(Tables.USER, "public");

  constructor(public connection: DatabaseService) {}

  public async getAllUsers(): Promise<any> {
    return (
      this.connection
        .build()
        .select(["*"])
        .from(this.table)
        // .innerJoin(new TableRef("Friendship"), "fs", '"fs"."user_id" = "User"."id"')
        .where("1=:id", { id: 1 })
        .andWhere("'2'=:name", { name: "lucas buchalla sesti" })
        .orWhere("'3'=:slug", { slug: "lucas-buchalla-sesti" })
        .getMany()
    );
  }

  public async getOneUser(id: string): Promise<any> {
    return this.connection
      .build()
      .select(["*"])
      .from(this.table)
      .where(`"id" = :id`, { id })
      .getOne();
  }

  public async createUser(body: User): Promise<any> {
    return this.connection
      .build()
      .insert()
      .into(this.table)
      .values(body)
      .returning(["*"])
      .save();
  }

  public async updateUser(id: string, body: User): Promise<any> {
    return this.connection
      .build()
      .update()
      .table(this.table)
      .where(`"id" = $1`)
      .getQuery();
  }

  public async deleteUser(id: string): Promise<void> {
    return this.connection
      .build()
      .delete()
      .from(this.table)
      .where(`"id" = :id`, { id })
      .getQuery();
  }
}

export default UsersService;
