import { CheckboxListItemComponent } from "../components/items/checkbox-list-item/checkbox-list-item.component";
import { CheckboxListItem } from "./checkbox-list-item";
import { ListUpdateType } from "./enums";
import { ListManager } from "./list-manager";

export class CheckboxListManager extends ListManager {

    getItem(item: CheckboxListItemComponent): CheckboxListItem {
        const listItem: CheckboxListItem = this.sourceList.find(x => x.id == item.id) as CheckboxListItem;
        return listItem;
    }

    onCheckboxChange(listItem: CheckboxListItem) {
        listItem.isChecked = !listItem.isChecked;
        this.onListUpdate.next({
            type: ListUpdateType.CheckboxChange,
            id: listItem.id,
            index: this.sourceList.indexOf(listItem),
            name: listItem.name,
            isChecked: listItem.isChecked,
            addDisabled: true,
            editDisabled: true,
            deleteDisabled: true
        });
    }
}