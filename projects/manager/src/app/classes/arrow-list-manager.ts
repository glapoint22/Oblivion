import { ArrowItemComponent } from "../components/items/arrow-item/arrow-item.component";
import { ListManager, ListUpdateType } from "./list-manager";

export class ArrowListManager extends ListManager {
    onArrowClick(item: ArrowItemComponent) {
        item.arrowDown = !item.arrowDown;
        this.onListUpdate.next({ type: ListUpdateType.ArrowClicked, id: item.id, index: this.getItemIndex(item), name: item.name, arrowDown: item.arrowDown });
    }
}