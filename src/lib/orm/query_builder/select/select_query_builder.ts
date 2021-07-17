import Connection from "../../../../connection/connection";
import QueryBuilder from "../query_builder";

export interface WhereCondition {
  condition: string;
  type: "and" | "or";
  params: any;
}

export interface QueryJoin {
  relation: string;
  condition: string;
  alias: string;
  type: 'inner' | 'left' | 'right' | 'alter' | 'cross'
}

export interface OrderBy {
  field: string;
  type: 'asc' | 'desc';
}

// Criando o SelectQueryBuilder que extende o QueryBuilder
export class SelectQueryBuilder<T> extends QueryBuilder<T> {
  // Todos os joins que foram passados para o queryBuilder
  private joins: QueryJoin[] = [];
  
  // Todos as condições que foram passados para o queryBuilder
  private conditions: WhereCondition[] = [];
  
  // Todos as ordens que foram passados para o queryBuilder
  private orders: OrderBy[] = [];
  
  // Limit passado para o queryBuilder (Padrão "null")
  private limitValue: number = -1;
  
  // Offset passado para o queryBuilder (Padrão "null")
  private offsetValue: number = -1;
  
  constructor(public runner: Connection, public fields: string[], public tableName: string) {
    super(runner);
  }
  
  // Montando o SQL
  public getSQL() {
    // Pega todos os fields pro select
    const fields = this.fields.map(field => {
      // Se o field tiver algum "." ou tiver "*" (Exemplo.: public.User ou * ou User.*)
      if (field.includes(".") || field.includes('*')) {
        // Retorna o field diretamente
        return field;
      }

      // Adiciona o nome da tabela e o field entre aspas duplas
      return `"${this.tableName}"."${field}"`;
    }).join(',');

    // Gerando nome da tabela
    let table = this.tableName.includes('.') ? this.tableName : `"${this.tableName}"`;

    // Montando as partes do SQL por array
    let sqlParts = [`SELECT ${fields} FROM ${table}`];

    // Se tiver algum JOIN é adicionado
    if (this.joins.length > 0) {
      sqlParts.push(this.parseJoinQuery());
    }
    
    // Se tiver alguma condição é adicionado
    if (this.conditions.length > 0) {
      sqlParts.push(this.parseWhereQuery())
    }
    
    // Se tiver alguma ordem é adicionado
    if (this.orders.length > 0) {
      sqlParts.push(this.parseOrderQuery());
    }
    
    // Se tiver algum offset é adicionado
    if (this.offsetValue >= 0) {
      sqlParts.push(`OFFSET ${this.offsetValue}`);
    }
    
    // Se tiver algum limit é adicionado
    if (this.limitValue >= 0) {
      sqlParts.push(`LIMIT ${this.limitValue}`);
    }

    // Retorna juntando o array por espaços
    return sqlParts.join(' ');
  }

  // Setando o tableName do from
  public from(tableName: string) {
    this.tableName = tableName;
    
    return this;
  }

  // Where
  // Adicionando a condição (com o AND por padrão)
  public addWhere(condition: string, params?: any) {
    this.conditions.push({condition, params, type: 'and'});
    
    return this;
  }
  
  // Adicionando a condição (com o "OR")
  public addOrWhere(condition: string, params?: any) {
    this.conditions.push({condition, params, type: 'or'});
    
    return this;
  }
  
  // Joins
  // Adicionando todos os JOINS
  
  public innerJoin(relation: string, alias: string, condition: string) {
    this.joins.push({relation, condition, alias, type: 'inner'});

    return this;
  }

  public leftJoin(relation: string, alias: string, condition: string) {
    this.joins.push({relation, condition, alias, type: 'left'});

    return this;
  }

  public rightJoin(relation: string, alias: string, condition: string) {
    this.joins.push({relation, condition, alias, type: 'right'});

    return this;
  }

  public alterJoin(relation: string, alias: string, condition: string) {
    this.joins.push({relation, condition, alias, type: 'alter'});

    return this;
  }

  public crossJoin(relation: string, alias: string, condition: string) {
    this.joins.push({relation, condition, alias, type: 'cross'});

    return this;
  }

  // Add order

  public addOrder(field: string, type: OrderBy['type'] = 'asc') {
    this.orders.push({field, type});

    return this;
  }

  // Pagination

  public limit(limit: number) {
    this.limitValue = limit;

    return this;
  }

  public offset(offset: number) {
    this.offsetValue = offset;

    return this;
  }

  // Parsers

  private parseWhereQuery() {
    // Inicia com o "WHERE"
    let filterParts = ['WHERE'];

    // Percorre todas as condições
    for (let i = 0; i < this.conditions.length; i++) {
      // Pega a condição
      const condition = this.conditions[i];
      
      // Se não for a primeira condição (para não adicionar o OR ou o AND no começo. 
      // Exemplo para não ficar.: SELECT * FROM public.User AND WHERE)
      if (i > 0) {
        if (condition.type === 'or') {
          filterParts.push('OR')
        } else if (condition.type === 'and') {
          filterParts.push('AND')
        }
      }

      filterParts.push(condition.condition);
    }

    return filterParts.join(' ');
  }

  private parseJoinQuery() {
    let filterParts = [];
    
    // Percorre todas os joins
    for (let i = 0; i < this.joins.length; i++) {
      // Pega o join
      const join = this.joins[i];
      
      // Verifica qual é o tipo do join e adiciona na parte do SQL
      if (join.type === 'inner') {
        filterParts.push('INNER JOIN')
      } else if (join.type === 'left') {
        filterParts.push('LEFT JOIN')
      } else if (join.type === 'right') {
        filterParts.push('RIGHT JOIN')
      } else if (join.type === 'alter') {
        filterParts.push('ALTER JOIN')
      } else if (join.type === 'cross') {
        filterParts.push('CROSS JOIN')
      }
      
      // Adiciona a relação após ter adicionado o tipo do JOIN
      filterParts.push(`"${join.relation}"`);

      // Se tiver um alias no join
      // Exemplo.: .... INNER JOIN public.User u
      // o "u" é o alias da entidade
      if (join.alias) {
        filterParts.push(`"${join.alias}"`);
      }

      // Adicionando as condições do JOIN
      if (join.condition) {
        filterParts.push(`ON ${join.condition}`);
      }

    }

    return filterParts.join(' ');
  }

  private parseOrderQuery() {
    // Inicia com o "ORDER BY"
    let filterParts = ['ORDER BY'];
    // Campos do ORDER
    const fields = [];

    // Percorrendo as ordens
    for (let i = 0; i < this.orders.length; i++) {
      // Pegando uma ordem
      const order = this.orders[i];

      // Verificando se for "desc", para adicionar o "DESC", pois o padrão é "ASC"
      if (order.type === 'desc') {
        fields.push(`"${order.field}" DESC`);
      } else {
        fields.push(`"${order.field}"`);
      }

    }
    
    filterParts.push(fields.join(','));

    return filterParts.join(' ');
  }

  // Params

  public setParams(params: any[]) {
    this.params = params;

    return this;
  }

  // Returns

  public getMany(): Promise<T[]> {
    const [query, params] = this.getQuery();

    return this.runner.query(query, params);
  }

}
