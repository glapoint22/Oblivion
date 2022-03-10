import { QueryList } from "@angular/core";
import { Subject } from "rxjs";
import { ListItemComponent } from "../components/items/list-item/list-item.component";
import { ItemSelectType, ListUpdateType } from "./enums";
import { ListItem } from "./list-item";
import { ListOptions } from "./list-options";
import { ListUpdate } from "./list-update";

export class ListManager {
  sourceList!: Array<ListItem>;
  selectedItem!: ListItem;
  unselectedItem!: ListItem;
  editableItem!: ListItem;
  currentFocusedItem!: Element;
  pivotItem!: ListItem;
  shiftKeyDown!: boolean;
  ctrlKeyDown!: boolean;
  eventListenersAdded!: boolean;
  itemDeletionPending!: boolean
  preventUnselectionFromRightMousedown!: boolean;
  newItem!: boolean;
  options!: ListOptions;
  overButton!: boolean;
  SelectType = ItemSelectType;
  onListUpdate = new Subject<ListUpdate>();


  getItem(itemComponent: ListItemComponent): ListItem {
    const listItem: ListItem = this.sourceList.find(x => x.id == itemComponent.id)!;
    return listItem;
  }


  addEventListeners() {
    if (!this.eventListenersAdded) {
      this.eventListenersAdded = true;
      window.addEventListener('keyup', this.onKeyUp);
      window.addEventListener('keydown', this.onKeyDown);
      // window.addEventListener('mousedown', this.onMouseDown); // For context menu
      window.addEventListener('blur', this.onInnerWindowBlur);
    }
  }


  removeEventListeners() {
    this.removeFocus();
    this.eventListenersAdded = false;
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('keydown', this.onKeyDown);
    // window.removeEventListener('mousedown', this.onMouseDown); // For context menu
    window.removeEventListener('blur', this.onInnerWindowBlur);
  }


  onKeyDown = (e: KeyboardEvent) => {
    this.keydown(e);
  }


  keydown(e: KeyboardEvent) {
    if (e.key === 'Delete') this.setDeleteItem(); // thisOptions.onDeleteItem.apply(thisOptions.currentObj);
    if (e.key === 'Escape') this.escape();
    if (e.key === 'ArrowUp') this.arrowUp();
    if (e.key === 'ArrowDown') this.arrowDown();

    // if (thisOptions == null || thisOptions.multiSelect == null || thisOptions.multiSelect) {
    if (e.key === 'Control') this.ctrlKeyDown = true;
    if (e.key === 'Shift') this.shiftKeyDown = true;
    // }

    // ****** Add shortcut key functionality here i.e ctrl + e ******
  }




  onKeyUp = (e: KeyboardEvent) => {
    if (e.key === 'Control') this.ctrlKeyDown = false;
    if (e.key === 'Shift') this.shiftKeyDown = false;
  }


  onInnerWindowBlur = () => {
    // * When the focus gets set to something that is outside the inner-window * \\

    // If a list item is being edited or added
    if (this.editableItem != null) {
      // Evaluate the state of the edit and then act accordingly
      this.evaluateEdit();

      // If a list item is NOT being edited
    } else {

      // Then remove all listeners and selections
      this.removeEventListeners();
    }
  }


  setItemFocus(listItem: ListItem) {
    window.setTimeout(() => {

      // Set focus to the html item with the specified index
      if (listItem) listItem.htmlItem!.nativeElement.focus();

      if (listItem && listItem == this.editableItem) {
        let range = document.createRange();
        range.selectNodeContents(listItem.htmlItem!.nativeElement!);
        let sel = window.getSelection();
        sel!.removeAllRanges();
        sel!.addRange(range);
      }


      // Then set that item as the current focused item
      this.currentFocusedItem = document.activeElement!;
      // Clear
      this.preventUnselectionFromRightMousedown = false;
      this.itemDeletionPending = false;
    })
  }


