import { Component, Input } from '@angular/core';
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


  instantiate() {
    this.listManager = new HierarchyManager(this.lazyLoadingService);
    this.setListOptions();
  }


  initializeListUpdate() {
    this.listManager.onListUpdate.next(
      {
        addDisabled: this.listManager.addDisabled,
        editDisabled: this.listManager.editDisabled,
        deleteDisabled: this.listManager.deleteDisabled,
        collapseDisabled: this.listManager.collapseDisabled
      }
    )
  }


  collapse() {
    this.listManager.collapseHierarchy();
  }




  add(itemIndex?: number, isParent?: boolean | string) {

    // If the list is NOT Editable
    if (!this.listManager.editable) {

      // If this list is set to verify
      if (this.listManager.verifyAddEdit) {

        // As long as a verification is NOT in progress
        if (!this.listManager.addEditVerificationInProgress) {

          // Begin verification
          this.listManager.addEditVerificationInProgress = true;
          this.listManager.verifyAddEditUpdate({id: itemIndex, name: isParent as string, hierarchyGroupID: 0}, isParent as string);
        }

        // If this list does NOT verify
      } else {
        
        this.commitAdd(itemIndex!, isParent as string)
      }

      // But if the list IS editable
    } else {

      // If a hierarchy item is selected
      if (this.listManager.selectedItem) {
        let index: number;
        let hierarchyGroupID: number;

        // If the selected hierarchy item has children or that selected hierarchy item belongs to the top level group or it is marked as a parent
        if (this.listManager.hasChildren(this.listManager.selectedItem) || this.listManager.selectedItem.hierarchyGroupID == 0 || (this.listManager.selectedItem as HierarchyItem).isParent) {

          // If the item index is NOT specified (when the selected hierarchy IS the parent)
          if (itemIndex == null) {
            index = this.sourceList.indexOf(this.listManager.selectedItem) + 1;
            hierarchyGroupID = this.listManager.selectedItem.hierarchyGroupID! + 1;

            // Rotate the selected hierarchy item's arrow in the down position if it's not already
            if (!(this.listManager.selectedItem as HierarchyItem).arrowDown) {
              this.listManager.onArrowClick(this.sourceList[this.sourceList.indexOf(this.listManager.selectedItem)]);
            }

            // But if the item index is specified (when the selected hierarchy is NOT the parent and we're creating a sibling of the selected hierarchy)
            //(the index refers to the parent of the selected hierarchy)
          } else {
            index = itemIndex! + 1;
            hierarchyGroupID = this.sourceList[itemIndex!].hierarchyGroupID! + 1;

            if (!(this.sourceList[itemIndex!]).arrowDown) {
              this.listManager.onArrowClick(this.sourceList[itemIndex!]);
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
        // Create a top level hierarchy item
        this.sourceList.unshift({ id: -1, name: '', hierarchyGroupID: 0 });
      }

      // Wait for the html-item property to be assigned to the new item
      window.setTimeout(() => {
        this.listManager.setAddItem(this.sourceList[this.sourceList.findIndex(x => x.id == -1)]);
      })
    }
  }


  
  commitAdd(id: number, name: string){
    // Add the new item to the list
    this.sourceList.push({ id: id, name: name, hierarchyGroupID: 0 });

    const newHierarchyItem = this.sourceList.find(x => x.id == id && x.name == name && x.hierarchyGroupID == 0);

    // As long as the list is set to be sortable
    if (this.listManager.sortable) {
      // Sort the list
      this.listManager.sort(newHierarchyItem!);
    }

    // Send it to the list manager to be selected
    this.listManager.setAddItem(newHierarchyItem!);
  }
}