import { ComparisonOperatorType, LogicalOperatorType, QueryType } from "./enums";

export class Query {
    queryType!: QueryType;
    logicalOperator!: LogicalOperatorType;
    comparisonOperator?: ComparisonOperatorType;
    intValue?: number;
    intValues?: Array<number>;
    stringValue?: string;
    stringValues?: Array<string>;
    doubleValue?: number;
    dateValue?: Date;
    subQueries?: Array<Query>;
}