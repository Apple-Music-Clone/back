import { Service } from "../decorators/http/service.decorator";
import { PostgresConnectionDriver } from "../lib/orm/drivers/postgres/postgres.driver";
import { PostgresQueryRunner } from "../lib/orm/drivers/postgres/postgres.query_runner";
import { Entity } from "../lib/orm/entity/entity";
import { TableRef } from "../lib/orm/query_builder/query-expression-map";
import { Repository } from "../lib/orm/repository/repository.orm";
import { Class } from "../lib/utils/utils";

@Service()
export class DatabaseService {
  public connection = new PostgresConnectionDriver({
    host: "motty.db.elephantsql.com",
    user: "nhhtrilt",
    password: "079rgDk8jAjySHV-ddzL66ggSVCu6SiO",
    database: "nhhtrilt",
    min: 1,
    max: 5,
    idleTimeoutMillis: 5000,
    query_timeout: 30000,
  });

  public runner = new PostgresQueryRunner(this.connection);

  constructor() {}

  get build() {
    return this.runner.build.bind(this.runner);
  }

  get transaction() {
    return this.runner.transaction.bind(this.runner);
  }

  public repositoryFor<E>(entity: Class<E>): Repository<E> {
    return new Repository<E>(
      this.runner,
      Reflect.getMetadata("entity:entity", entity)
    );
  }
}
