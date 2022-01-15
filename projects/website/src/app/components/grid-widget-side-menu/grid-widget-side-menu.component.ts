import { KeyValue } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GridWidget } from '../../classes/grid-widget';
import { LazyLoad } from '../../classes/lazy-load';

@Component({
  selector: 'grid-widget-side-menu',
  templateUrl: './grid-widget-side-menu.component.html',
  styleUrls: ['./grid-widget-side-menu.component.scss']
})
export class GridWidgetSideMenuComponent extends LazyLoad {
  public gridWidget!: GridWidget;
  public selectedSortOption!: KeyValue<string, string>;
  public sortOptions!: Array<KeyValue<string, string>>;

  constructor(private router: Router) { super() }

  onOpen() {
    document.getElementById('menuContainer')?.focus();
  }

  onSortChange(sortOption: KeyValue<string, string>) {
    this.router.navigate([], {
      queryParams: { sort: sortOption.value, page: null },
      queryParamsHandling: 'merge'
    });

    this.selectedSortOption = sortOption;
  }

  clearAll() {
    this.router.navigate([], {
      queryParams: {
        filters: null,
        sort: null,
        categoryName: null,
        categoryId: null,
        nicheName: null,
        nicheId: null
      },
      queryParamsHandling: 'merge'
    });
    this.selectedSortOption = this.sortOptions[0];
  }
}