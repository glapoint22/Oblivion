import { Subject } from "rxjs";
import { CheckboxItem } from "./checkbox-item";
import { CheckboxListUpdate } from "./checkbox-list-update";
import { ListUpdateType } from "./enums";
import { HierarchyManager } from "./hierarchy-manager";

export class CheckboxHierarchyManager extends HierarchyManager {
    onListUpdate = new Subject<CheckboxListUpdate>();

    onCheckboxChange(hierarchyItem: CheckboxItem) {
        hierarchyItem.checked = !hierarchyItem.checked;
        this.onListUpdate.next({ type: ListUpdateType.CheckboxChange, id: hierarchyItem.id, index: this.sourceList.indexOf(hierarchyItem), name: hierarchyItem.name, checked: hierarchyItem.checked, addDisabled: this.addDisabled, editDisabled: this.editDisabled, deleteDisabled: this.deleteDisabled });
    }
}