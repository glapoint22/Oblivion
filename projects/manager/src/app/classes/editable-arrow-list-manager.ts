import { EditableArrowItemComponent } from "../components/items/editable-arrow-item/editable-arrow-item.component";
import { ItemComponent } from "../components/items/item/item.component";
import { EditableListManager } from "./editable-list-manager";
import { ListUpdateType } from "./enums";
import { Hierarchy } from "./hierarchy";

export class EditableArrowListManager extends EditableListManager {

    onArrowClick(item: EditableArrowItemComponent) {
        item.arrowDown = !item.arrowDown;
        const index = this.sourceList.findIndex(x => x.id == item.id);
        (this.sourceList[index] as Hierarchy).arrowDown = item.arrowDown;

        this.showHide(index);
        this.onListUpdate.next({ type: ListUpdateType.ArrowClicked, id: item.id, index: this.getItemIndex(item), name: item.name, arrowDown: item.arrowDown });
    }


    showHide(parentIndex: number) {
        // Loop through all the hierarchy items starting with the hierarchy item that follows the current parent
        for (let i = parentIndex + 1; i < this.sourceList.length; i++) {

            // If we come across a hierarchy item that's a sibling of the current parent
            if ((this.sourceList[i] as Hierarchy).levelID == (this.sourceList[parentIndex] as Hierarchy).levelID) {
                // Make that hierarchy item the new parent
                parentIndex = i;
            }

            // If the current hierarchy item is a child of the current parent
            if ((this.sourceList[i] as Hierarchy).levelID == (this.sourceList[parentIndex] as Hierarchy).levelID + 1) {


                // If the parent of the current hierarchy item has it's arrow down and that parent is NOT hidden
                if ((this.sourceList[parentIndex] as Hierarchy).arrowDown && !(this.sourceList[parentIndex] as Hierarchy).hidden) {
                    // Show that child
                    (this.sourceList[i] as Hierarchy).hidden = false;

                    // But if the current parent is either hidden or doesn't have it's arrow down
                } else {

                    // Then don't show that child
                    (this.sourceList[i] as Hierarchy).hidden = true;
                }

                // If the current hierarchy item has children
                if (i + 1 < this.sourceList.length && (this.sourceList[i + 1] as Hierarchy).levelID > (this.sourceList[i] as Hierarchy).levelID) {
                    this.showHide(i);
                }
            }

            // If the current hierarchy item is NOT a child of the current parent
            if ((this.sourceList[i] as Hierarchy).levelID <= (this.sourceList[parentIndex] as Hierarchy).levelID) {
                break;
            }
        }
    }


    hasChildren(item: Hierarchy): boolean {
        const index = this.sourceList.indexOf(item);

        if (index == this.sourceList.length - 1) return false;

        if ((this.sourceList[index! + 1] as Hierarchy).levelID > (this.sourceList[index!] as Hierarchy).levelID) {
            return true;
        } else {
            return false;
        }
    }


    sortHierarchyLevel(hierarchyItemIndex: number) {
        let parentHierarchyIndex: number = -1;
        let tempArray: Array<Hierarchy> = new Array<Hierarchy>();
        let newHierarchyLevel: Array<Hierarchy> = new Array<Hierarchy>();

        // If the selected hierarchy item is on the first level
        if ((this.sourceList[hierarchyItemIndex] as Hierarchy).levelID == 0) {
            // Copy all the hierarchy items from the first level to the temp array
            tempArray = (this.sourceList as Array<Hierarchy>).filter(x => x.levelID == 0);

            // If the selected hierarchy item is on any other level
        } else {

            // First find the parent of the selected hierarchy item
            for (let i = hierarchyItemIndex; i >= 0; i--) {
                if ((this.sourceList[i] as Hierarchy).levelID < (this.sourceList[hierarchyItemIndex] as Hierarchy).levelID) {
                    parentHierarchyIndex = i;
                    break;
                }
            }

            // Then copy all the children belonging to that hierarchy parent to the temp array
            for (let i = parentHierarchyIndex + 1; i < this.sourceList.length; i++) {
                if ((this.sourceList[i] as Hierarchy).levelID == (this.sourceList[parentHierarchyIndex] as Hierarchy).levelID) break;
                if ((this.sourceList[i] as Hierarchy).levelID == (this.sourceList[parentHierarchyIndex] as Hierarchy).levelID + 1) {
                    tempArray.push(this.sourceList[i] as Hierarchy)
                }
            }
        }

        // Sort the temp array
        tempArray.sort((a, b) => (a.name! > b.name!) ? 1 : -1);

        // Loop through all the hierarchy items in the temp array
        tempArray.forEach(x => {
            // Get the index of that same hierarchy item from the source list
            let index = this.sourceList.findIndex(y => y.id == x.id);

            // Copy the hierarchy item and all its children
            for (let i = index; i < this.sourceList.length; i++) {
                if (i != index && (this.sourceList[i] as Hierarchy).levelID <= (this.sourceList[index] as Hierarchy).levelID) break;

                // And add them to the new hierarchy level
                newHierarchyLevel.push(this.sourceList[i] as Hierarchy);
            }
        })

        // Remove the old hierarchy level from the source
        this.sourceList.splice(parentHierarchyIndex + 1, newHierarchyLevel.length);
        // Add the new hierarchy level to the source
        this.sourceList.splice(parentHierarchyIndex + 1, 0, ...newHierarchyLevel);
    }








    updateList(deletedItems?: Array<ItemComponent>, item?: ItemComponent) {
        const hierarchyItemIndex = this.sourceList.findIndex(x => x.id == item?.id);

        // If an item is being added or edited
        if (item != null) {
            const newItem = this.newItem;

            // Update the source list with the new item information
            this.sourceList[hierarchyItemIndex] = {
                id: this.sourceList[hierarchyItemIndex].id,
                name: item?.name,
                levelID: (this.sourceList[hierarchyItemIndex] as Hierarchy).levelID,
                hidden: (this.sourceList[hierarchyItemIndex] as Hierarchy).hidden,
                arrowDown: (this.sourceList[hierarchyItemIndex] as Hierarchy).arrowDown
            } as Hierarchy

            
            // Sort the source hierarchy
            this.sortHierarchyLevel(hierarchyItemIndex);

            // Select the item
            window.setTimeout(() => {
                const updatedItem = this.items.find(x => x.id == item.id);
                const updatedIndex = this.getItemIndex(updatedItem!);
                this.selectItem(updatedItem!);
                this.onListUpdate.next({ type: newItem ? ListUpdateType.Add : ListUpdateType.Edit, id: item.id, index: updatedIndex, name: item.name });
            })

            // If items are being deleted
        } else {

            this.onListUpdate.next({ type: ListUpdateType.Delete, deletedItems: deletedItems!.map((x) => { return { id: x.id, name: x.name } }) });
        }
    }
}