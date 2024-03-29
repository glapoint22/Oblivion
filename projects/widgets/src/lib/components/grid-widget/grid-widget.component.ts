import { KeyValue } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadingService, SpinnerAction, SummaryProduct, DropdownType } from 'common';
import { GridData } from '../../classes/grid-data';
import { GridWidgetData } from '../../classes/grid-widget-data';
import { Widget } from '../../classes/widget';
import { WidgetType } from '../../classes/widget-enums';
import { GridWidgetSideMenuComponent } from '../../components/grid-widget-side-menu/grid-widget-side-menu.component';
import { GridWidgetService } from '../../services/grid-widget/grid-widget.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'grid-widget',
  templateUrl: './grid-widget.component.html',
  styleUrls: ['./grid-widget.component.scss']
})
export class GridWidgetComponent extends Widget {
  public gridData!: GridData;
  public DropdownType = DropdownType;
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

  public clientWidth!: number;

  private gridWidgetSideMenu!: GridWidgetSideMenuComponent;
  private gridDataSubscription!: Subscription;

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private lazyLoadingService: LazyLoadingService,
    private gridWidgetService: GridWidgetService,
  ) { super() }



  // ------------------------------------------------------------- Ng On Init ------------------------------------------------------------------
  ngOnInit() {
    this.type = WidgetType.Grid;

    if (this.route.snapshot.queryParamMap.has('search')) {
      this.sortOptions.unshift({
        key: 'Best Match',
        value: 'best-match'
      });
    }

    this.onWindowResize();
  }


  // -------------------------------------------------------------- Set Widget ------------------------------------------------------------------
  setWidget(gridWidgetData: GridWidgetData): void {
    this.gridData = gridWidgetData.gridData;
    if (this.gridWidgetSideMenu) this.gridWidgetSideMenu.filters = this.gridData.filters;
    super.setWidget(gridWidgetData);

    this.gridDataSubscription = this.gridWidgetService.gridData.subscribe((gridData: GridData) => {
      this.gridData = gridData;
      if (this.gridWidgetSideMenu) this.gridWidgetSideMenu.filters = this.gridData.filters;
    });
  }



  // -------------------------------------------------------------- Clear Filters ------------------------------------------------------------------
  clearFilters() {
    this.router.navigate([], {
      queryParams: {
        filters: null,
        // nicheId: null,
        // nicheName: null,
        // subnicheId: null,
        // subnicheName: null
      },
      queryParamsHandling: 'merge'
    });
  }



  // -------------------------------------------------------------- Get Page Number ------------------------------------------------------------------
  getPageNumber() {
    return this.route.snapshot.queryParams.page ? parseInt(this.route.snapshot.queryParams.page) : 1;
  }




  // -------------------------------------------------------------- Set Sort Option ------------------------------------------------------------------
  setSortOption() {
    const index = Math.max(0, this.sortOptions.findIndex(x => x.value == this.route.snapshot.queryParams['sort']));
    return this.sortOptions[index];
  }






  // --------------------------------------------------------------- On Sort Change ------------------------------------------------------------------
  onSortChange(sortOption: KeyValue<string, string>) {
    this.router.navigate([], {
      queryParams: { sort: sortOption.value, page: null },
      queryParamsHandling: 'merge'
    });
  }






  // ---------------------------------------------------------- On Hamburger Button Click -----------------------------------------------------------
  async onHamburgerButtonClick() {
    this.lazyLoadingService.load(async () => {
      const { GridWidgetSideMenuComponent } = await import('../../components/grid-widget-side-menu/grid-widget-side-menu.component');
      const { GridWidgetSideMenuModule } = await import('../../components/grid-widget-side-menu/grid-widget-side-menu.module');

      return {
        component: GridWidgetSideMenuComponent,
        module: GridWidgetSideMenuModule
      }
    }, SpinnerAction.StartEnd)
      .then((gridWidgetSideMenu: GridWidgetSideMenuComponent) => {
        this.gridWidgetSideMenu = gridWidgetSideMenu;
        gridWidgetSideMenu.sortOptions = this.sortOptions;
        gridWidgetSideMenu.filters = this.gridData.filters;
      });
  }


  // ---------------------------------------------------------- Track Product -----------------------------------------------------------
  trackProduct(index: number, product: SummaryProduct) {
    return product.id;
  }




  // --------------------------------------------------------- On Window Resize -----------------------------------------------------------
  @HostListener('window:resize')
  onWindowResize() {
    this.clientWidth = document.documentElement.clientWidth;
  }




  // ------------------------------------------------------------ Get Data -----------------------------------------------------------
  getData(): GridWidgetData {
    const gridWidgetData = super.getData() as GridWidgetData;



    return gridWidgetData;
  }



  ngOnDestroy() {
    if (this.gridDataSubscription) this.gridDataSubscription.unsubscribe();
  }
}