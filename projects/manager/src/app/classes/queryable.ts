import { Query } from "./query";

export interface Queryable {
    query: Query;
    products: Array<any>;
}