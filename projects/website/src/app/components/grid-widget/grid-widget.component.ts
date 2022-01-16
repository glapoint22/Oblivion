import { KeyValue } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GridData } from '../../classes/grid-data';
import { GridWidgetData } from '../../classes/grid-widget-data';
import { Product } from '../../classes/product';
import { QueryParams } from '../../classes/query-params';
import { Widget } from '../../classes/widget';
import { DataService } from '../../services/data/data.service';
import { GridWidgetSideMenuService } from '../../services/grid-widget-side-menu/grid-widget-side-menu.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';

@Component({
  selector: 'grid-widget',
  templateUrl: './grid-widget.component.html',
  styleUrls: ['./grid-widget.component.scss']
})
export class GridWidgetComponent extends Widget {
  public gridData!: GridData;
  public selectedSortOption!: KeyValue<string, string>;
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

  private currentId: string = '';
  private subscription!: Subscription;


  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private lazyLoadingService: LazyLoadingService,
    private dataService: DataService,
    private gridWidgetSideMenuService: GridWidgetSideMenuService
  ) { super() }

  ngOnInit() {
    if (this.route.snapshot.queryParamMap.has('search')) {
      this.sortOptions.unshift({
        key: 'Best Match',
        value: 'best-match'
      });
    }


    this.subscription = this.route.queryParamMap
      .subscribe((params: ParamMap) => {
        this.setSortOption();

        if (params.get('search') == this.currentId || params.get('categoryId') == this.currentId || params.get('nicheId') == this.currentId) {
          const queryParams = new QueryParams();
          queryParams.set(params);

          this.dataService.post<GridData>('api/Pages/Params', queryParams)
            .subscribe((gridData: GridData) => {
              this.gridData = gridData;
              this.gridWidgetSideMenuService.filters = this.gridData.filters;
            });
        } else {
          this.currentId = params.get('search') || params.get('categoryId') || params.get('nicheId') as string;
          if (this.subscription) this.subscription.unsubscribe();
        }
      });
  }


  setWidget(gridWidgetData: GridWidgetData): void {
    this.gridData = gridWidgetData.gridData;
    this.gridWidgetSideMenuService.filters = this.gridData.filters;
    super.setWidget(gridWidgetData);
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
    this.selectedSortOption = this.sortOptions[index];
  }


  onSortChange(sortOption: KeyValue<string, string>) {
    this.router.navigate([], {
      queryParams: { sort: sortOption.value, page: null },
      queryParamsHandling: 'merge'
    });
  }


  async onHamburgerButtonClick() {
    const { GridWidgetSideMenuComponent } = await import('../../components/grid-widget-side-menu/grid-widget-side-menu.component');
    const { GridWidgetSideMenuModule } = await import('../../components/grid-widget-side-menu/grid-widget-side-menu.module');

    this.lazyLoadingService.getComponentAsync(GridWidgetSideMenuComponent, GridWidgetSideMenuModule, this.lazyLoadingService.container)
      .then(() => {
        this.gridWidgetSideMenuService.filters = this.gridData.filters;
        this.gridWidgetSideMenuService.sortOptions = this.sortOptions;
        this.gridWidgetSideMenuService.selectedSortOption = this.selectedSortOption;
      });
  }

  trackProduct(index: number, product: Product) {
    return product.id;
  }
}