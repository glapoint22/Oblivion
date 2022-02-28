import { CheckboxItemComponent } from "../components/items/checkbox-item/checkbox-item.component";
import { List, ListUpdateType } from "./list";

export class CheckboxList extends List {
    
    onCheckboxChange(item: CheckboxItemComponent) {
        this.onListUpdate.next({ type: ListUpdateType.CheckboxChange, id: item.id, index: this.getItemIndex(item), name: item.name, isChecked: item.isChecked });
    }
}