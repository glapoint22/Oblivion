import { CheckboxHierarchyManager } from "./checkbox-hierarchy-manager";
import { CheckboxListItem } from "./checkbox-list-item";

export class CheckboxListManager extends CheckboxHierarchyManager {

    sort(listItem: CheckboxListItem) {
        // Sort
        this.sourceList.sort((a, b) => (a.name! > b.name!) ? 1 : -1);

        // If a new item is being added to the list
        if (this.newItem) {
            // Get the index of where the sorted item now resides
            const listItemIndex = this.sourceList.findIndex(x => x.id == listItem?.id);

            // Remove the new item because the checkbox appears to the right of the list name
            this.sourceList.splice(listItemIndex, 1);

            // Re-add the item to the list
            this.sourceList.splice(listItemIndex, 0, { id: listItem.id, name: listItem.name });

            // And because we removed the new list item, we lost our event listeners, so we have to put them back
            window.setTimeout(() => {
                this.addEventListeners();
            }, 35)
        }
    }
}