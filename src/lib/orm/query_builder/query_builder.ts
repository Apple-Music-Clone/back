import Connection from "../../../connection/connection";
import { SelectQueryBuilder } from "./select/select_query_builder";
// import { InsertQueryBuilder } from "./insert/insert_query_builder";

// Definindo a classe abstrata do QueryBuilder que tem o select, (terá insert, update, etc)
// E tem o getQuery(), que todos os metodos (insert, update, etc) tem como pegar a query
// E a mesma coisa com o getSQL();
abstract class QueryBuilder<T = any> {
  // Definindo os parametros que receberemos das queries
  // Exemplo.: ...addWhere('id = $1').setParams([1]);
  // o params seria o "[1]"
  public params: any[] = [];

  // Pede o runner da conexão e o nome da tabela
  constructor(public runner: Connection, public tableName?: string) {}

  // Criando o select do queryBuilder
  public select<S = T>(fields: string[], tableName: string = this.tableName): SelectQueryBuilder<S> {
    return new SelectQueryBuilder(this.runner, fields, tableName);
  }

  // public insert<I = T>(fields: string[], tableName: string = this.tableName): InsertQueryBuilder<I> {
  //   return new InsertQueryBuilder(this.runner, fields, tableName);
  // }

  public getQuery() {
    return [this.getSQL(), this.params] as const;
  }

  abstract getSQL(): string;
}

export default QueryBuilder;
