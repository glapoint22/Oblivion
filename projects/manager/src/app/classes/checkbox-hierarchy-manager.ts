import { Subject } from "rxjs";
import { CheckboxHierarchyItem } from "./checkbox-hierarchy-item";
import { CheckboxListUpdate } from "./checkbox-list-update";
import { ListUpdateType } from "./enums";
import { HierarchyManager } from "./hierarchy-manager";

export class CheckboxHierarchyManager extends HierarchyManager {
    onListUpdate = new Subject<CheckboxListUpdate>();

    onCheckboxChange(hierarchyItem: CheckboxHierarchyItem) {
        hierarchyItem.isChecked = !hierarchyItem.isChecked;
        this.onListUpdate.next({ type: ListUpdateType.CheckboxChange, id: hierarchyItem.id, index: this.sourceList.indexOf(hierarchyItem), name: hierarchyItem.name, isChecked: hierarchyItem.isChecked, addDisabled: this.addDisabled, editDisabled: this.editDisabled, deleteDisabled: this.deleteDisabled });
    }
}