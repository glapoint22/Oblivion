import { HierarchyItemComponent } from "../components/items/hierarchy-item/hierarchy-item.component";
import { ListUpdateType } from "./enums";
import { HierarchyItem } from "./hierarchy-item";
import { ListManager } from "./list-manager";

export class HierarchyManager extends ListManager {

    getItem(itemComponent: HierarchyItemComponent): HierarchyItem {
        const hierarchyItem: HierarchyItem = this.sourceList.find(x => x.id == itemComponent.id) as HierarchyItem;
        return hierarchyItem;
    }

    onArrowClick(hierarchyItem: HierarchyItem) {
        hierarchyItem.arrowDown = !hierarchyItem.arrowDown;
        this.onListUpdate.next({
            type: ListUpdateType.ArrowClicked,  
            id: hierarchyItem.id,
            index: this.sourceList.indexOf(hierarchyItem),
            name: hierarchyItem.name,
            arrowDown: hierarchyItem.arrowDown,
            addDisabled: true,
            editDisabled: true,
            deleteDisabled: true
        });
    }
}