import { Component, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService, LazyLoad, LazyLoadingService } from 'common';
import { Subject } from 'rxjs';
import { NicheHierarchyManager } from '../../classes/niche-hierarchy-manager';
import { NicheHierarchyService } from '../../services/niche-hierarchy/niche-hierarchy.service';
import { ProductService } from '../../services/product/product.service';
import { HierarchyComponent } from '../hierarchies/hierarchy/hierarchy.component';
import { MultiColumnListComponent } from '../lists/multi-column-list/multi-column-list.component';

@Component({
  selector: 'niche-hierarchy',
  templateUrl: './niche-hierarchy.component.html',
  styleUrls: ['./niche-hierarchy.component.scss']
})
export class NicheHierarchyComponent extends LazyLoad {
  // Public
  public overNicheHierarchy: Subject<boolean> = new Subject<boolean>();
  public nicheHierarchyManager: NicheHierarchyManager = new NicheHierarchyManager(this.dataService, this.sanitizer, this.nicheHierarchyService, this.lazyLoadingService, this.productService);

  // Decorators
  @ViewChild('hierarchyComponent') hierarchyComponent!: HierarchyComponent;
  @ViewChild('searchComponent') searchComponent!: MultiColumnListComponent;

  // Constructor
  constructor(lazyLoadingService: LazyLoadingService,
    private dataService: DataService,
    private sanitizer: DomSanitizer,
    private productService: ProductService,
    public nicheHierarchyService: NicheHierarchyService) {
    super(lazyLoadingService);
  }

  ngAfterViewChecked() {
    this.nicheHierarchyManager.searchComponent = this.searchComponent;
    this.nicheHierarchyManager.otherListComponent = this.nicheHierarchyService.formHierarchyComponent;
    this.nicheHierarchyManager.listComponent = this.nicheHierarchyService.productHierarchyComponent = this.hierarchyComponent;
    this.nicheHierarchyManager.searchInput = document.getElementById('nicheHierarchySearchInput') as HTMLInputElement;
  }

  onOpen(): void {
    this.nicheHierarchyManager.onOpen();
  }


  onEscape(): void {
    this.nicheHierarchyManager.onEscape();
  }
}