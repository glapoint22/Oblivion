import { AutoQueryType, ComparisonOperatorType, LogicalOperatorType, QueryType } from "./enums";
import { Item } from "./item";
import { Query } from "./query";
import { QueryElement } from "./query-element";

export class QueryRow implements QueryElement {
    public comparisonOperatorType?: ComparisonOperatorType;
    public item?: Item;
    public integer?: number;
    public date?: Date;
    public price?: number;
    public auto?: AutoQueryType;
    public selected!: boolean;
    public parent!: Query;

    constructor(public queryType?: QueryType, public logicalOperatorType?: LogicalOperatorType) { }
}