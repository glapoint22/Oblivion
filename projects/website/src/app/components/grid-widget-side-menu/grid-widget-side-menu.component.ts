import { KeyValue } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Filters } from '../../classes/filters';
import { LazyLoad } from '../../classes/lazy-load';

@Component({
  selector: 'grid-widget-side-menu',
  templateUrl: './grid-widget-side-menu.component.html',
  styleUrls: ['./grid-widget-side-menu.component.scss']
})
export class GridWidgetSideMenuComponent extends LazyLoad {
  public sortOptions!: Array<KeyValue<string, string>>;
  public filters!: Filters;

  constructor(private router: Router, private route: ActivatedRoute) { super() }

  onOpen() {
    document.getElementById('menuContainer')?.focus();
  }

  onSortChange(sortOption: KeyValue<string, string>) {
    this.router.navigate([], {
      queryParams: { sort: sortOption.value, page: null },
      queryParamsHandling: 'merge'
    });
  }

  setSortOption() {
    const index = Math.max(0, this.sortOptions.findIndex(x => x.value == this.route.snapshot.queryParams['sort']));
    return this.sortOptions[index];
  }
}