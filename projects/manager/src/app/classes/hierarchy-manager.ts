import { Subject } from "rxjs";
import { ListUpdateType } from "./enums";
import { HierarchyItem } from "./hierarchy-item";
import { HierarchyUpdate } from "./hierarchy-update";
import { ListManager } from "./list-manager";

export class HierarchyManager extends ListManager {
    onListUpdate = new Subject<HierarchyUpdate>();
    collapseDisabled: boolean = true;


    // ========================================================( GET INDEX OF HIERARCHY ITEM PARENT )========================================================= \\

    getIndexOfHierarchyItemParent(hierarchyItem: HierarchyItem): number {
        let parentHierarchyIndex!: number;
        const hierarchyItemIndex = this.sourceList.indexOf(hierarchyItem);

        for (let i = hierarchyItemIndex; i >= 0; i--) {
            if (this.sourceList[i].hierarchyGroupID! < this.sourceList[hierarchyItemIndex].hierarchyGroupID!) {
                parentHierarchyIndex = i;
                break;
            }
        }
        return parentHierarchyIndex;
    }



    // ===================================================================( HAS CHILDREN )==================================================================== \\

    hasChildren(hierarchyItem: HierarchyItem): boolean {
        const index = this.sourceList.indexOf(hierarchyItem);

        if (index == this.sourceList.length - 1) return false;

        if (this.sourceList[index! + 1].hierarchyGroupID! > this.sourceList[index!].hierarchyGroupID!) {
            return true;
        } else {
            return false;
        }
    }



    // ==================================================================( ON ARROW CLICK )=================================================================== \\

    onArrowClick(hierarchyItem: HierarchyItem) {
        hierarchyItem.arrowDown = !hierarchyItem.arrowDown;
        this.showAndHide(this.sourceList.findIndex(x => x.id == hierarchyItem.id && x.name == hierarchyItem.name && x.hierarchyGroupID == hierarchyItem.hierarchyGroupID));
        this.collapseDisabled = this.getIsCollapsed();
        this.onListUpdate.next({
            type: ListUpdateType.ArrowClicked,
            id: hierarchyItem.id,
            index: this.sourceList.indexOf(hierarchyItem),
            name: hierarchyItem.name,
            addDisabled: this.addDisabled,
            editDisabled: this.editDisabled,
            deleteDisabled: this.deleteDisabled,
            collapseDisabled: this.collapseDisabled,
            arrowDown: hierarchyItem.arrowDown,
            hasChildren: this.hasChildren(hierarchyItem),
            hierarchyGroupID: hierarchyItem.hierarchyGroupID
        });
    }



    // =================================================================( GET IS COLLAPSED )================================================================== \\

    getIsCollapsed(): boolean {
        let isCollapsed: boolean = true;

        for (let i = 0; i < this.sourceList.length; i++) {
            if ((this.sourceList[i] as HierarchyItem).arrowDown) {
                isCollapsed = false;
                break;
            }
        }
        return isCollapsed;
    }



    // ===================================================================( SHOW AND HIDE )=================================================================== \\

    showAndHide(parentIndex: number) {
        // Loop through all the hierarchy items starting with the hierarchy item that follows the current parent
        for (let i = parentIndex + 1; i < this.sourceList.length; i++) {

            // If we come across a hierarchy item that's a sibling of the current parent
            if (this.sourceList[i].hierarchyGroupID == this.sourceList[parentIndex].hierarchyGroupID) {
                // Make that hierarchy item the new parent
                parentIndex = i;
            }

            // If the current hierarchy item is a child of the current parent
            if (this.sourceList[i].hierarchyGroupID == this.sourceList[parentIndex].hierarchyGroupID! + 1) {


                // If the parent of the current hierarchy item has it's arrow down and that parent is NOT hidden
                if ((this.sourceList[parentIndex] as HierarchyItem).arrowDown && !(this.sourceList[parentIndex] as HierarchyItem).hidden) {
                    // Show that child
                    (this.sourceList[i] as HierarchyItem).hidden = false;

                    // But if the current parent is either hidden or doesn't have it's arrow down
                } else {

                    // Then don't show that child
                    (this.sourceList[i] as HierarchyItem).hidden = true;
                }

                // If the current hierarchy item has children
                if (i + 1 < this.sourceList.length && this.sourceList[i + 1].hierarchyGroupID! > this.sourceList[i].hierarchyGroupID!) {
                    this.showAndHide(i);
                }
            }

            // If the current hierarchy item is NOT a child of the current parent
            if (this.sourceList[i].hierarchyGroupID! <= this.sourceList[parentIndex].hierarchyGroupID!) {
                break;
            }
        }
    }



