import { KeyValue } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GridData } from '../../classes/grid-data';
import { GridWidgetData } from '../../classes/grid-widget-data';
import { Product } from '../../classes/product';
import { Widget } from '../../classes/widget';
import { GridWidgetSideMenuComponent } from '../../components/grid-widget-side-menu/grid-widget-side-menu.component';
import { GridWidgetService } from '../../services/grid-widget/grid-widget.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SpinnerService } from '../../services/spinner/spinner.service';

@Component({
  selector: 'grid-widget',
  templateUrl: './grid-widget.component.html',
  styleUrls: ['./grid-widget.component.scss']
})
export class GridWidgetComponent extends Widget {
  public gridData!: GridData;
  public sortOptions: Array<KeyValue<string, string>> = [
    {
      key: 'Price: Low to High',
      value: 'price-asc'
    },
    {
      key: 'Price: High to Low',
      value: 'price-desc'
    },
    {
      key: 'Highest Rating',
      value: 'rating'
    },
    {
      key: 'Newest',
      value: 'newest'
    }
  ]

  private gridWidgetSideMenu!: GridWidgetSideMenuComponent;

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private lazyLoadingService: LazyLoadingService,
    private gridWidgetService: GridWidgetService,
    private spinnerService: SpinnerService
  ) { super() }

  ngOnInit() {
    if (this.route.snapshot.queryParamMap.has('search')) {
      this.sortOptions.unshift({
        key: 'Best Match',
        value: 'best-match'
      });
    }
  }


  setWidget(gridWidgetData: GridWidgetData): void {
    this.gridData = gridWidgetData.gridData;
    if (this.gridWidgetSideMenu) this.gridWidgetSideMenu.filters = this.gridData.filters;
    super.setWidget(gridWidgetData);

    this.gridWidgetService.gridData.subscribe((gridData: GridData) => {
      this.gridData = gridData;
      if (this.gridWidgetSideMenu) this.gridWidgetSideMenu.filters = this.gridData.filters;
    });
  }



  clearFilters() {
    this.router.navigate([], {
      queryParams: { filters: null },
      queryParamsHandling: 'merge'
    });
  }


  getPageNumber() {
    return this.route.snapshot.queryParams.page ? parseInt(this.route.snapshot.queryParams.page) : 1;
  }


  setSortOption() {
    const index = Math.max(0, this.sortOptions.findIndex(x => x.value == this.route.snapshot.queryParams['sort']));
    return this.sortOptions[index];
  }


  onSortChange(sortOption: KeyValue<string, string>) {
    this.router.navigate([], {
      queryParams: { sort: sortOption.value, page: null },
      queryParamsHandling: 'merge'
    });
  }


  async onHamburgerButtonClick() {
    this.spinnerService.show = true;
    const { GridWidgetSideMenuComponent } = await import('../../components/grid-widget-side-menu/grid-widget-side-menu.component');
    const { GridWidgetSideMenuModule } = await import('../../components/grid-widget-side-menu/grid-widget-side-menu.module');

    this.lazyLoadingService.getComponentAsync(GridWidgetSideMenuComponent, GridWidgetSideMenuModule, this.lazyLoadingService.container)
      .then((gridWidgetSideMenu: GridWidgetSideMenuComponent) => {
        this.gridWidgetSideMenu = gridWidgetSideMenu;
        gridWidgetSideMenu.sortOptions = this.sortOptions;
        gridWidgetSideMenu.filters = this.gridData.filters;
        this.spinnerService.show = false;
      });
  }

  trackProduct(index: number, product: Product) {
    return product.id;
  }
}