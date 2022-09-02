import { Component, Input, OnInit } from '@angular/core';
import { AutoQueryType, ComparisonOperatorType, LogicalOperatorType, QueryRow, QueryType } from 'widgets';

@Component({
  selector: 'query-row',
  templateUrl: './query-row.component.html',
  styleUrls: ['./query-row.component.scss']
})
export class QueryRowComponent implements OnInit {
  @Input() queryRow!: QueryRow;
  public QueryType = QueryType;
  public LogicalOperatorType = LogicalOperatorType;
  public AutoQueryType = AutoQueryType;

  constructor() { }

  ngOnInit(): void {
  }

  getComparisonOperator(comparisonOperatorType: ComparisonOperatorType): string {
    let comparisonOperator!: string;

    switch (comparisonOperatorType) {
      case ComparisonOperatorType.NotEqual:
        comparisonOperator = '!=';
        break;

      case ComparisonOperatorType.GreaterThan:
        comparisonOperator = '>';
        break;

      case ComparisonOperatorType.GreaterThanOrEqual:
        comparisonOperator = '>=';
        break;

      case ComparisonOperatorType.LessThan:
        comparisonOperator = '<';
        break;

      case ComparisonOperatorType.LessThanOrEqual:
        comparisonOperator = '<=';
        break;

      default:
        comparisonOperator = '=';
        break;
    }

    return comparisonOperator;
  }
}
