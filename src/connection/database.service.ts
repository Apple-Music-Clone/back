import {Service} from "../decorators/http/service.decorator";
import {PostgresConnectionDriver} from "../lib/orm/drivers/postgres/postgres.driver";
import {PostgresQueryRunner} from "../lib/orm/drivers/postgres/postgres.query_runner";
import {SelectQueryBuilder} from "../lib/orm/query_builder/select/select_query_builder";


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
    })

    public runner = new PostgresQueryRunner(this.connection);

    constructor() {
    }

    public build<T = any>() {
        return new SelectQueryBuilder<T>(this.connection, this.runner);
    }

    public async transaction(fn: (transaction) => Promise<void>) {
        await this.runner.startTransaction();

        return Promise.resolve(fn(this.runner)).catch(async err => {
            await this.runner.rollbackTransaction();

            return Promise.reject(err);
        });
    }
}
