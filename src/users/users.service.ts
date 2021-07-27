import { DatabaseService } from "../connection/database.service";
import { Service } from "../decorators/http/service.decorator";
import Tables from "../enums/tables.enums";
import { TableRef } from "../lib/orm/query_builder/query-expression-map";
import { QueryRunner } from "../lib/orm/query_runner/query_runner.interface";
import { Repository } from "../lib/orm/repository/repository.orm";
import { User } from "./user.entity";

@Service()
class UsersService {
  public table: TableRef = new TableRef(Tables.USER, "public");

  public repository: Repository<User>;

  constructor(public connection: DatabaseService) {
    this.repository = this.connection.repositoryFor(User);
  }

  public async getAllUsers(): Promise<User[]> {
    return this.repository.findAll();
    // return (
    //   this.connection
    //     .build()
    //     .select(["*"])
    //     .from(this.table)
    //     // .innerJoin(new TableRef("Friendship"), "fs", '"fs"."user_id" = "User"."id"')
    //     .where("1=:id", { id: 1 })
    //     .andWhere("'2'=:name", { name: "lucas buchalla sesti" })
    //     .orWhere("'3'=:slug", { slug: "lucas-buchalla-sesti" })
    //     .getMany()
    // );
  }

  public async getOneUser(id: string): Promise<any> {
    return this.repository.findOne(id);
    // return this.connection
    //   .build()
    //   .select(["*"])
    //   .from(this.table)
    //   .where(`"id" = :id`, { id })
    //   .getOne();
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
    return this.repository.updateOne(id, body);
    // return this.connection
    //   .build()
    //   .update()
    //   .table(this.table)
    //   .values(body)
    //   .where(`"id" = :id`, { id })
    //   .getQueryAndParameters();
  }

  public async deleteUser(id: string): Promise<void> {
    await this.repository.deleteOne(id);
    // return this.connection
    //   .build()
    //   .delete()
    //   .from(this.table)
    //   .where(`"id" = :id`, { id })
    //   .getQuery();
  }

  // public testTransaction() {
  //   return this.connection.transaction(async (db: QueryRunner) => {
  //     await db
  //       .build()
  //       .insert()
  //       .into(this.table)
  //       .values({
  //         uuid: "7424399d-8bed-412a-aeee-60746c5d5c36",
  //         name: "LSN",
  //       })
  //       .save();

  //     await db
  //       .build()
  //       .insert()
  //       .into(this.table)
  //       .values({
  //         uuid: "01ec41de-502f-4b1b-841f-ae232ea80228",
  //         name: "Testeeeeee",
  //       })
  //       .save();
  //   });
  // }
}

export default UsersService;