    // ================================================================( COLLAPSE HIERARCHY )================================================================= \\

    collapseHierarchy() {
        this.sourceList.forEach(x => {
            const item = (x as HierarchyItem);
            item.arrowDown = false;
            if (item.hierarchyGroupID != 0) item.hidden = true;
        })
        this.collapseDisabled = true;
        this.buttonsUpdate();
    }



    // =================================================================( SET BUTTON STATE )================================================================== \\

    setButtonsState() {
        this.collapseDisabled = this.getIsCollapsed();
        super.setButtonsState();
    }



    // ===================================================================( SET ADD ITEM )==================================================================== \\

    setAddItem(hierarchyItem: HierarchyItem) {
        if (this.editable) {
            this.collapseDisabled = true;
        }
        super.setAddItem(hierarchyItem);
    }



    // ===================================================================( SET EDIT ITEM )=================================================================== \\

    setEditItem(hierarchyItem: HierarchyItem) {
        if (this.editable) {
            this.collapseDisabled = true;
        }
        super.setEditItem(hierarchyItem);
    }



    // =================================================================( GET DELETED ITEMS )================================================================= \\

    getDeletedItems(selectedItems: Array<HierarchyItem>): Array<HierarchyItem> {
        let deletedItems: Array<HierarchyItem> = new Array<HierarchyItem>();

        // Loop through all the selected items
        selectedItems.forEach(x => {
            const startingIndex = this.sourceList.indexOf(x);

            // For each selected item get its children
            for (let i = startingIndex; i < this.sourceList.length; i++) {
                if (i != startingIndex && this.sourceList[i].hierarchyGroupID! <= x.hierarchyGroupID!) break;

                // As long as the selected item or any of its children are NOT yet in the deleted items list
                if (deletedItems.indexOf(this.sourceList[i]) == -1) {
                    // Add it to the deleted items list
                    deletedItems.push(this.sourceList[i]);
                }
            }
        });
        return deletedItems;
    }



    // ========================================================( GET NEXT SELECTED ITEM AFTER DELETE )======================================================== \\

    getNextSelectedItemAfterDelete(deletedItems: Array<HierarchyItem>): HierarchyItem {
        let nextSelectedItem!: HierarchyItem;
        const selectedItemIndex = this.sourceList.indexOf(this.selectedItem);

        // Loop through the list of items starting with the item that follows the selected item
        for (let i = selectedItemIndex + 1; i < this.sourceList.length; i++) {
            // If we come across an item that is NOT selected
            if (!this.sourceList[i].selected) {

                // And as long as that item is NOT on the deleted items list
                if (deletedItems.indexOf(this.sourceList[i]) == -1) {
                    // Make a copy of that item so that it can be used as the newly selected item when all the other items are deleted
                    nextSelectedItem = this.sourceList[i];
                    break;
                }
            }
        }
        return nextSelectedItem;
    }



    // =======================================================================( SORT )======================================================================== \\

