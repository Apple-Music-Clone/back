// import Connection from "../../../connection/connection";
//
// export abstract class QueryBuilderBase<T = any> {
//     public params: any[] = [];
//
//     constructor(public runner: Connection, public tableName?: string) {
//     }
//
//     public getQuery() {
//         return [this.getSQL(), this.params] as const;
//     }
//
//     abstract getSQL(): string;
// }
