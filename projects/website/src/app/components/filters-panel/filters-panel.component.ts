import { Component, Input, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { FilterParam } from '../../classes/filter-param';
import { Filters } from '../../classes/filters';

@Component({
  selector: 'filters-panel',
  templateUrl: './filters-panel.component.html',
  styleUrls: ['./filters-panel.component.scss']
})
export class FiltersPanelComponent implements OnChanges {
  @Input() filters!: Filters;
  public filterParmsSubject: BehaviorSubject<Array<FilterParam>> = new BehaviorSubject<Array<FilterParam>>([]);

  constructor(private route: ActivatedRoute) { }

  ngOnChanges() {
    const filterParams: Array<FilterParam> = [];
    let filterString: string = this.route.snapshot.queryParams['filters'];
    
    if (filterString) {
      filterString = decodeURIComponent(filterString);

      

      filterString.split('|')
        .forEach((value: string, index: number) => {
          if (value) {
            if (index % 2 == 0) {
              filterParams.push({
                caption: value,
                options: []
              });
            } else {
              filterParams[filterParams.length - 1].options = value.split(',');
            }
          }
        });
    }

    this.filterParmsSubject.next(filterParams);
  }
}