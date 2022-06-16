import { Subject } from "rxjs";
import { CheckboxItem } from "./checkbox-item";
import { CheckboxListUpdate } from "./checkbox-list-update";
import { ListUpdateType } from "./enums";
import { HierarchyManager } from "./hierarchy-manager";
import { KeywordCheckboxItem } from "./keyword-checkbox-item";

export class CheckboxHierarchyManager extends HierarchyManager {
    onListUpdate = new Subject<CheckboxListUpdate>();


    // ================================================================( ON CHECKBOX CHANGE )================================================================= \\

    onCheckboxChange(hierarchyItem: CheckboxItem) {
        hierarchyItem.checked = !hierarchyItem.checked;
        this.onListUpdate.next(
            {
                type: ListUpdateType.CheckboxChange,
                id: hierarchyItem.id,
                index: this.sourceList.indexOf(hierarchyItem),
                name: hierarchyItem.name,
                checked: hierarchyItem.checked,
                addDisabled: this.addDisabled,
                editDisabled: this.editDisabled,
                deleteDisabled: this.deleteDisabled
            }
        );
    }



    // ==================================================================( RESTORE INDENT )=================================================================== \\

    restoreIndent() {
        const listItemIndex = this.sourceList.findIndex(x => x == this.editedItem);
        if (this.editedItem) {
            this.editedItem = (this.sourceList[listItemIndex] as KeywordCheckboxItem) = {
                id: this.editedItem.id,
                name: this.editedItem.name,
                hierarchyGroupID: this.editedItem.hierarchyGroupID,
                arrowDown: (this.editedItem as KeywordCheckboxItem).arrowDown,
                isParent: (this.editedItem as KeywordCheckboxItem).isParent,
                checked: (this.editedItem as KeywordCheckboxItem).checked,
                forProduct: (this.editedItem as KeywordCheckboxItem).forProduct,
                color: (this.editedItem as KeywordCheckboxItem).color,
                case: this.editedItem.case
            }
        }
    }
}