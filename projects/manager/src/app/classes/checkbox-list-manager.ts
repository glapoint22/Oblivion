import { Subject } from "rxjs";
import { CheckboxItem } from "./checkbox-item";
import { CheckboxListUpdate } from "./checkbox-list-update";
import { ListUpdateType } from "./enums";
import { ListManager } from "./list-manager";

export class CheckboxListManager extends ListManager {


    // ================================================================( ON CHECKBOX CHANGE )================================================================= \\

    onCheckboxChange(checkboxItem: CheckboxItem) {
        checkboxItem.checked = !checkboxItem.checked;
        (this.onListUpdate as Subject<CheckboxListUpdate>).next(
            {
                type: ListUpdateType.CheckboxChange,
                id: checkboxItem.id,
                index: this.sourceList.indexOf(checkboxItem),
                name: checkboxItem.name,
                checked: checkboxItem.checked,
                addDisabled: this.addDisabled,
                editDisabled: this.editDisabled,
                deleteDisabled: this.deleteDisabled
            }
        );
    }


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
                checked: (this.editedItem as CheckboxItem).checked,
                case: this.editedItem.case
            }
        }
    }
}