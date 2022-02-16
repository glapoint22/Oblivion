import { Component } from '@angular/core';
import { QueryFilter } from 'common';
import { Filter } from '../../classes/filter';

@Component({
  selector: 'rating-filter',
  templateUrl: './rating-filter.component.html',
  styleUrls: ['./rating-filter.component.scss']
})
export class RatingFilterComponent extends Filter<QueryFilter> { }