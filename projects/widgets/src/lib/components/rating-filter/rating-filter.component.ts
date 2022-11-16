import { Component } from '@angular/core';
import { Filter } from '../../classes/filter';
import { QueryFilter } from '../../classes/query-filter';

@Component({
  selector: 'rating-filter',
  templateUrl: './rating-filter.component.html',
  styleUrls: ['./rating-filter.component.scss']
})
export class RatingFilterComponent extends Filter<QueryFilter> { }