import { Component } from '@angular/core';
import { Filter } from '../../classes/filter';
import { QueryFilter } from '../../classes/query-filter';

@Component({
  selector: 'custom-filter',
  templateUrl: './custom-filter.component.html',
  styleUrls: ['./custom-filter.component.scss']
})
export class CustomFilterComponent extends Filter<QueryFilter> { }