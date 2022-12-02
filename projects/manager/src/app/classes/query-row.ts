import { AutoQueryType, ComparisonOperatorType, LogicalOperatorType, QueryType } from "./enums";
import { Item } from "./item";

export class QueryRow {
    public queryType?: QueryType;
    public logicalOperatorType?: LogicalOperatorType;
    public comparisonOperatorType?: ComparisonOperatorType;
    public item?: Item;
    public intValue?: number;
    public date?: Date;
    public price?: number;
    public auto?: AutoQueryType;

    constructor(init?: {
        logicalOperatorType?: LogicalOperatorType,
        queryRow?: QueryRow
    }) {
        if (!init) {
            this.queryType = QueryType.None;
        } else {
            if (init.logicalOperatorType != undefined) {
                this.logicalOperatorType = init.logicalOperatorType;
            } else {
                this.queryType = init.queryRow?.queryType;
                this.logicalOperatorType = init.queryRow?.logicalOperatorType;
                this.comparisonOperatorType = init.queryRow?.comparisonOperatorType;
                this.item = init.queryRow?.item;
                this.intValue = init.queryRow?.intValue;
                this.date = init.queryRow?.date;
                this.price = init.queryRow?.price;
                this.auto = init.queryRow?.auto;
            }
        }
    }
}