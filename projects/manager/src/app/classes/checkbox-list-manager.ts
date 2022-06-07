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

        const listItemIndex = this.sourceList.findIndex(x => x.id == listItem.id && x.name == listItem.name);

        this.sourceList.splice(listItemIndex, 1);


        (this.sourceList as Array<CheckboxItem>).splice(listItemIndex, 0, { id: listItem.id, name: listItem.name, checked: listItem.checked });
    }



    resetIndent() {
        const listItemIndex = this.sourceList.findIndex(x => x.id == this.editedItem.id && x.name == this.editedItem.name);

        this.sourceList.splice(listItemIndex, 1);

        (this.sourceList as Array<CheckboxItem>).splice(listItemIndex, 0, { id: this.editedItem.id, name: this.editedItem.name, checked: (this.editedItem as CheckboxItem).checked });
    }
}