  onItemBlur(listItem: ListItem) {
    window.setTimeout(() => {

      // As long as a list item isn't losing focus becaus another list item is receiving focus
      if (document.activeElement != this.currentFocusedItem
        // and the context menu is NOT open
        // && !this.menuService.menu.isVisible
        // // and the search popup is NOT open
        // && !this.popupService.searchPopup.show
        // // and we're NOT clicking on an icon button
        && !this.overButton) {

        // If an item is being edited or added
        if (this.editableItem != null) {
          // Evaluate the state of the edit and then act accordingly
          this.evaluateEdit(null!, true);

          // If an item is NOT being edited
        } else {
          // When a list item is deleted, it loses focus.
          // This is to prevent the listeners from being removed when a list item gets deleted.
          if (!this.itemDeletionPending
            // Also, if a list item loses focus because of a right mouse down event, we don't want
            // to clear the selections and remove the event listeners
            && !this.preventUnselectionFromRightMousedown) {
            // If a list item is NOT being deleted and there is no right mouse down event on a list item,
            // then remove all listeners and selections
            this.removeEventListeners();
          }
          // If a right mouse down event prevented the selections and listeners from being removed,
          // then we can reset this back to false, because it alreday served its purpose
          this.preventUnselectionFromRightMousedown = false;

          // And if item(s) have been deleted,
          // let it be known that item deletion is no longer pending
          this.itemDeletionPending = false;
        }


      }

      // But if we are clicking on an icon button and an item is in edit mode
      if (this.overButton) {
        // Send the focus right back to the item that is in edit mode
        this.setItemFocus(listItem)
      }




      window.setTimeout(() => {
        if (this.editableItem == null) {
          const itemSelectedCount = this.sourceList.filter(x => x.selected == true).length;
          if (itemSelectedCount == 0) this.onListUpdate.next({ addDisabled: false, editDisabled: true, deleteDisabled: true });
          if (itemSelectedCount == 1) this.onListUpdate.next({ addDisabled: false, editDisabled: false, deleteDisabled: false });
        }
      }, 30)


    })
  }


  onItemComponentMousedown(listItem: ListItem, e?: MouseEvent) {

    // Initialize
    this.preventUnselectionFromRightMousedown = false;

    // If this item is being selected from a right mouse down
    if (e != null && e.button == 2) {

      // Check to see if this item is already selected
      if (listItem.selected) {

        // And as long as that selected item is not the current focused item
        if (listItem.htmlItem?.nativeElement != document.activeElement) {

          // Prevent it from being unselected
          this.preventUnselectionFromRightMousedown = true;
        }
      }
    }

    // As long as we're not right clicking on an item that's already selected
    if (!this.preventUnselectionFromRightMousedown) {
      window.setTimeout(() => {
        this.currentFocusedItem = document.activeElement!;
        this.setItemSelection(listItem);
      });
    }
  }




  setItemSelection(listItem: ListItem) {
    // If an item is NOT being edited
    if (this.editableItem == null) {

      this.addEventListeners();
      this.selectedItem = listItem;
      this.unselectedItem = null!;
      // Define what items are selected
      this.setSelectedItems(listItem);
      // Then define what the selection type is for each item
      this.setItemsSelectType();

      // If an item is being edited and another item that is NOT being edited is selected
    } else if (listItem != this.editableItem) {

      const htmlEditedItem = this.editableItem.htmlItem!.nativeElement;
      const trimmedEditedItem = htmlEditedItem.textContent?.trim();

      // If the edited item has text written in it
      if (trimmedEditedItem!.length > 0) {

        // As long as the edited name is different from what it was before the edit
        if (trimmedEditedItem != this.editableItem.name) {

          // Update the name property
          this.editableItem.name = trimmedEditedItem!;

          // Update the list
          this.updateList(null!, this.editableItem);
        }

        // But if the item is empty
      } else {

        // If we were adding a new item
        if (this.newItem) {

          // Remove the item
          this.sourceList.splice(this.sourceList.indexOf(this.editableItem), 1);

          // If we were NOT adding a new item
        } else {

          // Reset the item back to the way it was before the edit
          htmlEditedItem.textContent = this.editableItem.name!;
        }
      }

      this.editableItem.selected = false;
      this.editableItem.selectType = null!;
      this.selectedItem = listItem;
      this.newItem = false;
      this.editableItem = null!;
      this.pivotItem = this.selectedItem;
      this.selectedItem.selected = true;
    }
  }


