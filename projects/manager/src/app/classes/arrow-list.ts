import { ArrowItemComponent } from "../components/items/arrow-item/arrow-item.component";
import { List, ListUpdateType } from "./list";

export class ArrowList extends List {
    onArrowClick(item: ArrowItemComponent) {
        item.arrowDown = !item.arrowDown;
        this.onListUpdate.next({ type: ListUpdateType.ArrowClicked, id: item.id, index: this.getItemIndex(item), name: item.name, arrowDown: item.arrowDown });
    }
}