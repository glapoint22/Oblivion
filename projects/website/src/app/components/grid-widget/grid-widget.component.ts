import { KeyValue } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GridData } from '../../classes/grid-data';
import { GridWidgetSideMenuComponent } from '../../components/grid-widget-side-menu/grid-widget-side-menu.component';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';

@Component({
  selector: 'grid-widget',
  templateUrl: './grid-widget.component.html',
  styleUrls: ['./grid-widget.component.scss']
})
export class GridWidgetComponent {
  @Input() gridData!: GridData;
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

  private gridWidgetSideMenu!: GridWidgetSideMenuComponent;

  constructor(public route: ActivatedRoute, private router: Router, private lazyLoadingService: LazyLoadingService) { }

  ngOnInit() {
    if (this.route.snapshot.queryParamMap.has('search')) {
      this.sortOptions.unshift({
        key: 'Best Match',
        value: 'best-match'
      });
    }
  }

  ngOnChanges() {
    this.setSortOption();
    if (this.gridWidgetSideMenu) {
      this.gridWidgetSideMenu.gridData = this.gridData;
    }
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
      .then((gridWidgetSideMenu: GridWidgetSideMenuComponent) => {
        this.gridWidgetSideMenu = gridWidgetSideMenu;
        this.gridWidgetSideMenu.gridData = this.gridData;
        this.gridWidgetSideMenu.sortOptions = this.sortOptions;
        this.gridWidgetSideMenu.selectedSortOption = this.selectedSortOption;
      });
  }
}