import { KeyValue } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadingService, RadioButtonLazyLoad } from 'common';
import { Filters } from '../../classes/filters';

@Component({
  selector: 'grid-widget-side-menu',
  templateUrl: './grid-widget-side-menu.component.html',
  styleUrls: ['./grid-widget-side-menu.component.scss']
})
export class GridWidgetSideMenuComponent extends RadioButtonLazyLoad implements OnInit {
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


  onRadioButtonChange(radioButton: ElementRef<HTMLElement>) {
    this.onSortChange(this.sortOptions[this.tabElements.indexOf(radioButton)]);
  }
}