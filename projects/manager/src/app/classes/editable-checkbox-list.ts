import { EditableCheckboxItemComponent } from "../components/items/editable-checkbox-item/editable-checkbox-item.component";
import { EditableList } from "./editable-list";
import { ListUpdateType } from "./list";

export class EditableCheckboxList extends EditableList {
    
    onCheckboxChange(item: EditableCheckboxItemComponent) {
        item.isChecked = !item.isChecked;
        this.onListUpdate.next({ type: ListUpdateType.CheckboxChange, id: item.id, index: this.getItemIndex(item), name: item.name, isChecked: item.isChecked });
    }

    isChecked(item: EditableCheckboxItemComponent): void {
        window.setTimeout(() => {
            const updatedItem = this.items.find(x => x.id == item.id) as EditableCheckboxItemComponent;
            updatedItem.isChecked = item.isChecked;
        })
    }
}