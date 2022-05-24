import { Injectable } from '@angular/core';
import { DataService } from 'common';
import { KeywordCheckboxItem } from '../../classes/keyword-checkbox-item';
import { ListUpdateService } from '../list-update/list-update.service';
import { ProductService } from '../product/product.service';

@Injectable({
  providedIn: 'root'
})
export class KeywordsService extends ListUpdateService {
  public addToSelectedKeywordsButtonDisabled!: boolean;
  public sortList: Array<KeywordCheckboxItem> = new Array<KeywordCheckboxItem>();


  // ====================================================================( CONSTRUCTOR )==================================================================== \\

  constructor(private dataService: DataService, private productService: ProductService) {
    super();
  }



  // =============================================================( ADD TO SELECTED KEYWORDS )============================================================== \\

  addToSelectedKeywords() {
    const keywordGroup: KeywordCheckboxItem = new KeywordCheckboxItem();

    // If a keyword group is selected
    if (this.productHierarchyComponent.listManager.selectedItem.hierarchyGroupID == 0) {
      keywordGroup.id = this.productHierarchyComponent.listManager.selectedItem.id;
      keywordGroup.name = this.productHierarchyComponent.listManager.selectedItem.name;
      keywordGroup.hierarchyGroupID = 0;
      keywordGroup.forProduct = false;

      // Add the disabled look to the keyword group in the available list
      this.productHierarchyComponent.listManager.selectedItem.opacity = 0.4;

      // Add the disabled look to it's children too (if available)
      const index = this.productArray.indexOf(this.productHierarchyComponent.listManager.selectedItem);
      for (let i = index + 1; i < this.productArray.length; i++) {
        if (this.productArray[i].hierarchyGroupID! <= this.productHierarchyComponent.listManager.selectedItem.hierarchyGroupID!) break;
        this.productArray[i].opacity = 0.4;
      }

      this.dataService.post('api/SelectedKeywords/Groups/Add', {
        productId: this.productService.product.id,
        id: keywordGroup.id
      }).subscribe();

      // If a keyword is selected
    } else {
      const parentIndex = this.productHierarchyComponent.listManager.getIndexOfHierarchyItemParent(this.productHierarchyComponent.listManager.selectedItem);
      const parent = this.productArray[parentIndex];
      const childId = this.productHierarchyComponent.listManager.selectedItem.id;
      keywordGroup.id = parent.id;
      keywordGroup.name = parent.name;
      keywordGroup.hierarchyGroupID = 0;
      keywordGroup.forProduct = false;

      // Add the disabled look to the keyword group and its children in the available list
      parent.opacity = 0.4;
      for (let i = parentIndex + 1; i < this.productArray.length; i++) {
        if (this.productArray[i].hierarchyGroupID! <= parent.hierarchyGroupID!) break;
        this.productArray[i].opacity = 0.4;
      }

      this.dataService.post('api/SelectedKeywords/Groups/AddKeyword', {
        productId: this.productService.product.id,
        keywordGroupId: keywordGroup.id,
        KeywordId: childId
      }).subscribe();
    }
    // this.thisArray.push(keywordGroup);

    // if (this.hierarchyComponent) {
    //   this.hierarchyComponent.listManager.sort(keywordGroup);
    // } else {
      // If any keyword items have been added from the available list to the selected list while the selected list was in search mode
      this.sortList.push(keywordGroup);
    // }
  }
}