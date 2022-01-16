import { Component, Input, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FilterParam } from '../../classes/filter-param';
import { Filters } from '../../classes/filters';
import { QueryFilter } from '../../classes/query-filter';

@Component({
  selector: 'filters-panel',
  templateUrl: './filters-panel.component.html',
  styleUrls: ['./filters-panel.component.scss']
})
export class FiltersPanelComponent implements OnChanges {
  @Input() filters!: Filters;
  public filterParams!: Array<FilterParam>;

  constructor(private route: ActivatedRoute) { }

  ngOnChanges() {
    this.filterParams = [];

    // Get the filters from the url
    let filterString: string = this.route.snapshot.queryParams['filters'];

    // If we have filters
    if (filterString) {
      filterString = decodeURIComponent(filterString);

      // Create the filter params array
      // Each filter will be split into its caption and options
      filterString.split('|')
        .forEach((value: string, index: number) => {
          if (value) {
            if (index % 2 == 0) {
              this.filterParams.push({
                caption: value,
                options: []
              });
            } else {
              this.filterParams[this.filterParams.length - 1].options = value.split(',');
            }
          }
        });
    }
  }

  trackFilter(index: number, filter: QueryFilter) {
    return filter.caption;
  }
}