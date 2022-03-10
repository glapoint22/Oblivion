import { EditableCheckboxListItemComponent } from "../components/items/editable-checkbox-list-item/editable-checkbox-list-item.component";
import { CheckboxListItem } from "./checkbox-list-item";
import { EditableListManager } from "./editable-list-manager";
import { ListUpdateType } from "./enums";

export class EditableCheckboxListManager extends EditableListManager {

    getItem(item: EditableCheckboxListItemComponent): CheckboxListItem {
        const listItem: CheckboxListItem = this.sourceList.find(x => x.id == item.id) as CheckboxListItem;
        return listItem;
    }

    onCheckboxChange(listItem: CheckboxListItem) {
        listItem.isChecked = !listItem.isChecked;
        this.setListUpdate(listItem);
    }


    setListUpdate(listItem: CheckboxListItem) {
        let addDisabled!: boolean;
        let editDisabled!: boolean;
        let deleteDisabled!: boolean;
        const itemSelectedCount = this.sourceList.filter(x => x.selected == true).length;

        if (itemSelectedCount == 0) {
            addDisabled = false;
            editDisabled = true;
            deleteDisabled = true;

        } else {

            if (itemSelectedCount > 1) {
                addDisabled = false;
                editDisabled = true;
                deleteDisabled = false;

            } else {

                addDisabled = false;
                editDisabled = false;
                deleteDisabled = false;
            }
        }


        this.onListUpdate.next({
            type: ListUpdateType.CheckboxChange,
            id: listItem.id,
            index: this.sourceList.indexOf(listItem),
            name: listItem.name,
            isChecked: listItem.isChecked,
            addDisabled: addDisabled,
            editDisabled: editDisabled,
            deleteDisabled: deleteDisabled
        });
    }
}