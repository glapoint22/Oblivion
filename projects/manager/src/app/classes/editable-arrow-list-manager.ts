import { EditableArrowItemComponent } from "../components/items/editable-arrow-item/editable-arrow-item.component";
import { EditableListManager } from "./editable-list-manager";
import { ListUpdateType } from "./enums";
import { Hierarchy } from "./hierarchy";

export class EditableArrowListManager extends EditableListManager {

    getListItem(item: EditableArrowItemComponent): Hierarchy {
        const listItem: Hierarchy = this.sourceList.find(x => x.id == item.id) as Hierarchy;
        return listItem;
    }


    onArrowClick(listItem: Hierarchy) {
        listItem.arrowDown = !listItem.arrowDown;
        this.showHide(this.sourceList.findIndex(x => x.id == listItem.id));
        this.setListUpdate(listItem);
    }


    showHide(parentIndex: number) {
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
                if ((this.sourceList[parentIndex] as Hierarchy).arrowDown && !(this.sourceList[parentIndex] as Hierarchy).hidden) {
                    // Show that child
                    (this.sourceList[i] as Hierarchy).hidden = false;

                    // But if the current parent is either hidden or doesn't have it's arrow down
                } else {

                    // Then don't show that child
                    (this.sourceList[i] as Hierarchy).hidden = true;
                }

                // If the current hierarchy item has children
                if (i + 1 < this.sourceList.length && this.sourceList[i + 1].hierarchyGroupID! > this.sourceList[i].hierarchyGroupID!) {
                    this.showHide(i);
                }
            }

            // If the current hierarchy item is NOT a child of the current parent
            if (this.sourceList[i].hierarchyGroupID! <= this.sourceList[parentIndex].hierarchyGroupID!) {
                break;
            }
        }
    }


    setListUpdate(listItem: Hierarchy) {
        let addDisabled!: boolean;
        let editDisabled!: boolean;
        let deleteDisabled!: boolean;
        const itemSelectedCount = this.sourceList.filter(x => x.selected == true).length;

        if (itemSelectedCount == 0) {
            addDisabled = false;
            editDisabled = true;
            deleteDisabled = true;

        } else {

            if (itemSelectedCount > 1) {
                addDisabled = false;
                editDisabled = true;
                deleteDisabled = false;

            } else {

                addDisabled = false;
                editDisabled = false;
                deleteDisabled = false;
            }
        }

        this.onListUpdate.next({
            type: ListUpdateType.ArrowClicked,
            id: listItem.id,
            index: this.sourceList.indexOf(listItem),
            name: listItem.name,
            arrowDown: listItem.arrowDown,
            addDisabled: addDisabled,
            editDisabled: editDisabled,
            deleteDisabled: deleteDisabled
        });
    }


    hasChildren(hierarchyItem: Hierarchy): boolean {
        const index = this.sourceList.indexOf(hierarchyItem);

        if (index == this.sourceList.length - 1) return false;

        if (this.sourceList[index! + 1].hierarchyGroupID! > this.sourceList[index!].hierarchyGroupID!) {
            return true;
        } else {
            return false;
        }
    }


    getIndexOfHierarchyItemParent(hierarchyItem: Hierarchy): number {
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


    


    sort(hierarchyItem: Hierarchy) {
        let parentHierarchyIndex: number = -1;
        let tempArray: Array<Hierarchy> = new Array<Hierarchy>();
        let newHierarchyGroup: Array<Hierarchy> = new Array<Hierarchy>();

        // If the selected hierarchy item belongs to the top level group
        if (hierarchyItem.hierarchyGroupID == 0) {
            // Copy all the hierarchy items from that group to the temp array
            tempArray = (this.sourceList as Array<Hierarchy>).filter(x => x.hierarchyGroupID == 0);

            // If the selected hierarchy item belongs to any other group
        } else {

            // First get the parent of the selected hierarchy item
            parentHierarchyIndex = this.getIndexOfHierarchyItemParent(hierarchyItem);

            // Then copy all the children belonging to that hierarchy parent to the temp array
            for (let i = parentHierarchyIndex + 1; i < this.sourceList.length; i++) {
                if (this.sourceList[i].hierarchyGroupID == this.sourceList[parentHierarchyIndex].hierarchyGroupID) break;
                if (this.sourceList[i].hierarchyGroupID == this.sourceList[parentHierarchyIndex].hierarchyGroupID! + 1) {
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
                if (i != index && this.sourceList[i].hierarchyGroupID! <= this.sourceList[index].hierarchyGroupID!) break;

                // And add them to the new hierarchy group
                newHierarchyGroup.push(this.sourceList[i] as Hierarchy);
            }
        })

        // Remove the old hierarchy group from the source
        this.sourceList.splice(parentHierarchyIndex + 1, newHierarchyGroup.length);
        // Add the new hierarchy group to the source
        this.sourceList.splice(parentHierarchyIndex + 1, 0, ...newHierarchyGroup);

        // Remove the selected hierarchy item and then put it back so the indent can take effect
        const hierarchyItemIndex = this.sourceList.findIndex(x => x.id == hierarchyItem?.id);
        this.sourceList.splice(hierarchyItemIndex, 1);
        this.sourceList.splice(hierarchyItemIndex, 0, { id: hierarchyItem.id, name: hierarchyItem.name, hierarchyGroupID: hierarchyItem.hierarchyGroupID, isParent: hierarchyItem.isParent } as Hierarchy);

        // And because we removed the selected hierarchy item we lost our event listeners so we have to put them back
        window.setTimeout(()=> {
            this.addEventListeners();
        },35)
    }
}