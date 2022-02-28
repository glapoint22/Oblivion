import { ItemComponent } from "../components/items/item/item.component";
import { ListManager } from "./list";

export class EditableListManager extends ListManager {
    keydown(e: KeyboardEvent) {
        super.keydown(e);
        if (e.key === 'Enter') this.enter(e);
    }

    setAddItem(item: ItemComponent) {
        this.newItem = true;
        this.selectedItem = null!;
        this.unselectedItem = null!;
        this.editableItem = item;
        this.setItemFocus(this.editableItem);
        this.onListUpdate.next({ addDisabled: true, editDisabled: true, deleteDisabled: true });
    }


    onEditItem(item: ItemComponent) {
        if (this.selectedItem) {
            this.editableItem = item;
            this.selectedItem = null!;

            this.items.forEach(x => {
                if (x.selected) x.selected = false;
                if (x.selectType) x.SelectType = null!;
            })
            this.setItemFocus(this.editableItem);
            this.onListUpdate.next({ addDisabled: true, editDisabled: true, deleteDisabled: true });
        }
    }



    editItem() {
        this.overButton = false;
        this.onEditItem(this.selectedItem);
    }



    onItemDoubleClick(item: ItemComponent) {
        if (!this.shiftKeyDown && !this.ctrlKeyDown) {
            this.onEditItem(item);
        }
    }
}