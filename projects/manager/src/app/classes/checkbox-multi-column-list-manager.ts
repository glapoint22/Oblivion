import { Subject } from "rxjs";
import { CheckboxMultiColumnItem } from "./checkbox-multi-column-item";
import { CheckboxMultiColumnListUpdate } from "./checkbox-multi-column-list-update";
import { ListUpdateType } from "./enums";
import { KeywordCheckboxMultiColumnItem } from "./keyword-checkbox-multi-column-item";
import { MultiColumnListManager } from "./multi-column-list-manager";

export class CheckboxMultiColumnListManager extends MultiColumnListManager {
    sourceList!: Array<CheckboxMultiColumnItem>;
    onListUpdate = new Subject<CheckboxMultiColumnListUpdate>();


    // ================================================================( ON CHECKBOX CHANGE )================================================================= \\

    onCheckboxChange(checkboxMultiColumnItem: CheckboxMultiColumnItem) {
        checkboxMultiColumnItem.checked = !checkboxMultiColumnItem.checked;
        this.onListUpdate.next(
            {
                type: ListUpdateType.CheckboxChange,
                id: checkboxMultiColumnItem.id,
                index: this.sourceList.indexOf(checkboxMultiColumnItem),
                name: checkboxMultiColumnItem.values[0].name,
                checked: checkboxMultiColumnItem.checked,
                addDisabled: this.addDisabled,
                editDisabled: this.editDisabled,
                deleteDisabled: this.deleteDisabled
            }
        );
    }



    // ==================================================================( RESTORE INDENT )=================================================================== \\

    restoreIndent() {
        const listItemIndex: number = this.sourceList.findIndex(x => x == this.editedItem);

        this.editedItem = (this.sourceList[listItemIndex] as KeywordCheckboxMultiColumnItem) = {
            id: this.editedItem.id,
            name: this.editedItem.name,
            values: (this.editedItem as KeywordCheckboxMultiColumnItem).values,
            checked: (this.editedItem as KeywordCheckboxMultiColumnItem).checked,
            forProduct: (this.editedItem as KeywordCheckboxMultiColumnItem).forProduct
        }
    }
}