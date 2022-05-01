import { Component, ViewChild } from '@angular/core';
import { LazyLoad, LazyLoadingService } from 'common';
import { FiltersManager } from '../../classes/filters-manager';
import { FiltersService, FiltersType } from '../../services/filters/filters.service';
import { HierarchyComponent } from '../hierarchies/hierarchy/hierarchy.component';
import { MultiColumnListComponent } from '../lists/multi-column-list/multi-column-list.component';

@Component({
  selector: 'filter-form',
  templateUrl: './filter-form.component.html',
  styleUrls: ['./filter-form.component.scss']
})
export class FilterFormComponent extends LazyLoad {
  // Public
  public filtersManager: FiltersManager = new FiltersManager();

  // Decorators
  @ViewChild('filtersHierarchy') filtersHierarchy!: HierarchyComponent;
  @ViewChild('filtersSearch') filtersSearch!: MultiColumnListComponent;

  // constructor
  constructor(lazyLoadingService: LazyLoadingService, private filtersService: FiltersService) {
    super(lazyLoadingService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    
    this.filtersManager.nameWidth = '246px';
    this.filtersManager.typeWidth = '55px';
    this.filtersManager.filtersService = this.filtersService;
    this.filtersManager.filtersType = FiltersType.FilterForm;
    this.filtersManager.filters = this.filtersService.formFilters;
    this.filtersManager.otherFilters = this.filtersService.productFilters;
    this.filtersManager.dataService = this.filtersService.dataService;
    this.filtersManager.sanitizer = this.filtersService.sanitizer;
    this.filtersManager.onClose.subscribe(() => {
      this.close();
    })
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.filtersManager.afterViewInit();
  }

  ngAfterViewChecked() {
    this.filtersManager.filtersSearch = this.filtersSearch;
    this.filtersManager.otherFiltersHierarchy = this.filtersService.productFiltersHierarchyComponent;
    this.filtersManager.filtersHierarchy = this.filtersService.filtersFormHierarchyComponent = this.filtersHierarchy;
    this.filtersManager.searchInput = document.getElementById('filtersFormSearchInput') as HTMLInputElement;
  }

  onOpen(): void {
    this.filtersManager.onOpen();
  }

  onEscape(): void {
    this.filtersManager.onEscape();
  }
}