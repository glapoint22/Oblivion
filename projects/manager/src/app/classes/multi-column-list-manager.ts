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

    onValueDoubleClick(multiColumnItem: MultiColumnItem, value: MultiColumnItemValue) {
        if (!this.shiftKeyDown && !this.ctrlKeyDown) {
            this.setValueEdit(multiColumnItem, value);
        }
    }


    setValueEdit(multiColumnItem: MultiColumnItem, value: MultiColumnItemValue) {

        if (value.allowEdit) {
            this.addEventListeners();
            this.overButton = false;
            this.editedItem = multiColumnItem;
            this.editableValue = value;
            this.selectedItem = null!;

            this.sourceList.forEach(x => {
                if (x.selected) x.selected = false;
                if (x.selectType) x.selectType = null!;
            })
            this.setValueFocus();
            this.onListUpdate.next({ addDisabled: true, editDisabled: true, deleteDisabled: true });
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


    // onValueBlur(multiColumnItem: MultiColumnItem) {
    //     this.editableValue = null!;

    //     super.onItemBlur(multiColumnItem);
    // }


    setItemSelection(multiColumnItem: MultiColumnItem) {
        // If an item is being edited and another item that is NOT being edited is selected
        if (this.editedItem != null && multiColumnItem != this.editedItem) {
            this.evaluateEdit();
        }
        super.setItemSelection(multiColumnItem);
    }



    commitAddEdit() {
        const trimmedEditedValue = this.editableValue.htmlValue?.nativeElement.textContent?.trim();
        this.addEditVerificationInProgress = false;

        // Update the name property
        this.editableValue.name = trimmedEditedValue!;
        // Select the item that was renamed
        // this.selectItem(this.sourceList[this.sourceList.findIndex(x => x.identity == this.editedItem?.identity)]);
        // Send update


        this.resetItemTextContent();


        this.addEditUpdate(this.editedItem as MultiColumnItem);

        if (this.selectable) {
            this.selectedItem = this.editedItem;
            this.selectedItem.selected = true;
        }

        this.editedItem = null!;
        this.editableValue = null!;

        this.buttonsUpdate();
    }


    evaluateEdit(isEscape?: boolean, isBlur?: boolean) {
        const trimmedEditedValue = this.editableValue.htmlValue?.nativeElement.textContent?.trim();

        // If the edited value has text written in it
        if (trimmedEditedValue!.length > 0) {

            // If we pressed the (Escape) key
            if (isEscape) {

                // As long as the edited name is different from what it was before the edit
                if (trimmedEditedValue != this.editableValue.name) {

                    // Reset the item back to the way it was before the edit
                    this.editableValue.htmlValue!.nativeElement.textContent = this.editableValue.name!;
                }

                // If we did NOT press the (Escape) key
                // But the (Enter) key was pressed or the list item was (Blurred)
            } else {

                // As long as the edited name is different from what it was before the edit
                if (trimmedEditedValue != this.editableValue.name) {

                    // If this list is set to verify add and edit
                    if (this.verifyAddEdit) {

                        if (!this.addEditVerificationInProgress) {
                            this.addEditVerificationInProgress = true;
                            this.verifyAddEditUpdate(this.editedItem as MultiColumnItem, trimmedEditedValue!);
                            return
                        }

                        // If this list does NOT verify
                    } else {
                        // Update the name property
                        this.editableValue.name = trimmedEditedValue!;
                        // // Select the item that was renamed
                        // this.selectItem(this.sourceList[this.sourceList.findIndex(x => x.identity == this.editedItem?.identity)]);
                        // // Send update
                        // this.addEditUpdate(this.editedItem as MultiColumnItem);
                        // this.buttonsUpdate();
                    }
                }
            }

            // if (this.selectable) {
            //     this.selectedItem = this.editedItem;
            //     this.selectedItem.selected = true;
            // }

            // this.editedItem = null!;
            // this.editableValue = null!;

            // But if the item is empty
        } else {

            // If we pressed the (Escape) key or the item was (Blurred)
            if (isEscape || isBlur) {

                // Reset the item back to the way it was before the edit
                this.editableValue.htmlValue!.nativeElement.textContent = this.editableValue.name!;

                // if (this.selectable) {
                //     this.selectedItem = this.editedItem;
                //     this.selectedItem.selected = true;
                // }

                // // Reset
                // this.editedItem = null!;
                // this.editableValue = null!;
            }
        }




        this.addEditUpdate(this.editedItem as MultiColumnItem);

        this.reselectItem();

        this.setButtonsState();
    }


    reselectItem() {
        this.newItem = false;
        if (this.selectable) {
            this.selectedItem = this.editedItem;
            this.selectedItem.selected = true;
        }
        this.editedItem = null!;
        this.editableValue = null!;
    }


    resetItemTextContent() {
        this.editableValue.htmlValue!.nativeElement.textContent = this.editableValue.name!;
    }

    addEditUpdate(multiColumnItem: MultiColumnItem) {
        this.onListUpdate.next(
            {
                type: this.newItem ? ListUpdateType.Add : ListUpdateType.Edit,
                id: multiColumnItem.id,
                index: this.sourceList.findIndex(x => x.identity == multiColumnItem?.identity),
                name: multiColumnItem.name,
                values: multiColumnItem.values
            }
        );
    }


    verifyAddEditUpdate(multiColumnItem: MultiColumnItem, name: string) {
        this.onListUpdate.next(
            {
                type: ListUpdateType.VerifyAddEdit,
                id: multiColumnItem.id,
                index: this.sourceList.findIndex(x => x.identity == multiColumnItem?.identity),
                name: name,
                values: multiColumnItem.values
            }
        );
    }

    selectedItemsUpdate(rightClick: boolean) {
        const selectedItems = this.sourceList.filter(x => x.selected == true);
        this.onListUpdate.next({ type: ListUpdateType.SelectedItems, selectedMultiColumnItems: selectedItems, rightClick: rightClick });
    }



    deletePromptUpdate(deletedItems: Array<MultiColumnItem>) {
        this.onListUpdate.next(
            {
                type: ListUpdateType.DeletePrompt,
                deletedMultiColumnItems: deletedItems!.map((x) => {
                    return {
                        id: x.id,
                        index: this.sourceList.findIndex(y => y.identity == x?.identity),
                        name: x.name,
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
                        index: this.sourceList.findIndex(y => y.identity == x?.identity),
                        name: x.name,
                        values: x.values
                    }
                })
            });
    }
}