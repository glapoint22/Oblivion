import { KeyValue } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoad } from '../../classes/lazy-load';
import { GridWidgetSideMenuService } from '../../services/grid-widget-side-menu/grid-widget-side-menu.service';

@Component({
  selector: 'grid-widget-side-menu',
  templateUrl: './grid-widget-side-menu.component.html',
  styleUrls: ['./grid-widget-side-menu.component.scss']
})
export class GridWidgetSideMenuComponent extends LazyLoad {

  constructor(private router: Router, public gridWidgetSideMenuService: GridWidgetSideMenuService) { super() }

  onOpen() {
    document.getElementById('menuContainer')?.focus();
  }

  onSortChange(sortOption: KeyValue<string, string>) {
    this.router.navigate([], {
      queryParams: { sort: sortOption.value, page: null },
      queryParamsHandling: 'merge'
    });

    this.gridWidgetSideMenuService.selectedSortOption = sortOption;
  }
}