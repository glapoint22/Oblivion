import { Component } from '@angular/core';
import { take } from 'rxjs';
import { Filter } from '../../classes/filter';
import { FilterParam } from '../../classes/filter-param';
import { QueryFilter } from '../../classes/query-filter';

@Component({
  selector: 'custom-filter',
  templateUrl: './custom-filter.component.html',
  styleUrls: ['./custom-filter.component.scss']
})
export class CustomFilterComponent extends Filter<QueryFilter> {
  ngOnInit() {
    this.filterParmsSubject
      .pipe(take(1))
      .subscribe((filterParams: Array<FilterParam>) => {
        this.filterParams = filterParams;
        this.setFilter();
      });
  }
}