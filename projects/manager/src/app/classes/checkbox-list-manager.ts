import { CheckboxItemComponent } from "../components/items/checkbox-item/checkbox-item.component";
import { CheckboxListItem } from "./checkbox-list-item";
import { ListUpdateType } from "./enums";
import { ListManager } from "./list-manager";

export class CheckboxListManager extends ListManager {

    getItem(item: CheckboxItemComponent): CheckboxListItem {
        const listItem: CheckboxListItem = this.sourceList.find(x => x.id == item.id) as CheckboxListItem;
        return listItem;
    }

    onCheckboxChange(listItem: CheckboxListItem) {
        listItem.isChecked = !listItem.isChecked;
        this.onListUpdate.next({ type: ListUpdateType.CheckboxChange, id: listItem.id, index: this.sourceList.indexOf(listItem), name: listItem.name, isChecked: listItem.isChecked, addDisabled: this.addDisabled, editDisabled: this.editDisabled, deleteDisabled: this.deleteDisabled });
    }
}