  setSelectedItems(listItem: ListItem) {
    // If the shift key is down
    if (this.shiftKeyDown) {
      this.setSelectedItemsShiftKey();

      // If the ctrl key is down 
    } else if (this.ctrlKeyDown) {
      this.setSelectedItemsCtrlKey(listItem);

      // If NO modifier key is down
    } else {
      this.setSelectedItemsNoModifierKey(listItem);
    }

    const itemSelectedCount = this.sourceList.filter(x => x.selected == true).length;

    if (itemSelectedCount > 1) {
      this.onListUpdate.next({ addDisabled: false, editDisabled: true, deleteDisabled: false });
    } else {

      if (this.unselectedItem) {
        this.onListUpdate.next({ addDisabled: false, editDisabled: true, deleteDisabled: true });
      } else {
        this.onListUpdate.next({ addDisabled: false, editDisabled: false, deleteDisabled: false });
      }
    }
  }


  setItemsSelectType() {
    // If there is only one item in the list
    if (this.sourceList.length == 1) {
      // Set the type to all
      this.sourceList[0].selectType = ItemSelectType.All;

      // If there is more than one item
    } else {

      // First item
      this.sourceList[0].selectType = this.sourceList[0].selected ? this.sourceList[1].selected ? ItemSelectType.Top : this.sourceList[1] == this.unselectedItem ? ItemSelectType.Top : ItemSelectType.All : null!;


      // Every item in between
      for (let i = 1; i < this.sourceList.length - 1; i++) {
        // Set the select type based on the following:
        this.sourceList[i].selectType =

          // If an item is marked as selected
          this.sourceList[i].selected ?

            // If the item before is NOT selected and the item after IS selected
            !this.sourceList[i - 1].selected && this.sourceList[i + 1].selected ?
              ItemSelectType.Top :

              // If the item before IS selected and the item after is NOT selected
              this.sourceList[i - 1].selected && !this.sourceList[i + 1].selected ?

                // And that item after is unselected with the unselect
                this.sourceList[i + 1] == this.unselectedItem ?
                  ItemSelectType.Middle :

                  // But if its just NOT selected
                  ItemSelectType.Bottom :

                // If the item before is NOT selected and the item after is also NOT selected
                !this.sourceList[i - 1].selected && !this.sourceList[i + 1].selected ?

                  // And that item after is unselected with the unselect
                  this.sourceList[i + 1] == this.unselectedItem ?
                    ItemSelectType.Top :

                    // But if its just NOT selected
                    ItemSelectType.All :

                  // If the item before IS selected and the item after is also selected
                  ItemSelectType.Middle :

            // If an item is NOT selected
            null!;
      }

      // Last item
      this.sourceList[this.sourceList.length - 1].selectType = this.sourceList[this.sourceList.length - 1].selected ? this.sourceList[this.sourceList.length - 2].selected ? ItemSelectType.Bottom : ItemSelectType.All : null!;
    }
  }


  setSelectedItemsShiftKey() {
    // Clear the selection for all items
    this.sourceList.forEach(x => x.selected = false);


    const pivotItemIndex = this.sourceList.indexOf(this.pivotItem);
    const selectedItemIndex = this.sourceList.indexOf(this.selectedItem);

    if (pivotItemIndex == -1 || selectedItemIndex == -1) return;

    // If the selection is after the pivot
    if (selectedItemIndex > pivotItemIndex) {

      // Select all the items from the pivot down to the selection
      for (let i = pivotItemIndex; i <= selectedItemIndex; i++) {
        this.sourceList[i].selected = true;
      }

      // If the selection is before the pivot 
    } else {

      // Select all the items from the pivot up to the selection
      for (let i = pivotItemIndex; i >= selectedItemIndex; i--) {
        this.sourceList[i].selected = true;
      }
    }
  }


  setSelectedItemsCtrlKey(listItem: ListItem) {
    // If the item we are pressing down on is already selected
    if (listItem.selected) {

      // Set that item as unselected
      listItem.selected = false;
      this.unselectedItem = listItem;
      this.selectedItem = null!;

      // If the item we are pressing down on is NOT yet selected
    } else {

      // Select that item
      listItem.selected = true;
      this.unselectedItem = null!;
      this.selectedItem = listItem;
    }
    // Define the pivot item
    this.pivotItem = listItem;
  }


