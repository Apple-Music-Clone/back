import { Column } from "./decorators/orm/column.decorator";
import { Entity } from "./decorators/orm/entity.decorator";

@Entity()
export class Teste {
  @Column({ type: "integer", primary: true })
  public id: string;
}
