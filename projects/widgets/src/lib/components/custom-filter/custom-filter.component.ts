import { Component } from '@angular/core';
import { QueryFilter } from 'common';
import { Filter } from '../../classes/filter';

@Component({
  selector: 'custom-filter',
  templateUrl: './custom-filter.component.html',
  styleUrls: ['./custom-filter.component.scss']
})
export class CustomFilterComponent extends Filter<QueryFilter> { }