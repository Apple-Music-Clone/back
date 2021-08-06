import { Column } from "../decorators/orm/column.decorator";
import { Entity } from "../decorators/orm/entity.decorator";

@Entity()
export class Playlist {
  @Column({ type: "integer", primary: true, autoIncrement: true })
  public id: string;

  @Column({ type: "varchar" })
  public coverImage: string;

  @Column({ type: "varchar" })
  public title: string;

  @Column({ type: "integer", reference: '"user"("id")', exclude: true })
  public user_id: string;
}