    sort(hierarchyItem: HierarchyItem) {
        let parentHierarchyIndex: number = -1;
        let tempArray: Array<HierarchyItem> = new Array<HierarchyItem>();
        let newHierarchyGroup: Array<HierarchyItem> = new Array<HierarchyItem>();

        // If the selected hierarchy item belongs to the top level group
        if (hierarchyItem.hierarchyGroupID == 0) {
            // Copy all the hierarchy items from that group to the temp array
            tempArray = (this.sourceList as Array<HierarchyItem>).filter(x => x.hierarchyGroupID == 0);

            // If the selected hierarchy item belongs to any other group
        } else {

            // First get the parent of the selected hierarchy item
            parentHierarchyIndex = this.getIndexOfHierarchyItemParent(hierarchyItem);

            // Then copy all the children belonging to that hierarchy parent to the temp array
            for (let i = parentHierarchyIndex + 1; i < this.sourceList.length; i++) {
                if (this.sourceList[i].hierarchyGroupID == this.sourceList[parentHierarchyIndex].hierarchyGroupID) break;
                if (this.sourceList[i].hierarchyGroupID == this.sourceList[parentHierarchyIndex].hierarchyGroupID! + 1) {
                    tempArray.push(this.sourceList[i] as HierarchyItem)
                }
            }
        }

        // Sort the temp array
        tempArray.sort((a, b) => (a.name! > b.name!) ? 1 : -1);

        // Loop through all the hierarchy items in the temp array
        tempArray.forEach(x => {
            // Get the index of that same hierarchy item from the source list
            let index = this.sourceList.findIndex(y => y.id == x.id && y.name == x.name && y.hierarchyGroupID == x.hierarchyGroupID);

            // Copy the hierarchy item and all its children
            for (let i = index; i < this.sourceList.length; i++) {
                if (i != index && this.sourceList[i].hierarchyGroupID! <= this.sourceList[index].hierarchyGroupID!) break;

                // And add them to the new hierarchy group
                newHierarchyGroup.push(this.sourceList[i] as HierarchyItem);
            }
        })

        // Remove the old hierarchy group from the source
        this.sourceList.splice(parentHierarchyIndex + 1, newHierarchyGroup.length);
        // Add the new hierarchy group to the source
        this.sourceList.splice(parentHierarchyIndex + 1, 0, ...newHierarchyGroup);
        // Restore the indent
        this.restoreIndent();
    }



    // ==================================================================( RESTORE INDENT )=================================================================== \\

    restoreIndent() {
        const listItemIndex = this.sourceList.findIndex(x => x == this.editedItem);

        if (this.editedItem) {
            this.editedItem = (this.sourceList[listItemIndex] as HierarchyItem) = {
                id: this.editedItem.id,
                name: this.editedItem.name,
                hierarchyGroupID: this.editedItem.hierarchyGroupID,
                arrowDown: (this.editedItem as HierarchyItem).arrowDown,
                isParent: (this.editedItem as HierarchyItem).isParent,
                opacity: this.editedItem.opacity,
                case: this.editedItem.case
            }
        }
    }



    // ==================================================================( BUTTONS UPDATE )=================================================================== \\

    buttonsUpdate() {
        this.onListUpdate.next(
            {
                addDisabled: this.addDisabled,
                editDisabled: this.editDisabled,
                deleteDisabled: this.deleteDisabled,
                collapseDisabled: this.collapseDisabled
            }
        );
    }



    // ==================================================================( ADD EDIT UPDATE )================================================================== \\

    addEditUpdate(hierarchyItem: HierarchyItem) {
        this.onListUpdate.next(
            {
                type: this.newItem ? ListUpdateType.Add : ListUpdateType.Edit,
                id: hierarchyItem.id,
                index: this.sourceList.findIndex(x => x.id == hierarchyItem.id && x.name == hierarchyItem.name && x.hierarchyGroupID == hierarchyItem.hierarchyGroupID),
                name: hierarchyItem.name,
                hierarchyGroupID: hierarchyItem.hierarchyGroupID
            }
        );
    }



    // ==============================================================( VERIFY ADD EDIT UPDATE )=============================================================== \\

    verifyAddEditUpdate(hierarchyItem: HierarchyItem, name: string) {
        this.onListUpdate.next(
            {
                type: ListUpdateType.VerifyAddEdit,
                id: hierarchyItem.id,
                index: this.sourceList.findIndex(x => x.id == hierarchyItem.id && x.name == hierarchyItem.name && x.hierarchyGroupID == hierarchyItem.hierarchyGroupID),
                name: name,
                hierarchyGroupID: hierarchyItem.hierarchyGroupID
            }
        );
    }



