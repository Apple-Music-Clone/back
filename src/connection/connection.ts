import { Pool, QueryResult } from "pg";
import { Service } from "../decorators/http/service.decorator";
import { InsertQueryBuilder } from "../lib/orm/query_builder/insert/insert_query_builder";
import { SelectQueryBuilder } from "../lib/orm/query_builder/select/select_query_builder";

// Criando service de conexão
@Service()
class Connection {
  private client;
  private host: string;
  private user: string;
  private password: string;
  private database: string;

  constructor() {
    // Definindo banco de dados
    this.host = "motty.db.elephantsql.com";
    this.user = "nhhtrilt";
    this.database = "nhhtrilt";
    this.password = "079rgDk8jAjySHV-ddzL66ggSVCu6SiO";

    // Criando o Pool
    this.client = new Pool({
      host: this.host,
      user: this.user,
      password: this.password,
      database: this.database,
      min: 1,
      max: 5,
      idleTimeoutMillis: 5000,
      query_timeout: 30000,
    });

    // Conectando
    this.client.connect();
  }

  // Criando o queryRaw que não retorna o rows, ele retorna a query inteira que vier
  public queryRaw<R = any>(query: string, params: any[]): Promise<QueryResult<R>> {
    // Chamando a query do client diretamente
    return this.client.query(query, params)
  }

  // Criando o query que retorna filtrado as rows da query
  public query<R = any>(query: string, params: any[]): Promise<R[]> {
    return this.queryRaw<R>(query, params).then(r => r.rows);
  }

  // Cria o queryBuilder
  public build<T = any>(tableName: string) {
    // Instanciando SelectQueryBuilder
    return new InsertQueryBuilder<T>(this, [], tableName);
  }
}

export default Connection;
