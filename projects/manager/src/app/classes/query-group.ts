import { Query } from "./query";
import { QueryElement } from "./query-element";

export class QueryGroup implements QueryElement {
    public selected!: boolean;
    public parent!: Query;

    constructor(public query: Query) { }
}