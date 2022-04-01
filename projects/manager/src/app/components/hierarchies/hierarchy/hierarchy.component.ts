import { Component, Input } from '@angular/core';
import { LazyLoadingService } from 'common';
import { HierarchyItem } from '../../../classes/hierarchy-item';
import { HierarchyManager } from '../../../classes/hierarchy-manager';
import { ListComponent } from '../../lists/list/list.component';

@Component({
  selector: 'hierarchy',
  templateUrl: './hierarchy.component.html',
  styleUrls: ['./hierarchy.component.scss']
})
export class HierarchyComponent extends ListComponent {
  public listManager!: HierarchyManager;
  @Input() sourceList!: Array<HierarchyItem>;

  constructor(lazyLoadingService: LazyLoadingService) {
    super(lazyLoadingService)
  }

  instantiate() {
    this.listManager = new HierarchyManager(this.lazyLoadingService);
  }


  add(itemIndex?: number, isParent?: boolean | string) {
    // If a hierarchy item is selected
    if (this.listManager.selectedItem) {
      let index: number;
      let hierarchyGroupID: number;

      // If the selected hierarchy item has children or that selected hierarchy item belongs to the top level group or it is marked as a parent
      if (this.listManager.hasChildren(this.listManager.selectedItem) || this.listManager.selectedItem.hierarchyGroupID == 0 || (this.listManager.selectedItem as HierarchyItem).isParent) {

        // If the item index is NOT specified
        if (!itemIndex) {
          index = this.sourceList.indexOf(this.listManager.selectedItem) + 1;
          hierarchyGroupID = this.listManager.selectedItem.hierarchyGroupID! + 1;

          // Rotate the selected hierarchy item's arrow in the down position if it's not already
          if (!(this.listManager.selectedItem as HierarchyItem).arrowDown) {
            this.listManager.onArrowClick(this.sourceList[this.sourceList.indexOf(this.listManager.selectedItem)]);
          }

          // But if the item index is specified
        }else {
          index = itemIndex + 1;
          hierarchyGroupID = this.sourceList[itemIndex].hierarchyGroupID! + 1;

          if (!(this.sourceList[itemIndex]).arrowDown) {
            this.listManager.onArrowClick(this.sourceList[itemIndex]);
          }
        }


        // If the selected hierarchy item does NOT have children and that selected hierarchy item does NOT belong to the top level group and it is NOT marked as a parent
      } else {

        index = this.listManager.getIndexOfHierarchyItemParent(this.listManager.selectedItem) + 1;
        hierarchyGroupID = this.listManager.selectedItem.hierarchyGroupID!;
      }
      this.sourceList.splice(index, 0, { id: -1, name: '', hierarchyGroupID: hierarchyGroupID, isParent: isParent as boolean });

      // If a hierarchy item is NOT selected
    } else {
      this.sourceList.unshift({ id: -1, name: '', hierarchyGroupID: 0 });
    }


    window.setTimeout(() => {
      this.listManager.setAddItem(this.sourceList[this.sourceList.findIndex(x => x.id == -1)]);
    })
  }
}