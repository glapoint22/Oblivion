import { Query } from "./query";
import { QueryGroup } from "./query-group";
import { QueryItem } from "./query-item";
import { AutoQueryType, ComparisonOperatorType, LogicalOperatorType, QueryType } from "./widget-enums";

export class QueryRow {
    public queryGroup?: QueryGroup;
    public queryType?: QueryType;
    public comparisonOperatorType?: ComparisonOperatorType;
    public item?: QueryItem;
    public integer?: number;
    public date?: Date;
    public price?: number;
    public auto?: AutoQueryType; 
    public logicalOperatorType?: LogicalOperatorType;
    public selected?: boolean;
    public query?: Query;
}