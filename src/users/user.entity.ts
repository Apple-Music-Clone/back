import { Column } from "../decorators/orm/column.decorator";
import { Entity } from "../decorators/orm/entity.decorator";

@Entity()
export class User {
  @Column({ type: "integer", primary: true })
  public id: string;

  @Column({ type: "uuid" })
  public uuid: string;

  @Column({ type: "varchar", name: "name" })
  public nome: string;

  // @Column({ type: "varchar" })
  // public country: string;

  // @Column({ type: "simplearray" })
  // public devices: string[];

  // playlists: any[];
  // favoritedPlaylists: any[];
  // likedMusics: any[];
  // library: any[];
}
