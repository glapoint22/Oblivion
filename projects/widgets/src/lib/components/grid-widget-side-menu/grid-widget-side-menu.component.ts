import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Filters, LazyLoad, LazyLoadingService } from 'common';

@Component({
  selector: 'grid-widget-side-menu',
  templateUrl: './grid-widget-side-menu.component.html',
  styleUrls: ['./grid-widget-side-menu.component.scss']
})
export class GridWidgetSideMenuComponent extends LazyLoad implements OnInit {
  public sortOptions!: Array<KeyValue<string, string>>;
  public filters!: Filters;

  constructor
    (
      lazyLoadingService: LazyLoadingService,
      private router: Router,
      private route: ActivatedRoute
    ) { super(lazyLoadingService) }


  ngOnInit(): void {
    this.addEventListeners();
  }

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