    // ================================================================( DELETE PROMPT UPDATE )=============================================================== \\

    deletePromptUpdate(deletedItems: Array<HierarchyItem>) {
        this.onListUpdate.next(
            {
                type: ListUpdateType.DeletePrompt,
                deletedItems: deletedItems!.map((x) => {
                    return {
                        id: x.id,
                        index: this.sourceList.findIndex(y => y.id == x.id && y.name == x.name && y.hierarchyGroupID == x.hierarchyGroupID),
                        name: x.name,
                        hierarchyGroupID: x.hierarchyGroupID
                    }
                })
            });
    }



    // ====================================================================( DELETE UPDATE )================================================================== \\

    deleteUpdate(deletedItems: Array<HierarchyItem>) {
        this.onListUpdate.next(
            {
                type: ListUpdateType.Delete,
                deletedItems: deletedItems!.map((x) => {
                    return {
                        id: x.id,
                        index: this.sourceList.findIndex(y => y.id == x.id && y.name == x.name && y.hierarchyGroupID == x.hierarchyGroupID),
                        name: x.name,
                        hierarchyGroupID: x.hierarchyGroupID
                    }
                })
            });
    }



    // ===============================================================( SELECTED ITEMS UPDATE )=============================================================== \\

    selectedItemsUpdate(rightClick: boolean) {
        const selectedItems = this.sourceList.filter(x => x.selected == true);
        selectedItems.forEach(x => x.index = this.sourceList.findIndex(y => y.id == x?.id && y.hierarchyGroupID == x.hierarchyGroupID));
        this.onListUpdate.next({ type: ListUpdateType.SelectedItems, selectedItems: selectedItems, rightClick: rightClick });
    }



    // ==============================================================( UNSELECTED ITEMS UPDATE )============================================================== \\

    unSelectedItemsUpdate() {
        this.onListUpdate.next({
            type: ListUpdateType.UnselectedItems,
            addDisabled: this.addDisabled,
            editDisabled: this.editDisabled,
            deleteDisabled: this.deleteDisabled,
            collapseDisabled: this.collapseDisabled
        })
    }



    // ================================================================( DOUBLE CLICK UPDATE )================================================================ \\

    doubleClickUpdate() {
        this.onListUpdate.next({
            type: ListUpdateType.DoubleClick,
            addDisabled: this.addDisabled,
            editDisabled: this.editDisabled,
            deleteDisabled: this.deleteDisabled,
            collapseDisabled: this.collapseDisabled
        })
    }



    // ===========================================================( DUPLICATE PROMPT OPEN UPDATE )============================================================ \\

  duplicatePromptOpenUpdate() {
    this.onListUpdate.next({
      type: ListUpdateType.DuplicatePromptOpen,
      addDisabled: this.addDisabled,
      editDisabled: this.editDisabled,
      deleteDisabled: this.deleteDisabled,
      collapseDisabled: this.collapseDisabled
    })
  }



    // ===========================================================( DUPLICATE PROMPT CLOSE UPDATE )=========================================================== \\

    duplicatePromptCloseUpdate() {
        this.onListUpdate.next({
            type: ListUpdateType.DuplicatePromptClose,
            addDisabled: this.addDisabled,
            editDisabled: this.editDisabled,
            deleteDisabled: this.deleteDisabled,
            collapseDisabled: this.collapseDisabled
        })
    }



    // =================================================================( CASE TYPE UPDATE )================================================================== \\

  caseTypeUpdate(hierarchyItem: HierarchyItem) {
    this.onListUpdate.next(
      {
        type: ListUpdateType.CaseTypeUpdate,
        id: hierarchyItem.id,
        index: this.sourceList.findIndex(x => x.id == hierarchyItem.id && x.name == hierarchyItem.name && x.hierarchyGroupID == hierarchyItem.hierarchyGroupID),
        name: hierarchyItem.name,
        hierarchyGroupID: hierarchyItem.hierarchyGroupID
      }
    );
  }
}