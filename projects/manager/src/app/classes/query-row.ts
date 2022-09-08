import { AutoQueryType, ComparisonOperatorType, LogicalOperatorType, QueryType } from "./enums";
import { Item } from "./item";
import { QueryGroup } from "./query-group";

export class QueryRow {
    public queryGroup?: QueryGroup;
    public queryType?: QueryType;
    public comparisonOperatorType?: ComparisonOperatorType;
    public item?: Item;
    public integer?: number;
    public date?: Date;
    public price?: number;
    public auto?: AutoQueryType; 
    public logicalOperatorType?: LogicalOperatorType;
    public selected?: boolean;
}