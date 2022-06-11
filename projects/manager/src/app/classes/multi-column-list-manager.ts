import { Subject } from "rxjs";
import { ListUpdateType } from "./enums";
import { ListManager } from "./list-manager"
import { MultiColumnItem } from "./multi-column-item";
import { MultiColumnItemValue } from "./multi-column-item-value";
import { MultiColumnListUpdate } from "./multi-column-list-update";

export class MultiColumnListManager extends ListManager {
    editableValue!: MultiColumnItemValue;
    onListUpdate = new Subject<MultiColumnListUpdate>();
    sourceList!: Array<MultiColumnItem>;
    sortable: boolean = false;


    // ===============================================================( ON VALUE DOUBLE CLICK )=============================================================== \\
    
    onValueDoubleClick(multiColumnItem: MultiColumnItem, value: MultiColumnItemValue) {
        if (!this.shiftKeyDown && !this.ctrlKeyDown) {
            this.setValueEdit(multiColumnItem, value);
            this.doubleClickUpdate();
        }
    }



    // ==================================================================( SET VALUE EDIT )=================================================================== \\
    
    setValueEdit(multiColumnItem: MultiColumnItem, value: MultiColumnItemValue) {
        if (value.allowEdit) {
            this.editableValue = value;
            this.setEdit(multiColumnItem);
        }
    }



    // ==================================================================( GET EDITED ITEM )================================================================== \\

    getEditedItem() {
        return this.editableValue;
    }



    // ===================================================================( GET HTML ITEM )=================================================================== \\

    getHtmlItem() {
        return this.editableValue.htmlValue!.nativeElement;
      }


    // ===================================================================( RESELECT ITEM )=================================================================== \\

    reselectItem() {
        super.reselectItem();
        this.editableValue = null!;
    }



    // ==================================================================( ADD EDIT UPDATE )================================================================== \\

    addEditUpdate(multiColumnItem: MultiColumnItem) {
        this.onListUpdate.next(
            {
                type: this.newItem ? ListUpdateType.Add : ListUpdateType.Edit,
                id: multiColumnItem.id,
                index: this.sourceList.findIndex(x => x.id == multiColumnItem.id && x.values[0].name == multiColumnItem.values[0].name && x.values[1].name == multiColumnItem.values[1].name),
                values: multiColumnItem.values
            }
        );
    }



    // ==============================================================( VERIFY ADD EDIT UPDATE )=============================================================== \\

    verifyAddEditUpdate(multiColumnItem: MultiColumnItem, name: string) {
        this.onListUpdate.next(
            {
                type: ListUpdateType.VerifyAddEdit,
                id: multiColumnItem.id,
                index: this.sourceList.findIndex(x => x.id == multiColumnItem.id && x.values[0].name == multiColumnItem.values[0].name && x.values[1].name == multiColumnItem.values[1].name),
                values: [{ name: name, width: multiColumnItem.values[0].width }, { name: multiColumnItem.values[1].name, width: multiColumnItem.values[1].width }]
            }
        );
    }



    // ================================================================( DELETE PROMPT UPDATE )=============================================================== \\

    deletePromptUpdate(deletedItems: Array<MultiColumnItem>) {
        this.onListUpdate.next(
            {
                type: ListUpdateType.DeletePrompt,
                deletedMultiColumnItems: deletedItems!.map((x) => {
                    return {
                        id: x.id,
                        index: this.sourceList.findIndex(y => y.id == x.id && y.values[0].name == x.values[0].name && y.values[1].name == x.values[1].name),
                        values: x.values
                    }
                })
            });
    }



    // ====================================================================( DELETE UPDATE )================================================================== \\

    deleteUpdate(deletedItems: Array<MultiColumnItem>) {
        this.onListUpdate.next(
            {
                type: ListUpdateType.Delete,
                deletedMultiColumnItems: deletedItems!.map((x) => {
                    return {
                        id: x.id,
                        index: this.sourceList.findIndex(y => y.id == x.id && y.values[0].name == x.values[0].name && y.values[1].name == x.values[1].name),
                        values: x.values
                    }
                })
            });
    }



    // ===============================================================( SELECTED ITEMS UPDATE )=============================================================== \\

    selectedItemsUpdate(rightClick: boolean) {
        const selectedItems = this.sourceList.filter(x => x.selected == true);
        selectedItems.forEach(x => x.index = this.sourceList.findIndex(y => y.id == x?.id && y.hierarchyGroupID == x.hierarchyGroupID));
        this.onListUpdate.next({ type: ListUpdateType.SelectedItems, selectedMultiColumnItems: selectedItems, rightClick: rightClick });
    }
}