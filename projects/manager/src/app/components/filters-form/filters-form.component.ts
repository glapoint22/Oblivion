import { Component, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService, LazyLoad, LazyLoadingService } from 'common';
import { FiltersFormManager } from '../../classes/filters-form-manager';
import { FiltersService } from '../../services/filters/filters.service';
import { ProductService } from '../../services/product/product.service';
import { HierarchyComponent } from '../hierarchies/hierarchy/hierarchy.component';
import { MultiColumnListComponent } from '../lists/multi-column-list/multi-column-list.component';

@Component({
  selector: 'filters-form',
  templateUrl: './filters-form.component.html',
  styleUrls: ['./filters-form.component.scss']
})
export class FiltersFormComponent extends LazyLoad {
  @ViewChild('hierarchyComponent') hierarchyComponent!: HierarchyComponent;
  @ViewChild('searchComponent') searchComponent!: MultiColumnListComponent;
  public filtersFormManager: FiltersFormManager = new FiltersFormManager(this.dataService, this.sanitizer, this.filtersService, this.productService);
  
  
  constructor(lazyLoadingService: LazyLoadingService, private dataService: DataService, private sanitizer: DomSanitizer, private filtersService: FiltersService, private productService: ProductService) {
    super(lazyLoadingService);
    this.filtersFormManager.onClose.subscribe(() => {
      this.close();
    })

    this.filtersFormManager.searchInputName = 'filtersFormSearchInput';
  }

  ngAfterViewChecked() {
    this.filtersFormManager.searchComponent = this.searchComponent;
    this.filtersFormManager.otherListComponent = this.filtersService.productHierarchyComponent;
    this.filtersFormManager.listComponent = this.filtersService.formHierarchyComponent = this.hierarchyComponent;
    
  }

  onOpen(): void {
    this.filtersFormManager.onOpen();
  }

  onEscape(): void {
    this.filtersFormManager.onEscape();
  }
}