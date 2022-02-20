import { ElementRef } from "@angular/core";
import { ItemComponent } from "../components/items/item/item.component";
import { ItemSelectType } from "./enums";
import { ListItem } from "./list-item";
import { ListOptions } from "./list-options";

export class List {
  public instanceId: any;
  public itemComponents: Array<ItemComponent> = new Array<ItemComponent>();
  public htmlItems: Array<ElementRef<HTMLElement>> = new Array<ElementRef<HTMLElement>>();
  public selectedItem!: ItemComponent;
  public unselectedItem!: ItemComponent;
  public editableItem!: ItemComponent;
  public currentFocusedItem!: Element;
  public pivotItem!: ItemComponent;
  public shiftKeyDown!: boolean;
  public ctrlKeyDown!: boolean;
  public eventListenersAdded!: boolean;
  public itemDeletionPending!: boolean
  public preventUnselectionFromRightMousedown!: boolean;
  public newItem!: boolean;
  public options!: ListOptions;
  public preventUnselect!: boolean;


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
    if (e.key === 'Delete') this.deleteItem(); // thisOptions.onDeleteItem.apply(thisOptions.currentObj);
    if (e.key === 'Escape') this.escape();
    if (e.key === 'ArrowUp') this.arrowUp();
    if (e.key === 'ArrowDown') this.arrowDown();

    if (this.options.isEditable) {
      if (e.key === 'Enter') this.enter(e);
    }


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
      this.evaluateEdit(this.editableItem);

