import { Component, Input } from '@angular/core';
import { QueryElementType } from '../../classes/enums';
import { Query } from '../../classes/query';

@Component({
  selector: 'query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.scss']
})
export class QueryComponent {
  @Input() query!: Query;
  public QueryElementType = QueryElementType;
}