import { Component, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService, LazyLoad, LazyLoadingService } from 'common';
import { KeywordsFormUpdateManager } from '../../classes/keywords-form-update-manager';
import { KeywordsService } from '../../services/keywords/keywords.service';
import { ProductService } from '../../services/product/product.service';
import { HierarchyComponent } from '../hierarchies/hierarchy/hierarchy.component';
import { MultiColumnListComponent } from '../lists/multi-column-list/multi-column-list.component';

@Component({
  selector: 'keywords-form',
  templateUrl: './keywords-form.component.html',
  styleUrls: ['./keywords-form.component.scss']
})
export class KeywordsFormComponent extends LazyLoad {
  @ViewChild('hierarchyComponent') hierarchyComponent!: HierarchyComponent;
  @ViewChild('searchComponent') searchComponent!: MultiColumnListComponent;
  public keywordsFormManager: KeywordsFormUpdateManager = new KeywordsFormUpdateManager(this.dataService, this.sanitizer, this.keywordsService, this.productService);
  

  constructor(lazyLoadingService: LazyLoadingService, private dataService: DataService, private sanitizer: DomSanitizer, private keywordsService: KeywordsService, private productService: ProductService) {
    super(lazyLoadingService);
    this.keywordsFormManager.onClose.subscribe(() => {
      this.close();
    })

    this.keywordsFormManager.searchInputName = 'keywordsFormSearchInput';
  }

  ngAfterViewChecked() {
    this.keywordsFormManager.searchComponent = this.searchComponent;
    this.keywordsFormManager.otherListComponent = this.keywordsService.productHierarchyComponent;
    this.keywordsFormManager.listComponent = this.keywordsService.formHierarchyComponent = this.hierarchyComponent;
    
  }

  onOpen(): void {
    this.keywordsFormManager.onOpen();
  }

  onEscape(): void {
    this.keywordsFormManager.onEscape();
  }
}