import { EditableArrowItemComponent } from "../components/items/editable-arrow-item/editable-arrow-item.component";
import { EditableList } from "./editable-list";
import { ListUpdateType } from "./list";

export class EditableArrowList extends EditableList {

    onArrowClick(item: EditableArrowItemComponent) {
        item.arrowDown = !item.arrowDown;
        this.onListUpdate.next({ type: ListUpdateType.ArrowClicked, id: item.id, index: this.getItemIndex(item), name: item.name, arrowDown: item.arrowDown });
    }
}