import { Class } from "../../utils/utils";
import { Entity } from "../entity/entity";
import { QueryRunner } from "../query_runner/query_runner.interface";

export class Repository<E> {
  constructor(public runner: QueryRunner, public entity: Entity<E>) {}

  public async findAll(): Promise<E[]> {
    const columnNames = this.entity.columnNames;

    return this.runner
      .build()
      .select(columnNames)
      .from(this.entity.ref)
      .getMany()
      .then((rows) => rows.map((row) => this.entity.create(row)));
  }

  public findOne(id: any): Promise<E> {
    const columnNames = this.entity.columnNames;
    const pk = this.entity.pk?.name;

    return this.runner
      .build()
      .select(columnNames)
      .from(this.entity.ref)
      .where(`${this.entity.ref.columnRef(pk)} = :id`, { id })
      .getOne()
      .then((row) => this.entity.create(row));
  }

  public createOne(body: E): Promise<E> {
    const columnNames = this.entity.columnNames;

    return this.runner
      .build()
      .insert()
      .into(this.entity.ref)
      .values(Entity.toRaw(body))
      .returning(columnNames)
      .save()
      .then((row) => this.entity.create(row));
  }

  public updateOne(id: any, body: E): Promise<E> {
    const columnNames = this.entity.columnNames;
    const pk = this.entity.pk?.name;

    return this.runner
      .build()
      .update()
      .table(this.entity.ref)
      .values(Entity.toRaw(body))
      .where(`${this.entity.ref.columnRef(pk)} = :id`, { id })
      .returning(columnNames)
      .save()
      .then((row) => this.entity.create(row));
  }

  public save(entity: E): Promise<E> {
    const pkName = this.entity.pkName;

    if (entity[pkName] === undefined) {
      return this.createOne(entity);
    }

    return this.updateOne(entity[pkName], entity);
  }

  public async deleteOne(id: any): Promise<void> {
    const pk = this.entity.pk?.name;

    await this.runner
      .build()
      .delete()
      .from(this.entity.ref)
      .where(`${this.entity.ref.columnRef(pk)} = :id`, { id })
      .execute();
  }
}
