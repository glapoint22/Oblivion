import { CheckboxItemComponent } from "../components/items/checkbox-item/checkbox-item.component";
import { ListManager, ListUpdateType } from "./list";

export class CheckboxListManager extends ListManager {
    
    onCheckboxChange(item: CheckboxItemComponent) {
        this.onListUpdate.next({ type: ListUpdateType.CheckboxChange, id: item.id, index: this.getItemIndex(item), name: item.name, isChecked: item.isChecked });
    }
}