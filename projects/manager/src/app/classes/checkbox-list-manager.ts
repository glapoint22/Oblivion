import { CheckboxHierarchyManager } from "./checkbox-hierarchy-manager";
import { CheckboxItem } from "./checkbox-item";

export class CheckboxListManager extends CheckboxHierarchyManager {


    // =======================================================================( SORT )======================================================================== \\

    sort(listItem: CheckboxItem) {
        this.sourceList.sort((a, b) => (a.name! > b.name!) ? 1 : -1);
        this.restoreIndent();
    }


    // ==================================================================( RESTORE INDENT )=================================================================== \\

    restoreIndent() {
        const listItemIndex = this.sourceList.findIndex(x => x == this.editedItem);

        if (this.editedItem) {
            this.editedItem = (this.sourceList[listItemIndex] as CheckboxItem) = {
                id: this.editedItem.id,
                name: this.editedItem.name,
                checked: (this.editedItem as CheckboxItem).checked
            }
        }
    }
}