import { Component, Input } from '@angular/core';
import { EditableHierarchyManager } from '../../../classes/editable-hierarchy-manager';
import { HierarchyItem } from '../../../classes/hierarchy-item';
import { EditableListComponent } from '../../lists/editable-list/editable-list.component';

@Component({
  selector: 'editable-hierarchy',
  templateUrl: './editable-hierarchy.component.html',
  styleUrls: ['./editable-hierarchy.component.scss']
})
export class EditableHierarchyComponent extends EditableListComponent {
  public listManager!: EditableHierarchyManager;
  @Input() sourceList!: Array<HierarchyItem>;

  instantiate() {
    this.listManager = new EditableHierarchyManager();
  }


  addItem(isParent?: boolean) {
    // If a hierarchy item is selected
    if (this.listManager.selectedItem) {
      let index: number;
      let hierarchyGroupID: number;

      // If the selected hierarchy item has children
      if (this.listManager.hasChildren(this.listManager.selectedItem)) {
        index = this.sourceList.indexOf(this.listManager.selectedItem) + 1;
        hierarchyGroupID = this.listManager.selectedItem.hierarchyGroupID! + 1;

        // Rotate the selected hierarchy item's arrow in the down position if it's not already
        if (!(this.listManager.selectedItem as HierarchyItem).arrowDown) {
          this.listManager.onArrowClick(this.sourceList[this.sourceList.indexOf(this.listManager.selectedItem)]);
        }

        // If the selected hierarchy item does NOT have children
      } else {
        index = this.listManager.getIndexOfHierarchyItemParent(this.listManager.selectedItem) + 1;
        hierarchyGroupID = this.listManager.selectedItem.hierarchyGroupID!;
      }
      this.sourceList.splice(index, 0, { id: -1, name: '', hierarchyGroupID: hierarchyGroupID, isParent: isParent });

      // If a hierarchy item is NOT selected
    } else {
      this.sourceList.unshift({ id: -1, name: '', hierarchyGroupID: 0 });
    }


    window.setTimeout(() => {
      this.listManager.setAddItem(this.sourceList[this.sourceList.findIndex(x => x.id == -1)]);
    })
  }
}