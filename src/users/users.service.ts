import Connection from "../connection/connection";
import { Service } from "../decorators/http/service.decorator";
import Tables from "../enums/tables.enums";

// Cria o service
// Por padrão ele é singleton, porém, mais para frente será implementado o "transient", que gera uma instância
// a cada chamada
// Exemplo: @Service('transient')
@Service()
class UsersService {
  // Recebendo a conexão
  constructor(public connection: Connection) {}
  
  // Criando função para pegar todos os usuários
  public async getAll(): Promise<any> {
    // Montando a query
    return this.connection.build(Tables.USER)
      .select(['*'])
      .addWhere(`"id" = $1`)
      .addOrWhere(`"uuid" = $2`)
      .addWhere(`"name" = $3`)
      .innerJoin("Friendship", "fs", `"fs"."user_id" = "${Tables.USER}"."id"`)
      .setParams([1,2,3])
      .addOrder(`uuid`)
      .addOrder(`"id"`, "desc")
      .offset(0)
      .limit(1)
      .setParams([1,2,3])
      .getSQL();
  }
}


export default UsersService;