  setSelectedItemsNoModifierKey(listItem: ListItem) {
    // Clear the selection for all items
    this.sourceList.forEach(x => x.selected = false);
    // Set the selected
    listItem.selected = true;
    // Define the pivot item
    this.pivotItem = listItem;

    this.onListUpdate.next({ type: ListUpdateType.SelectedItem, id: listItem.id, index: this.sourceList.findIndex(x => x.id == listItem?.id), name: listItem.name });
  }



  removeFocus() {
    this.pivotItem = null!;
    this.selectedItem = null!;
    this.unselectedItem = null!;
    this.editableItem = null!;

    this.sourceList.forEach(x => {
      x.selected = false;
      x.selectType = null!;
    })
  }







  setAddItem(listItem: ListItem) {
    this.addEventListeners();

    this.sourceList.forEach(x => {
      x.selected = false;
      x.selectType = null!;
    })


    window.setTimeout(() => {
      this.selectItem(listItem);
    });
  }



  selectItem(listItem: ListItem) {
    window.setTimeout(() => {
      listItem.selected = true;
      this.selectedItem = listItem;
      this.editableItem = null!;
      this.unselectedItem = null!;
      this.setItemFocus(this.selectedItem);
    })
  }


  setDeleteItem() {
    // If an item is selected or unselected
    if (this.selectedItem || this.unselectedItem) {
      let itemCopy!: ListItem;
      let deletedItems: Array<ListItem> = new Array<ListItem>();

      this.itemDeletionPending = true;


      const selectedItemIndex = this.sourceList.indexOf(this.selectedItem);

      // Loop through the list of items starting with the selected item
      for (let i = selectedItemIndex + 1; i < this.sourceList.length; i++) {
        // If we come across an item that is NOT selected
        if (!this.sourceList[i].selected) {
          // Make a copy of that item so that it can be used as the newly selected item when all the other items are deleted
          itemCopy = this.sourceList[i];
          break;
        }
      }

      //If an item is unselected
      if (this.unselectedItem != null) {
        // Make a copy of that item so it can remain as the unselected item when all the other items are deleted
        itemCopy = this.unselectedItem;
      }

      // Gather all the selected items
      let selectedItems = this.sourceList.filter(x => x.selected);

      // Update the list
      this.updateList(selectedItems, null!);

      // Loop through all the selected items
      selectedItems.forEach(x => {
        // Update the deleted items list with every item in the source list that has the same index as an item in the selected list
        deletedItems.push(this.sourceList[this.sourceList.indexOf(x)]);
      })

      // Loop through all the deleted items
      deletedItems.forEach(() => {
        // Get the index of the source list item that matches the item in the deleted list
        let deletedItemIndex = this.sourceList.findIndex(a => deletedItems.find(b => a == b));
        // Delete that source list item
        this.sourceList.splice(deletedItemIndex, 1);
      })



      // If an item was selected
      if (this.selectedItem != null) {
        // And there is a next available list item that can be selected
        if (itemCopy != null) {
          window.setTimeout(() => {
            // Select that list item
            this.selectedItem = itemCopy;
            this.selectedItem.selected = true;
            // Re-establish the pivot index
            this.pivotItem = this.selectedItem;
            // Set focus to that selected list item
            this.setItemFocus(this.selectedItem);
          }, 20);

          // If there is NOT a next available list item that can be selected
        } else {
          // Make no list item marked as selected
          this.selectedItem = null!;
          // this.deleteIcon.isDisabled = true;
          this.pivotItem = null!;
          this.overButton = false;
          this.removeEventListeners();
        }
      }

      // If a list item was unselected
      if (this.unselectedItem != null) {
        window.setTimeout(() => {
          // Unselect that list item again
          this.unselectedItem = itemCopy;
          // this.deleteIcon.isDisabled = true;
          // Re-establish the pivot index
          this.pivotItem = this.unselectedItem;
          // Set focus to that unselected list item
          this.setItemFocus(this.unselectedItem);
        }, 20);
      }
    }
  }




