import { Subject } from "rxjs";
import { CheckboxMultiColumnItem } from "./checkbox-multi-column-item";
import { CheckboxMultiColumnListUpdate } from "./checkbox-multi-column-list-update";
import { ListUpdateType } from "./enums";
import { MultiColumnListManager } from "./multi-column-list-manager";

export class CheckboxMultiColumnListManager extends MultiColumnListManager {
    sourceList!: Array<CheckboxMultiColumnItem>;
    onListUpdate = new Subject<CheckboxMultiColumnListUpdate>();

    onCheckboxChange(checkboxMultiColumnItem: CheckboxMultiColumnItem) {
        checkboxMultiColumnItem.checked = !checkboxMultiColumnItem.checked;
        this.onListUpdate.next({ type: ListUpdateType.CheckboxChange, id: checkboxMultiColumnItem.id, index: this.sourceList.indexOf(checkboxMultiColumnItem), name: checkboxMultiColumnItem.values[0].name, checked: checkboxMultiColumnItem.checked, addDisabled: this.addDisabled, editDisabled: this.editDisabled, deleteDisabled: this.deleteDisabled });
    }


    resetIndent() {
        const index = this.sourceList.findIndex(x => x == this.editedItem);

        this.sourceList[index].hidden = true;

        window.setTimeout(() => {
            this.sourceList[index].hidden = false;
        })
    }
}