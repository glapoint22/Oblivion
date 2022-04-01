import { HierarchyItemComponent } from "../components/items/hierarchy-item/hierarchy-item.component";
import { CheckboxHierarchyItem } from "./checkbox-hierarchy-item";
import { ListUpdateType } from "./enums";
import { HierarchyManager } from "./hierarchy-manager";

export class CheckboxHierarchyManager extends HierarchyManager {

    onCheckboxChange(hierarchyItem: CheckboxHierarchyItem) {
        hierarchyItem.isChecked = !hierarchyItem.isChecked;
        this.onListUpdate.next({ type: ListUpdateType.CheckboxChange, id: hierarchyItem.id, index: this.sourceList.indexOf(hierarchyItem), name: hierarchyItem.name, isChecked: hierarchyItem.isChecked, addDisabled: this.addDisabled, editDisabled: this.editDisabled, deleteDisabled: this.deleteDisabled });
    }
}