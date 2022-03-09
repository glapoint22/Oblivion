import { ArrowItemComponent } from "../components/items/arrow-item/arrow-item.component";
import { ListUpdateType } from "./enums";
import { Hierarchy } from "./hierarchy";
import { ListManager } from "./list-manager";

export class ArrowListManager extends ListManager {

    getListItem(item: ArrowItemComponent): Hierarchy {
        const listItem: Hierarchy = this.sourceList.find(x => x.id == item.id) as Hierarchy;
        return listItem;
    }

    onArrowClick(listItem: Hierarchy) {
        listItem.arrowDown = !listItem.arrowDown;
        this.onListUpdate.next({
            type: ListUpdateType.ArrowClicked,  
            id: listItem.id,
            index: this.sourceList.indexOf(listItem),
            name: listItem.name,
            arrowDown: listItem.arrowDown,
            addDisabled: true,
            editDisabled: true,
            deleteDisabled: true
        });
    }
}