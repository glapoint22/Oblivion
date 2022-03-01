import { EditableArrowItemComponent } from "../components/items/editable-arrow-item/editable-arrow-item.component";
import { EditableListManager } from "./editable-list-manager";
import { ListUpdateType } from "./list-manager";

export class EditableArrowListManager extends EditableListManager {

    onArrowClick(item: EditableArrowItemComponent) {
        item.arrowDown = !item.arrowDown;
        this.onListUpdate.next({ type: ListUpdateType.ArrowClicked, id: item.id, index: this.getItemIndex(item), name: item.name, arrowDown: item.arrowDown });
    }
}