      // If a list item is NOT being edited
    } else {

      // Then remove all listeners and selections
      this.removeEventListeners();
    }
  }


  setItemFocus(item: ItemComponent) {
    window.setTimeout(() => {
      const itemIndex = this.itemComponents.indexOf(item);

      // Set focus to the html item with the specified index
      this.htmlItems[itemIndex].nativeElement.focus();


      if (item == this.editableItem) {
        let range = document.createRange();
        range.selectNodeContents(this.htmlItems[itemIndex].nativeElement);
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


  onItemBlur(item: ItemComponent) {
    window.setTimeout(() => {
      // As long as a list item isn't losing focus becaus another list item is receiving focus
      if (document.activeElement != this.currentFocusedItem
        // and the context menu is NOT open
        // && !this.menuService.menu.isVisible
        // // and the search popup is NOT open
        // && !this.popupService.searchPopup.show
        // // and we're NOT clicking on an icon button
        && !this.preventUnselect
      ) {
        // Determine what happens when a list item loses focus 
        this.setItemBlur(item);
      }
    })
  }


  setItemBlur(item: ItemComponent) {
    // If an item is being edited or added
    if (this.editableItem != null) {

      // Evaluate the state of the edit and then act accordingly
      this.evaluateEdit(item, null!, true);

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


  onItemMousedown(item: ItemComponent, e?: MouseEvent) {
    // Initialize
    this.preventUnselectionFromRightMousedown = false;

    // If this item is being selected from a right mouse down
    if (e != null && e.button == 2) {

      // Check to see if this item is already selected
      if (item.selected) {
        // And as long as that selected item is not the current focused item
        if (this.currentFocusedItem != document.activeElement) {
          // Prevent it from being unselected
          this.preventUnselectionFromRightMousedown = true;
        }
      }
    }

    // As long as we're not right clicking on an item that's already selected
    if (!this.preventUnselectionFromRightMousedown) {
      window.setTimeout(() => {
        this.currentFocusedItem = document.activeElement!;
        this.setItemSelection(item);
      });
    }
  }


  setItemSelection(item: ItemComponent) {
    // If an item is NOT being edited
    if (this.editableItem == null) {

      this.addEventListeners();
      this.selectedItem = item;
      this.unselectedItem = null!;
      // Define what items are selected
      this.setSelectedItems(item);
      // Then define what the selection type is for each item
      this.setItemsSelectType();

      // If an item is being edited and an item that is NOT being edited is selected
    } else if (item != this.editableItem) {

      const indexOfEditedItem = this.itemComponents.indexOf(this.editableItem);
      const htmlEditedItem = this.htmlItems[indexOfEditedItem].nativeElement;
      const trimmedEditedItem = htmlEditedItem.textContent?.trim();

      // If the edited item has text written in it
      if (trimmedEditedItem!.length > 0) {

        // As long as the edited name is different from what it was before the edit
        if (trimmedEditedItem != this.itemComponents[indexOfEditedItem].item.name) {

          // Update the name property
          this.itemComponents[indexOfEditedItem].item.name = trimmedEditedItem!;
        }

        // But if the item is empty
      } else {

        // If we were adding a new item
        if (this.newItem) {

          // Remove the edited item from the itemComponents array
          this.itemComponents.splice(indexOfEditedItem, 1);
          // Remove the actual Item component from the DOM
          htmlEditedItem.parentElement?.remove();
          // Remove the edited item from htmlItems array
          this.htmlItems.splice(indexOfEditedItem, 1);

          // If we were NOT adding a new item
        } else {

          // Reset the item back to the way it was before the edit
          htmlEditedItem.textContent = this.itemComponents[indexOfEditedItem].item.name;
        }
      }

      this.itemComponents[indexOfEditedItem].selected = false;
      this.itemComponents[indexOfEditedItem].selectType = null;
      this.selectedItem = item;
      this.newItem = false;
      this.editableItem = null!;
      this.pivotItem = this.selectedItem;
      this.selectedItem.selected = true;
    }
  }


  setSelectedItems(item: ItemComponent) {
    // If the shift key is down
    if (this.shiftKeyDown) {
      this.setSelectedItemsShiftKey();

      // If the ctrl key is down 
    } else if (this.ctrlKeyDown) {
      this.setSelectedItemsCtrlKey(item);

      // If NO modifier key is down
    } else {
      this.setSelectedItemsNoModifierKey(item);
    }
  }


  setItemsSelectType() {
    // If there is only one item in the list
    if (this.itemComponents.length == 1) {
      // Set the type to all
      this.itemComponents[0].selectType = ItemSelectType.All;

      // If there is more than one item
    } else {

      // First item
      this.itemComponents[0].selectType = this.itemComponents[0].selected ? this.itemComponents[1].selected ? ItemSelectType.Top : this.itemComponents[1] == this.unselectedItem ? ItemSelectType.Top : ItemSelectType.All : null;


      // Every item in between
      for (let i = 1; i < this.itemComponents.length - 1; i++) {
        // Set the select type based on the following:
        this.itemComponents[i].selectType =

          // If an item is marked as selected
          this.itemComponents[i].selected ?

            // If the item before is NOT selected and the item after IS selected
            !this.itemComponents[i - 1].selected && this.itemComponents[i + 1].selected ?
              ItemSelectType.Top :

              // If the item before IS selected and the item after is NOT selected
              this.itemComponents[i - 1].selected && !this.itemComponents[i + 1].selected ?

                // And that item after is unselected with the unselect
                this.itemComponents[i + 1] == this.unselectedItem ?
                  ItemSelectType.Middle :

                  // But if its just NOT selected
                  ItemSelectType.Bottom :

                // If the item before is NOT selected and the item after is also NOT selected
                !this.itemComponents[i - 1].selected && !this.itemComponents[i + 1].selected ?

                  // And that item after is unselected with the unselect
                  this.itemComponents[i + 1] == this.unselectedItem ?
                    ItemSelectType.Top :

                    // But if its just NOT selected
                    ItemSelectType.All :

                  // If the item before IS selected and the item after is also selected
                  ItemSelectType.Middle :

            // If an item is NOT selected
            null;
      }

      // Last item
      this.itemComponents[this.itemComponents.length - 1].selectType = this.itemComponents[this.itemComponents.length - 1].selected ? this.itemComponents[this.itemComponents.length - 2].selected ? ItemSelectType.Bottom : ItemSelectType.All : null;
    }
  }


  setSelectedItemsShiftKey() {
    // Clear the selection for all items
    this.itemComponents.forEach(x => x.selected = false);

    const pivotItemIndex = this.itemComponents.indexOf(this.pivotItem);
    const selectedItemIndex = this.itemComponents.indexOf(this.selectedItem);

    if (pivotItemIndex == -1 || selectedItemIndex == -1) return;

    // If the selection is after the pivot
    if (selectedItemIndex > pivotItemIndex) {

      // Select all the items from the pivot down to the selection
      for (let i = pivotItemIndex; i <= selectedItemIndex; i++) {
        this.itemComponents[i].selected = true;
      }

      // If the selection is before the pivot 
    } else {

      // Select all the items from the pivot up to the selection
      for (let i = pivotItemIndex; i >= selectedItemIndex; i--) {
        this.itemComponents[i].selected = true;
      }
    }
  }


  setSelectedItemsCtrlKey(item: ItemComponent) {
    // If the item we are pressing down on is already selected
    if (item.selected) {

      // Set that item as unselected
      item.selected = false;
      this.unselectedItem = item;
      this.selectedItem = null!;

      // If the item we are pressing down on is NOT yet selected
    } else {

      // Select that item
      item.selected = true;
      this.unselectedItem = null!;
      this.selectedItem = item;
    }
    // Define the pivot index
    this.pivotItem = item;
  }


  setSelectedItemsNoModifierKey(item: ItemComponent) {
    // Clear the selection for all items
    this.itemComponents.forEach(x => x.selected = false);
    // Set the selected
    item.selected = true;
    // Define the pivot index
    this.pivotItem = item;
  }


  onItemDoubleClick(item: ItemComponent) {
    // If this list is set as being editable
    if (this.options.isEditable &&
      // And the shiftkey and the ctrlkey is NOT down
      !this.shiftKeyDown && !this.ctrlKeyDown &&
      // And no item in the list is currently being edited
      !this.editableItem) {


      this.editableItem = item;

      this.setItemFocus(this.editableItem);
    }
  }


  removeFocus() {
    this.pivotItem = null!;
    this.selectedItem = null!;
    this.unselectedItem = null!;
    this.editableItem = null!;

    this.itemComponents.forEach(x => {
      x.selected = false;
      x.selectType = null;
    })
  }





  addItem(index: number) {
    this.addEventListeners();

    this.itemComponents.forEach(x => {
      if (x.selected) x.selected = false;
      if (x.selectType) x.SelectType = null!;
    })


    window.setTimeout(() => {
      if (this.options.isEditable) {
        this.newItem = true;
        this.selectedItem = null!;
        this.unselectedItem = null!;
        this.editableItem = this.itemComponents[index];;
        this.setItemFocus(this.editableItem);

      } else {

        this.editableItem = null!;
        this.unselectedItem = null!;
        this.selectedItem = this.itemComponents[index];
        this.setItemFocus(this.selectedItem);
      }
    });

  }





  editItem() {
    this.editableItem = this.selectedItem;
    this.selectedItem = null!;

    this.itemComponents.forEach(x => {
      if (x.selected) x.selected = false;
      if (x.selectType) x.SelectType = null!;
    })
    this.setItemFocus(this.editableItem);
  }





  deleteItem() {
    let itemCopy!: ItemComponent;
    let deletedItem: ItemComponent;
    let deletedItems: Array<ItemComponent> = [];

    this.itemDeletionPending = true;

    // If an item is selected
    if (this.selectedItem != null) {
      const selectedItemIndex = this.itemComponents.indexOf(this.selectedItem);

      // Loop through the list of items starting with the selected item
      for (let i = selectedItemIndex + 1; i < this.itemComponents.length; i++) {
        // If we come across an item that is NOT selected
        if (!this.itemComponents[i].selected) {
          // Make a copy of that item so that it can be used as the newly selected item when all the other items are deleted
          itemCopy = this.itemComponents[i];
          break;
        }
      }
    }

    // But if an item is unselected
    if (this.unselectedItem != null) {
      // Make a copy of that item so it can remain as the unselected item when all the other items are deleted
      itemCopy = this.unselectedItem;
    }



    deletedItems = this.itemComponents.filter(x => x.selected);

    let trumpy = deletedItems.map((x) => {
      return { id: x.item.id, name: x.item.name }
    })


    let alita: ListUpdate = {
      add: null!,
      edit: null!,
      delete: trumpy,
      preventUnselect: null!
    }

    this.itemComponents[0].onListUpdate.emit(alita);

    


    


    // Now delete all the selected items
    do {
      // Find an item in the list that is marked as selected
      deletedItem = this.itemComponents.find(x => x.selected)!;
      // As long as an item that is marked as selected is found
      if (deletedItem != null) {
        // Make a copy of all the items we're deleting so that the database can be updated accordingly
        deletedItems.push(deletedItem);

        // Clear the selection properties
        // (In case the item is still being referenced i.e. in media List where a media item gets moved)
        deletedItem.selected = false;
        deletedItem.selectType = null;

    // Remove the following:
    const deletedItemIndex = this.itemComponents.indexOf(deletedItem);

    // Remove the deleted item from the itemComponents array
    this.itemComponents.splice(deletedItemIndex, 1);
    // Remove the actual Item component from the DOM
    this.htmlItems[deletedItemIndex].nativeElement.parentElement?.remove();
    // Remove the deleted item from htmlItems array
    this.htmlItems.splice(deletedItemIndex, 1);
      }
    }
    // Loop until all the items marked as selected are deleted
    while (deletedItem != null);


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
          // Allow the selected item to be edited
          // this.editIcon.isDisabled = false;
          // Set focus to that selected list item
          this.setItemFocus(this.selectedItem);
        }, 20);

        // If there is NOT a next available list item that can be selected
      } else {
        // Make no list item marked as selected
        this.selectedItem = null!;
        // this.deleteIcon.isDisabled = true;
        this.pivotItem = null!;
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




  escape() {
    // If an item is being edited
    if (this.editableItem != null) {
      // Evaluate the state of the edit and then act accordingly
      this.evaluateEdit(this.editableItem, true);

      // If an item is NOT being edited
    } else {

      // Then remove all listeners and selections
      this.removeEventListeners();
    }
  }


  arrowUp() {
    let index: number = this.selectedItem != null ? this.itemComponents.indexOf(this.selectedItem) : this.itemComponents.indexOf(this.unselectedItem);

    if (index > 0) {
      index--;
      this.onItemMousedown(this.itemComponents[index]);
    }
  }


  arrowDown() {
    let index: number = this.selectedItem != null ? this.itemComponents.indexOf(this.selectedItem) : this.itemComponents.indexOf(this.unselectedItem);

    if (index < this.itemComponents.length - 1) {
      index++;
      this.onItemMousedown(this.itemComponents[index]);
    }
  }


  enter(e: KeyboardEvent) {
    e.preventDefault();

    // If an item is being edited
    if (this.editableItem) {

      // Evaluate the state of the edit and then act accordingly
      this.evaluateEdit(this.editableItem);
    }
  }


  evaluateEdit(item: ItemComponent, isEscape?: boolean, isBlur?: boolean) {
    const indexOfEditedItem = this.itemComponents.indexOf(this.editableItem);
    const htmlEditedItem = this.htmlItems[indexOfEditedItem].nativeElement;
    const trimmedEditedItem = htmlEditedItem.textContent?.trim();

    // Set the focus to the edited item just in case it lost it on a mouse down
    htmlEditedItem.focus();

    // If the edited item has text written in it
    if (trimmedEditedItem!.length > 0) {

      // If we pressed the (Escape) key
      if (isEscape) {

        // If we were adding a new item
        if (this.newItem) {

          // Remove the edited item from the itemComponents array
          this.itemComponents.splice(indexOfEditedItem, 1);
          // Remove the actual Item component from the DOM
          htmlEditedItem.parentElement?.remove();
          // Remove the edited item from htmlItems array
          this.htmlItems.splice(indexOfEditedItem, 1);

          // If we were NOT adding a new list item
        } else {

          // As long as the edited name is different from what it was before the edit
          if (trimmedEditedItem != this.itemComponents[indexOfEditedItem].item.name) {

            // Reset the item back to the way it was before the edit
            htmlEditedItem.textContent = this.itemComponents[indexOfEditedItem].item.name;
          }
        }

        // If we did NOT press the (Escape) key
        // But the (Enter) key was pressed or the list item was (Blurred)
      } else {

        // As long as the edited name is different from what it was before the edit
        if (trimmedEditedItem != this.itemComponents[indexOfEditedItem].item.name) {

          // Update the name property
          this.itemComponents[indexOfEditedItem].item.name = trimmedEditedItem!;
        }
      }

      // Reset
      this.selectedItem = this.editableItem;
      this.newItem = false;
      this.editableItem = null!;
      this.pivotItem = this.selectedItem;
      item.selected = true;

      // But if the item is empty
    } else {


      // If we pressed the (Escape) key or the item was (Blurred)
      if (isEscape || isBlur) {

        // If we were adding a new item
        if (this.newItem) {

          // Remove the edited item from the itemComponents array
          this.itemComponents.splice(indexOfEditedItem, 1);
          // Remove the actual Item component from the DOM
          htmlEditedItem.parentElement?.remove();
          // Remove the edited item from htmlItems array
          this.htmlItems.splice(indexOfEditedItem, 1);

          // If we were NOT adding a new list item
        } else {

          // Reset the item back to the way it was before the edit
          htmlEditedItem.textContent = this.itemComponents[indexOfEditedItem].item.name;
        }

        // Reset
        this.selectedItem = this.editableItem;
        this.newItem = false;
        this.editableItem = null!;
        this.pivotItem = this.selectedItem;
        item.selected = true;
      }
    }
  }
}


export class ListUpdate {
  public add!: Array<ListItem>;
  public edit!: Array<ListItem>;
  public delete!: Array<ListItem>;
  public preventUnselect!: boolean;
}