import { LazyLoadingService } from "common";
import { CheckboxHierarchyManager } from "./checkbox-hierarchy-manager";
import { CheckboxItem } from "./checkbox-item";

export class CheckboxListManager extends CheckboxHierarchyManager {

    constructor(lazyLoadingService: LazyLoadingService) { 
        super(lazyLoadingService);
    }

    sort(listItem: CheckboxItem) {
        // Sort
        this.sourceList.sort((a, b) => (a.name! > b.name!) ? 1 : -1);

        // If a new item is being added to the list
        // if (this.newItem) {
            // Get the index of where the sorted item now resides
            const listItemIndex = this.sourceList.findIndex(x => x.id == listItem.id && x.name == listItem.name);

            // Remove the new item because the checkbox appears to the right of the list name
            this.sourceList.splice(listItemIndex, 1);

            
            // Re-add the item to the list
            this.sourceList.splice(listItemIndex, 0, { id: listItem.id, name: listItem.name });

            

        // }
    }
}