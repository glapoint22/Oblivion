import { Component, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService } from 'common';
import { ProductFiltersManager } from '../../../classes/product-filters-manager';
import { FiltersService } from '../../../services/filters/filters.service';
import { ProductService } from '../../../services/product/product.service';
import { HierarchyComponent } from '../../hierarchies/hierarchy/hierarchy.component';
import { MultiColumnListComponent } from '../../lists/multi-column-list/multi-column-list.component';

@Component({
  selector: 'product-filters-property',
  templateUrl: './product-filters-property.component.html',
  styleUrls: ['./product-filters-property.component.scss']
})
export class ProductFiltersPropertyComponent {
  @ViewChild('hierarchyComponent') hierarchyComponent!: HierarchyComponent;
  @ViewChild('searchComponent') searchComponent!: MultiColumnListComponent;
  public productFiltersManager: ProductFiltersManager = new ProductFiltersManager(this.dataService, this.sanitizer, this.filtersService, this.productService);

  constructor(private dataService: DataService, private sanitizer: DomSanitizer, private filtersService: FiltersService, private productService: ProductService) { }

  ngAfterViewChecked() {
    this.productFiltersManager.searchComponent = this.searchComponent;
    this.productFiltersManager.otherListComponent = this.filtersService.formHierarchyComponent;
    this.productFiltersManager.listComponent = this.filtersService.productHierarchyComponent = this.hierarchyComponent;
    this.productFiltersManager.searchInput = document.getElementById('productFiltersSearchInput') as HTMLInputElement;
  }
}