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


    // =================================================================( SET DOUBLE CLICK )================================================================== \\

    setDoubleClick(multiColumnItem: MultiColumnItem, value?: MultiColumnItemValue) {
        this.setValueEdit(multiColumnItem, value!);
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
                values: multiColumnItem.values,
                oldName: this.editItemOldName
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
                deletedItems: deletedItems!.map((x) => {
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
                deletedItems: deletedItems!.map((x) => {
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
        this.onListUpdate.next({ type: ListUpdateType.SelectedItems, selectedItems: selectedItems, rightClick: rightClick });
    }



    // ==================================================================( RESTORE INDENT )=================================================================== \\

    restoreIndent() {
        const listItemIndex: number = this.sourceList.findIndex(x => x == this.editedItem);
        if (this.editedItem) {
            this.editedItem = (this.sourceList[listItemIndex] as MultiColumnItem) = {
                id: this.editedItem.id,
                name: this.editedItem.name,
                values: (this.editedItem as MultiColumnItem).values,
                opacity: this.editedItem.opacity,
                case: this.editedItem.case
            }
        }
    }
}