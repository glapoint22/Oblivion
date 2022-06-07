import { Component, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService } from 'common';
import { AvailableKeywordsManager } from '../../../classes/available-keywords-manager';
import { SelectedKeywordsManager } from '../../../classes/selected-keywords-manager';
import { KeywordsService } from '../../../services/keywords/keywords.service';
import { ProductService } from '../../../services/product/product.service';
import { HierarchyComponent } from '../../hierarchies/hierarchy/hierarchy.component';
import { CheckboxMultiColumnListComponent } from '../../lists/checkbox-multi-column-list/checkbox-multi-column-list.component';
import { MultiColumnListComponent } from '../../lists/multi-column-list/multi-column-list.component';

@Component({
  selector: 'product-keywords-property',
  templateUrl: './product-keywords-property.component.html',
  styleUrls: ['./product-keywords-property.component.scss']
})
export class ProductKeywordsPropertyComponent {
  @ViewChild('availableHierarchyComponent') availableHierarchyComponent!: HierarchyComponent;
  @ViewChild('availableSearchComponent') availableSearchComponent!: MultiColumnListComponent;
  @ViewChild('selectedHierarchyComponent') selectedHierarchyComponent!: HierarchyComponent;
  @ViewChild('selectedSearchComponent') selectedSearchComponent!: CheckboxMultiColumnListComponent;

  public availableKeywordsManager: AvailableKeywordsManager = new AvailableKeywordsManager(this.dataService, this.sanitizer, this.keywordsService, this.productService);
  public selectedKeywordsManager: SelectedKeywordsManager = new SelectedKeywordsManager(this.dataService, this.sanitizer, this.keywordsService, this.productService);

  constructor(private dataService: DataService, private sanitizer: DomSanitizer, public keywordsService: KeywordsService, private productService: ProductService) {
    this.availableKeywordsManager.searchInputName = 'availableKeywordsSearchInput';
    this.selectedKeywordsManager.searchInputName = 'selectedKeywordsSearchInput';
   }

  ngAfterViewChecked() {
    this.availableKeywordsManager.searchComponent = this.availableSearchComponent;
    this.availableKeywordsManager.otherListComponent = this.keywordsService.formHierarchyComponent;
    this.availableKeywordsManager.listComponent = this.keywordsService.productHierarchyComponent = this.availableHierarchyComponent;
    

    this.selectedKeywordsManager.searchComponent = this.selectedSearchComponent;
    this.selectedKeywordsManager.listComponent = this.keywordsService.selectedHierarchyComponent = this.selectedHierarchyComponent;
    
  }
}