import { Query } from "./query";

export class QueryGroup {
    public selected?: boolean;
    

    constructor(public query: Query, public parentQuery: Query) { }
}