import { Component, Input } from '@angular/core';
import { Query } from '../../classes/query';
import { QueryElement } from '../../classes/query-element';
import { QueryGroup } from '../../classes/query-group';
import { QueryRow } from '../../classes/query-row';

@Component({
  selector: 'query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.scss']
})
export class QueryComponent {
  @Input() query!: Query;
  public QueryRow = QueryRow;
  public QueryGroup = QueryGroup;

  isQueryRow(element: QueryElement): boolean {
    return element instanceof QueryRow;
  }

  isQueryGroup(element: QueryElement): boolean {
    return element instanceof QueryGroup;
  }

  getGroup(element: QueryElement): QueryGroup {
    return element as QueryGroup;
  }
}