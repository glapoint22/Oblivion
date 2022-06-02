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

    onValueDoubleClick(multiColumnItem: MultiColumnItem, value: MultiColumnItemValue) {
        if (!this.shiftKeyDown && !this.ctrlKeyDown) {
            this.setValueEdit(multiColumnItem, value);
            this.doubleClickUpdate();
        }
    }


    setValueEdit(multiColumnItem: MultiColumnItem, value: MultiColumnItemValue) {

        if (value.allowEdit) {
            this.addDisabled = true;
            this.editDisabled = true;
            this.deleteDisabled = true;
            this.addEventListeners();
            this.overButton = false;
            this.editedItem = multiColumnItem;
            this.editableValue = value;


            this.editableValue.htmlValue!.nativeElement.innerText = this.editableValue.htmlValue!.nativeElement.innerText.trim()!;

            this.selectedItem = null!;

            this.sourceList.forEach(x => {
                if (x.selected) x.selected = false;
                if (x.selectType) x.selectType = null!;
            })
            this.setValueFocus();
            this.buttonsUpdate();
        }
    }


    setValueFocus() {
        window.setTimeout(() => {
            let range = document.createRange();
            range.selectNodeContents(this.editableValue.htmlValue!.nativeElement);
            let sel = window.getSelection();
            sel!.removeAllRanges();
            sel!.addRange(range);
        });
    }


    setItemSelection(multiColumnItem: MultiColumnItem) {
        // If an item is being edited and another item that is NOT being edited is selected
        if (this.editedItem != null && multiColumnItem != this.editedItem) {
            this.evaluateEdit();
        }
        super.setItemSelection(multiColumnItem);
    }



    commitAddEdit() {
        // Update the name property
        this.editableValue.name = this.editableValue.htmlValue?.nativeElement.innerText?.trim()!;
        super.commitAddEdit();
    }


    evaluateEdit(isEscape?: boolean, isBlur?: boolean) {

        const trimmedEditedValue = this.editableValue.htmlValue!.nativeElement.innerText.trim();

        // If the edited value has text written in it
        if (trimmedEditedValue!.length > 0) {

            // If we pressed the (Escape) key
            if (isEscape) {

                // As long as the edited name is different from what it was before the edit
                // if (trimmedEditedValue != this.editableValue.name.trim()) {


                // Reset the item back to the way it was before the edit
                this.editableValue.htmlValue!.nativeElement.innerText = this.editableValue.name.trim()!;




                // }

                // If we did NOT press the (Escape) key
                // But the (Enter) key was pressed or the list item was (Blurred)
            } else {

                // As long as the edited name is different from what it was before the edit
                if (trimmedEditedValue != this.editableValue.name.trim()) {

                    // If this list is set to verify add and edit
                    if (this.verifyAddEdit) {

                        if (!this.addEditVerificationInProgress) {
                            this.addEditVerificationInProgress = true;
                            this.verifyAddEditUpdate(this.editedItem as MultiColumnItem, trimmedEditedValue);
                            return
                        }

                        // If this list does NOT verify
                    } else {
                        // Update the name property
                        this.editableValue.name = trimmedEditedValue!;

                        this.addEditUpdate(this.editedItem as MultiColumnItem);
                    }
                }
            }


            // But if the item is empty
        } else {

            // If we pressed the (Escape) key or the item was (Blurred)
            if (isEscape || isBlur) {

                // Reset the item back to the way it was before the edit
                this.editableValue.htmlValue!.nativeElement.innerText = this.editableValue.name.trim()!;
            }
        }


        // As long as the (Enter) key was NOT pressed
        if (isEscape || isBlur) {
            this.reselectItem();
            this.setButtonsState();
        }
    }


    reselectItem() {
        super.reselectItem();
        this.editableValue = null!;
    }



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


    verifyAddEditUpdate(multiColumnItem: MultiColumnItem, name: string) {
        this.onListUpdate.next(
            {
                type: ListUpdateType.VerifyAddEdit,
                id: multiColumnItem.id,
                index: this.sourceList.findIndex(x => x.id == multiColumnItem.id && x.values[0].name == multiColumnItem.values[0].name && x.values[1].name == multiColumnItem.values[1].name),
                values: multiColumnItem.values
            }
        );
    }



    selectedItemsUpdate(rightClick: boolean) {
        const selectedItems = this.sourceList.filter(x => x.selected == true);
        selectedItems.forEach(x => x.index = this.sourceList.findIndex(y => y.id == x?.id && y.hierarchyGroupID == x.hierarchyGroupID));
        this.onListUpdate.next({ type: ListUpdateType.SelectedItems, selectedMultiColumnItems: selectedItems, rightClick: rightClick });
    }




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


    onDuplicatePromptClose() {
        // If a duplicate item was found while adding an item
        if (this.newItem) {
            this.editableValue.htmlValue!.nativeElement.innerText = '';

            // If a duplicate item was found while editing an item
        } else {
            this.editableValue.htmlValue!.nativeElement.innerText = this.editableValue.name.trim()!;
        }

        this.setValueFocus();
        this.addDisabled = true;
        this.editDisabled = true;
        this.deleteDisabled = true;
        this.buttonsUpdate();
    }
}