import { Component, Input, QueryList, ViewChildren } from '@angular/core';
import { Query } from '../../classes/query';
import { SelectableQueryRow } from '../../classes/selectable-query-row';

@Component({
  selector: 'query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.scss']
})
export class QueryComponent {
  @Input() query!: Query;
  @ViewChildren('row') queryRows!: QueryList<SelectableQueryRow>;
}