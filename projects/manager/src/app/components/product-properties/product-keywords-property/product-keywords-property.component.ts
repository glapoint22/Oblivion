import { Component, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService } from 'common';
import { ProductKeywordsManager } from '../../../classes/product-keywords-manager';
import { KeywordsService } from '../../../services/keywords/keywords.service';
import { HierarchyComponent } from '../../hierarchies/hierarchy/hierarchy.component';
import { MultiColumnListComponent } from '../../lists/multi-column-list/multi-column-list.component';

@Component({
  selector: 'product-keywords-property',
  templateUrl: './product-keywords-property.component.html',
  styleUrls: ['./product-keywords-property.component.scss']
})
export class ProductKeywordsPropertyComponent {
  @ViewChild('hierarchyComponent') hierarchyComponent!: HierarchyComponent;
  @ViewChild('searchComponent') searchComponent!: MultiColumnListComponent;
  public productKeywordsManager: ProductKeywordsManager = new ProductKeywordsManager(this.dataService, this.sanitizer, this.keywordsService);

  constructor(private dataService: DataService, private sanitizer: DomSanitizer, private keywordsService: KeywordsService) { }

  ngAfterViewChecked() {
    this.productKeywordsManager.searchComponent = this.searchComponent;
    this.productKeywordsManager.otherHierarchyComponent = this.keywordsService.formHierarchyComponent;
    this.productKeywordsManager.hierarchyComponent = this.keywordsService.productHierarchyComponent = this.hierarchyComponent;
    this.productKeywordsManager.searchInput = document.getElementById('productKeywordsSearchInput') as HTMLInputElement;
  }
}