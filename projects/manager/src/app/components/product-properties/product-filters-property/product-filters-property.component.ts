import { Component, ViewChild } from '@angular/core';
import { ListUpdateType } from '../../../classes/enums';
import { FiltersManager } from '../../../classes/filters-manager';
import { HierarchyUpdate } from '../../../classes/hierarchy-update';
import { FiltersService, FiltersType } from '../../../services/filters/filters.service';
import { HierarchyComponent } from '../../hierarchies/hierarchy/hierarchy.component';
import { MultiColumnListComponent } from '../../lists/multi-column-list/multi-column-list.component';

@Component({
  selector: 'product-filters-property',
  templateUrl: './product-filters-property.component.html',
  styleUrls: ['./product-filters-property.component.scss']
})
export class ProductFiltersPropertyComponent {
  // private
  private _filtersHierarchyUpdate!: HierarchyUpdate;

  // Public
  public filtersManager: FiltersManager = new FiltersManager();
  public get filtersHierarchyUpdate(): HierarchyUpdate { return this._filtersHierarchyUpdate; }
  public set filtersHierarchyUpdate(filtersHierarchyUpdate: HierarchyUpdate) { this.onFiltersHierarchyUpdate(filtersHierarchyUpdate); }

  // Decorators
  @ViewChild('filtersHierarchy') filtersHierarchy!: HierarchyComponent;
  @ViewChild('filtersSearch') filtersSearch!: MultiColumnListComponent;

  // Constructor
  constructor(private filtersService: FiltersService) { }

  ngOnInit() {
    this.filtersManager.nameWidth = '296px';
    this.filtersManager.typeWidth = '55px';
    this.filtersManager.filtersService = this.filtersService;
    this.filtersManager.filtersType = FiltersType.ProductFilters;
    this.filtersManager.filters = this.filtersService.productFilters;
    this.filtersManager.otherFilters = this.filtersService.formFilters;
    this.filtersManager.dataService = this.filtersService.dataService;
    this.filtersManager.sanitizer = this.filtersService.sanitizer;
  }

  ngAfterViewInit() {
    this.filtersManager.afterViewInit();
  }

  ngAfterViewChecked() {
    this.filtersManager.filtersSearch = this.filtersSearch;
    this.filtersManager.otherFiltersHierarchy = this.filtersService.filtersFormHierarchyComponent
    this.filtersManager.filtersHierarchy = this.filtersService.productFiltersHierarchyComponent = this.filtersHierarchy;
    this.filtersManager.searchInput = document.getElementById('productFiltersSearchInput') as HTMLInputElement;
  }

  onFiltersHierarchyUpdate(filtersHierarchyUpdate: HierarchyUpdate) {
    this._filtersHierarchyUpdate = filtersHierarchyUpdate;
    this.filtersManager.filtersHierarchyUpdate = filtersHierarchyUpdate

    if (filtersHierarchyUpdate.type == ListUpdateType.CheckboxChange) console.log('hello')
  }
}