  escape() {
    // If an item is being edited
    if (this.editableItem != null) {
      // Evaluate the state of the edit and then act accordingly
      this.evaluateEdit(true);

      // If an item is NOT being edited
    } else {

      // Then remove all listeners and selections
      this.removeEventListeners();
    }

    const itemSelectedCount = this.sourceList.filter(x => x.selected == true).length;
    if (itemSelectedCount == 0) this.onListUpdate.next({ addDisabled: false, editDisabled: true, deleteDisabled: true });
    if (itemSelectedCount == 1) this.onListUpdate.next({ addDisabled: false, editDisabled: false, deleteDisabled: false });
  }


  arrowUp() {
    let index: number = this.selectedItem != null ? this.sourceList.indexOf(this.selectedItem) : this.sourceList.indexOf(this.unselectedItem);

    if (index > 0) {
      index--;
      this.onItemComponentMousedown(this.sourceList[index]);
    }
  }


  arrowDown() {
    let index: number = this.selectedItem != null ? this.sourceList.indexOf(this.selectedItem) : this.sourceList.indexOf(this.unselectedItem);

    if (index < this.sourceList.length - 1) {
      index++;
      this.onItemComponentMousedown(this.sourceList[index]);
    }
  }


  enter(e: KeyboardEvent) {
    e.preventDefault();

    // If an item is being edited
    if (this.editableItem) {

      // Evaluate the state of the edit and then act accordingly
      this.evaluateEdit();
    }
  }




  evaluateEdit(isEscape?: boolean, isBlur?: boolean) {
    const htmlEditedItem = this.editableItem.htmlItem!.nativeElement;
    const trimmedEditedItem = htmlEditedItem.textContent?.trim();

    // Set the focus to the edited item just in case it lost it on a mouse down
    htmlEditedItem.focus();

    // If the edited item has text written in it
    if (trimmedEditedItem!.length > 0) {

      // If we pressed the (Escape) key
      if (isEscape) {

        // If we were adding a new item
        if (this.newItem) {

          // Remove the item
          this.sourceList.splice(this.sourceList.indexOf(this.editableItem), 1);

          // If we were NOT adding a new item
        } else {

          // As long as the edited name is different from what it was before the edit
          if (trimmedEditedItem != this.editableItem.name) {

            // Reset the item back to the way it was before the edit
            htmlEditedItem.textContent = this.editableItem.name!;
          }
          this.selectedItem = this.editableItem;
        }

        // If we did NOT press the (Escape) key
        // But the (Enter) key was pressed or the list item was (Blurred)
      } else {

        // As long as the edited name is different from what it was before the edit
        if (trimmedEditedItem != this.editableItem.name) {
          // Update the name property
          this.editableItem.name = trimmedEditedItem!;
          this.updateList(null!, this.editableItem);
        }
      }
      this.newItem = false;
      this.selectedItem = this.editableItem;
      this.selectedItem.selected = true;
      this.editableItem = null!;

      // But if the item is empty
    } else {

      // If we pressed the (Escape) key or the item was (Blurred)
      if (isEscape || isBlur) {

        // If we were adding a new item
        if (this.newItem) {

          // Remove the item
          this.sourceList.splice(this.sourceList.indexOf(this.editableItem), 1);


          // If we were NOT adding a new list item
        } else {

          // Reset the item back to the way it was before the edit
          htmlEditedItem.textContent = this.editableItem.name;

          this.selectedItem = this.editableItem;
        }

        // Reset
        this.newItem = false;
        this.editableItem = null!;
      }
    }
  }


  sort(listItem?: ListItem) {
    this.sourceList.sort((a, b) => (a.name! > b.name!) ? 1 : -1);
  }


  updateList(deletedItems?: Array<ListItem>, listItem?: ListItem) {
    // If an item is being added or edited
    if (listItem != null) {
      const newItem = this.newItem;

      // Sort the source list
      this.sort(listItem);

      window.setTimeout(() => {
        const listItemIndex = this.sourceList.findIndex(x => x.id == listItem?.id);
        this.selectItem(this.sourceList[listItemIndex]);
        this.onListUpdate.next({ type: newItem ? ListUpdateType.Add : ListUpdateType.Edit, id: listItem.id, index: listItemIndex, name: listItem.name });
      })

      // If items are being deleted
    } else {

      this.onListUpdate.next({ type: ListUpdateType.Delete, deletedItems: deletedItems!.map((x) => { return { id: x.id, name: x.name } }) });
    }
  }
}