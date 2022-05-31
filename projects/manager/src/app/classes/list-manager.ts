import { Subject, Subscription } from "rxjs";
import { ItemSelectType, ListUpdateType } from "./enums";
import { ListItem } from "./list-item";
import { ListOptions } from "./list-options";
import { ListUpdate } from "./list-update";
import { LazyLoadingService, SpinnerAction } from 'common';
import { ContextMenuComponent } from "../components/context-menu/context-menu.component";
import { PromptComponent } from "../components/prompt/prompt.component";
import { Prompt } from "./prompt";

export class ListManager {
  prompt!: PromptComponent;
  sourceList!: Array<ListItem>;
  selectedItem!: ListItem;
  unselectedItem!: ListItem;
  editedItem!: ListItem;
  // currentFocusedItem!: Element;
  pivotItem!: ListItem;
  shiftKeyDown!: boolean;
  ctrlKeyDown!: boolean;
  eventListenersAdded!: boolean;
  // itemDeletionPending!: boolean
  preventUnselectionFromRightMousedown!: boolean;
  newItem!: boolean;
  options!: ListOptions;
  overButton!: boolean;
  overContextMenu!: boolean;
  overItem!: boolean;
  SelectType = ItemSelectType;
  addDisabled: boolean = false;
  editDisabled: boolean = true;
  deleteDisabled: boolean = true;
  editable: boolean = true;
  selectable: boolean = true;
  unselectable: boolean = true;
  deletable: boolean = true;
  multiselectable: boolean = true;
  sortable: boolean = true;
  verifyAddEdit: boolean = false;
  addEditVerificationInProgress!: boolean;
  onListUpdate = new Subject<ListUpdate>();
  contextMenu!: ContextMenuComponent
  contextMenuOpen!: boolean;
  promptOpen!: boolean;
  overContextMenuListener!: Subscription;
  contextMenuOpenListener!: Subscription;
  mouseDownItem!: ListItem;

  constructor(public lazyLoadingService: LazyLoadingService) { }


  addEventListeners() {

    if (!this.eventListenersAdded) {
      this.eventListenersAdded = true;
      window.addEventListener('keyup', this.onKeyUp);
      window.addEventListener('keydown', this.onKeyDown);
      window.addEventListener('blur', this.onInnerWindowBlur);
      window.addEventListener('mousedown', this.onMouseDown);
    }
  }


  removeEventListeners() {
    if (this.unselectable) {

      this.removeFocus();
      this.eventListenersAdded = false;
      this.shiftKeyDown = false;
      this.ctrlKeyDown = false;
      window.removeEventListener('keyup', this.onKeyUp);
      window.removeEventListener('keydown', this.onKeyDown);
      window.removeEventListener('blur', this.onInnerWindowBlur);
      window.removeEventListener('mousedown', this.onMouseDown);
      this.unSelectedItemsUpdate();
    }
  }


  onKeyDown = (e: KeyboardEvent) => {
    this.keydown(e);
  }


  keydown(e: KeyboardEvent) {
    if (e.key === 'Delete') if (this.editedItem == null) this.setDelete();
    if (e.key === 'Escape') this.escape();
    if (e.key === 'Enter') this.enter(e);
    if (e.key === 'ArrowUp') this.arrowUp();
    if (e.key === 'ArrowDown') this.arrowDown();

    if (this.multiselectable) {
      if (e.key === 'Control') this.ctrlKeyDown = true;
      if (e.key === 'Shift') this.shiftKeyDown = true;
    }

    // ****** Add shortcut key functionality here i.e ctrl + e ******
  }




  onKeyUp = (e: KeyboardEvent) => {
    if (e.key === 'Control') this.ctrlKeyDown = false;
    if (e.key === 'Shift') this.shiftKeyDown = false;
  }


  setButtonsState() {
    const itemSelectedCount = this.sourceList.filter(x => x.selected == true).length;

    if (itemSelectedCount == 0) {
      this.addDisabled = false;
      this.editDisabled = true;
      this.deleteDisabled = true;
    }

    if (itemSelectedCount == 1) {
      this.addDisabled = false;
      this.editDisabled = false;
      this.deleteDisabled = false;
    }

    if (itemSelectedCount > 1) {
      this.addDisabled = false;
      this.editDisabled = true;
      this.deleteDisabled = false;
    }
    this.buttonsUpdate();
  }


  onInnerWindowBlur = () => {
    // * When the focus gets set to something that is outside the inner-window * \\

    if (!this.promptOpen) {
      // If a list item is being edited or added
      if (this.editedItem != null) {
        // Evaluate the state of the edit and then act accordingly
        this.evaluateEdit(null!, true);

        // If a list item is NOT being edited
      } else {
        // Then remove all listeners and selections
        this.closeContextMenu();
        this.removeEventListeners();
        this.setButtonsState();
      }
    }
  }


  setItemFocus(listItem: ListItem) {
    // window.setTimeout(() => { //????????????????????????????????????????????????????????????????????????????????????????????????
    // Set focus to the html item of the list item
    if (listItem) listItem.htmlItem!.nativeElement.focus();

    if (listItem && listItem == this.editedItem) {
      let range = document.createRange();
      range.selectNodeContents(listItem.htmlItem!.nativeElement!);
      let sel = window.getSelection();
      sel!.removeAllRanges();
      sel!.addRange(range);
    }


    // Then set that item as the current focused item
    // this.currentFocusedItem = document.activeElement!;
    // Clear
    this.preventUnselectionFromRightMousedown = false;
    // this.itemDeletionPending = false;
    // })
  }



  onMouseDown = () => {
    if (!this.promptOpen) {

      if (!this.overItem && !this.overContextMenu) {
        this.closeContextMenu();
      }

      // As long as we're not over an item or over a button
      if (!this.overItem && !this.overButton && !this.contextMenuOpen) {

        // If an item is being edited or added
        if (this.editedItem != null) {

          // Evaluate the state of the edit and then act accordingly
          this.evaluateEdit(null!, true);

          // If an item is NOT being edited
        } else {

          // Remove all listeners and selections
          this.removeEventListeners();
        }
      }


      // If we're over an item and an item is being edited
      if (this.overItem && this.editedItem != null) {

        // And as long as the item that's being edited is not being moused down
        if (this.mouseDownItem != this.editedItem) {
          // Evaluate the state of the edit and then act accordingly
          this.evaluateEdit(null!, true);
        }
      }

      if (this.editedItem == null) {
        this.setButtonsState();
      }
    }
  }






  onItemDown(listItem: ListItem, e?: MouseEvent) {
    this.mouseDownItem = listItem
    // As long as this item is NOT currently being edited
    if (this.editedItem != listItem) {
      // this.setItemFocus(listItem);
      this.closeContextMenu();

      // Initialize
      this.preventUnselectionFromRightMousedown = false;

      // If this item is being selected from a right mouse down
      if (e != null && e.button == 2) {

        // As long as we're not in edit mode
        if (this.editedItem == null) {

          window.setTimeout(() => {
            // Open the context menu
            this.openContextMenu(e);
          }, 100)
        }


        // Check to see if this item is already selected
        if (listItem.selected) {

          // And as long as that selected item is not the current focused item
          // if (listItem.htmlItem?.nativeElement != document.activeElement) {

          // Prevent it from being unselected
          this.preventUnselectionFromRightMousedown = true;
          // }
        }
      }

      if (this.selectable) {
        // As long as we're not right clicking on an item that's already selected
        if (!this.preventUnselectionFromRightMousedown) {

          // window.setTimeout(() => {//???????????????
          // this.currentFocusedItem = document.activeElement!;
          this.setItemSelection(listItem);
          this.setButtonsState();

          // });
        }

        // As long as we're not in edit mode
        if (this.editedItem == null) {
          this.selectedItemsUpdate(e != null && e.button == 2);
          this.buttonsUpdate();
        }
      }
    }
  }




  setItemSelection(listItem: ListItem) {
    // If an item is NOT being edited
    if (this.editedItem == null) {

      this.addEventListeners();
      this.selectedItem = listItem;
      this.unselectedItem = null!;
      // Define what items are selected
      this.setSelectedItems(listItem);
      // Then define what the selection type is for each item
      this.setItemsSelectType();
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
      if (this.unselectable) {
        listItem.selected = false;
        this.unselectedItem = listItem;
        this.selectedItem = null!;
      }


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
  }


  // selectItem(listItem: ListItem) {
  //   window.setTimeout(() => {
  //     listItem.selected = true;
  //     this.selectedItem = listItem;
  //     this.editedItem = null!;
  //     this.unselectedItem = null!;
  //     // this.setItemFocus(this.selectedItem);
  //   })
  // }



  removeFocus() {
    this.pivotItem = null!;
    this.selectedItem = null!;
    this.unselectedItem = null!;
    this.editedItem = null!;

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

    if (!this.editable) {
      listItem.selected = true;
      this.selectedItem = listItem;
      this.editedItem = null!;
      this.unselectedItem = null!;


    } else {
      this.addDisabled = true;
      this.editDisabled = true;
      this.deleteDisabled = true;
      this.newItem = true;
      this.selectedItem = null!;
      this.unselectedItem = null!;
      this.editedItem = listItem;
      this.editedItem.htmlItem!.nativeElement.innerText = this.editedItem.htmlItem!.nativeElement.innerText?.trim()!;
      this.setItemFocus(this.editedItem);
      this.buttonsUpdate();

    }
  }




  setEditItem(listItem: ListItem) {
    if (listItem && this.editable) {
      this.addDisabled = true;
      this.editDisabled = true;
      this.deleteDisabled = true;
      this.addEventListeners();



      this.editedItem = listItem;

      this.editedItem.htmlItem!.nativeElement.innerText = this.editedItem.htmlItem!.nativeElement.innerText.trim()!;

      this.selectedItem = null!;

      this.sourceList.forEach(x => {
        if (x.selected) x.selected = false;
        if (x.selectType) x.selectType = null!;
      })
      this.setItemFocus(this.editedItem);
      // this.overButton = false; //?????????????????????????????????????????
      this.buttonsUpdate();
    }
  }


  setDelete() {
    if (this.editedItem == null) {
      // If a delete prompt is being used with this list
      if (this.options && this.options.deletePrompt) {
        // this.overButton = false;//???????????????????????????????????????????????
        // this.itemDeletionPending = true;

        // If the delete prompt has NOT been opened yet
        if (!this.promptOpen) {
          // Gather all the selected items
          let selectedItems: Array<ListItem> = this.sourceList.filter(x => x.selected);
          // Get all the items that are going to be deleted
          let deletedItems: Array<ListItem> = this.getDeletedItems(selectedItems);
          // Send the delete info back so it can be used for the prompt message
          this.deletePromptUpdate(deletedItems);
          this.buttonsUpdate();

          // Open the prompt
          this.openPrompt(this.options.deletePrompt);

          // If the delete prompt is open, then delete the item(s)
        } else {
          this.delete();
        }

        // If a delete prompt is NOT being used with this list, then just delete the item(s)
      } else {
        this.delete();
      }
    }
  }




  delete() {
    // If an item is selected
    if (this.sourceList.filter(x => x.selected).length > 0 && this.deletable) {
      // Mark as deletion pending
      // this.itemDeletionPending = true;
      // Gather all the selected items
      let selectedItems: Array<ListItem> = this.sourceList.filter(x => x.selected);
      // Get all the items that are going to be deleted
      let deletedItems: Array<ListItem> = this.getDeletedItems(selectedItems);
      // Get the item that will be selected after all items are deleted 
      let nextSelectedItem: ListItem = this.unselectedItem != null ? this.unselectedItem : this.getNextSelectedItemAfterDelete(deletedItems);
      // Update the list
      this.deleteUpdate(deletedItems);


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
        if (nextSelectedItem != null) {
          // window.setTimeout(() => {?????????????????????????????????????????????????????????????

          // Select that list item
          this.onItemDown(nextSelectedItem);

          // }, 20);

          // If there is NOT a next available list item that can be selected
        } else {
          // Make no list item marked as selected
          this.selectedItem = null!;
          this.pivotItem = null!;
          // this.overButton = false;//????????????????????????????????????????????
          this.removeEventListeners();
        }
      }

      // If a list item was unselected
      if (this.unselectedItem != null) {
        // window.setTimeout(() => {????????????????????????????????????????????????????????????????????
        // Unselect that list item again
        this.unselectedItem = nextSelectedItem;
        // this.deleteIcon.isDisabled = true;
        // Re-establish the pivot index
        this.pivotItem = this.unselectedItem;
        // Set focus to that unselected list item
        // this.setItemFocus(this.unselectedItem);
        // }, 20);
      }
      this.setButtonsState();
    }
  }


  getDeletedItems(selectedItems: Array<ListItem>): Array<ListItem> {
    let deletedItems: Array<ListItem> = new Array<ListItem>();

    // Loop through all the selected items
    selectedItems.forEach(x => {
      // Update the deleted items list with every item in the source list that has the same index as an item in the selected list
      deletedItems.push(this.sourceList[this.sourceList.indexOf(x)]);
    })
    return deletedItems;
  }


  getNextSelectedItemAfterDelete(deletedItems?: Array<ListItem>): ListItem {
    let nextSelectedItem!: ListItem;
    const selectedItemIndex = this.sourceList.indexOf(this.selectedItem);

    // Loop through the list of items starting with the item that follows the selected item
    for (let i = selectedItemIndex + 1; i < this.sourceList.length; i++) {
      // If we come across an item that is NOT selected
      if (!this.sourceList[i].selected) {
        // Make a copy of that item so that it can be used as the newly selected item when all the other items are deleted
        nextSelectedItem = this.sourceList[i];
        break;
      }
    }
    return nextSelectedItem;
  }



  onItemDoubleClick(listItem: ListItem) {
    if (!this.shiftKeyDown && !this.ctrlKeyDown) {
      this.setEditItem(listItem);
      this.doubleClickUpdate();

    }
  }




  escape() {
    if (!this.promptOpen) {

      // If an item is being edited
      if (this.editedItem != null) {

        // Evaluate the state of the edit and then act accordingly
        this.evaluateEdit(true);

        // If an item is NOT being edited
      } else {

        if (this.contextMenuOpen) {
          this.closeContextMenu();
        } else {
          // Then remove all listeners and selections
          this.removeEventListeners();
        }
      }

      this.setButtonsState();
    }
  }


  arrowUp() {
    let index: number = this.selectedItem != null ? this.sourceList.indexOf(this.selectedItem) : this.sourceList.indexOf(this.unselectedItem);

    if (index > 0) {
      index--;
      this.onItemDown(this.sourceList[index]);
    }
  }


  arrowDown() {
    let index: number = this.selectedItem != null ? this.sourceList.indexOf(this.selectedItem) : this.sourceList.indexOf(this.unselectedItem);

    if (index < this.sourceList.length - 1) {
      index++;
      this.onItemDown(this.sourceList[index]);
    }
  }


  enter(e: KeyboardEvent) {
    if (!this.promptOpen) {
      e.preventDefault();

      // If an item is being edited
      if (this.editedItem) {
        // Evaluate the state of the edit and then act accordingly
        this.evaluateEdit();
      }
    }
  }




  reselectItem() {
    this.newItem = false;
    if (this.selectable) {
      this.selectedItem = this.editedItem;
      this.selectedItem.selected = true;
      this.selectedItemsUpdate(false);
    }
    this.editedItem = null!;
  }


  commitAddEdit() {
    this.addEditVerificationInProgress = false;

    // Update the name property
    this.editedItem.name = this.editedItem.htmlItem!.nativeElement.innerText.trim()!;

    // As long as the list is sortable
    if (this.sortable) {
      // Sort the list
      this.sort(this.editedItem)!

      // If the list is NOT sortable
    } else {
      this.resetIndent(); // * Used for hierarchy list * (calling this puts back the indent)
    }
    this.addEditUpdate(this.editedItem);

    this.reselectItem();

    this.setButtonsState();
  }


  evaluateEdit(isEscape?: boolean, isBlur?: boolean) {
    const trimmedEditedItem = this.editedItem.htmlItem!.nativeElement.innerText.trim();

    // If the edited item has text written in it
    if (trimmedEditedItem.length > 0) {

      // If we pressed the (Escape) key
      if (isEscape) {

        // If we ARE adding a new item 
        if (this.newItem) {

          // Remove the item
          this.sourceList.splice(this.sourceList.indexOf(this.editedItem), 1);
          this.newItem = false;
          this.editedItem = null!;
          this.selectedItem = null!;
          this.unSelectedItemsUpdate();

          // If we were NOT adding a new item
        } else {

          // As long as the edited name is different from what it was before the edit
          // if (trimmedEditedItem != this.editedItem.name!.trim()) {



          // Reset the item back to the way it was before the edit
          this.editedItem.htmlItem!.nativeElement.innerText = this.editedItem.name!.trim()!;





          // }
          this.reselectItem();
        }



        // If we did NOT press the (Escape) key
        // But the (Enter) key was pressed or the list item was (Blurred)
      } else {

        // As long as the edited name is different from what it was before the edit
        if (trimmedEditedItem != this.editedItem.name!.trim()) {

          // If this list is set to verify add and edit
          if (this.verifyAddEdit) {

            // As long as a verification is NOT in progress
            if (!this.addEditVerificationInProgress) {

              // Begin add edit verification
              this.addEditVerificationInProgress = true;
              this.verifyAddEditUpdate(this.editedItem, trimmedEditedItem);
              return
            }

            // If this list does NOT verify
          } else {

            // Update the name property
            this.editedItem.name = trimmedEditedItem;

            // As long as the list is sortable
            if (this.sortable) {

              // Sort the list
              this.sort(this.editedItem)!

              // If the list is NOT sortable
            } else {
              this.resetIndent(); // * Used for hierarchy list * (calling this puts back the indent)
            }

            // Send update
            this.addEditUpdate(this.editedItem);


          }

          // If the edited name has NOT changed
        } else {
          this.resetIndent(); // * Used for hierarchy list * (calling this puts back the indent)
        }

        this.reselectItem();
      }
      // this.newItem = false;
      // if (this.selectable) {
      //   this.selectedItem = this.editedItem;
      //   this.selectedItem.selected = true;
      // }
      // this.editedItem = null!;




      // But if the item is empty
    } else {

      // If we pressed the (Escape) key or the item was (Blurred)
      if (isEscape || isBlur) {

        // If we were adding a new item
        if (this.newItem) {

          // Remove the item
          this.sourceList.splice(this.sourceList.indexOf(this.editedItem), 1);
          this.newItem = false;
          this.editedItem = null!;
          this.selectedItem = null!;
          this.unSelectedItemsUpdate();

          // If we were NOT adding a new list item
        } else {



          // Reset the item back to the way it was before the edit
          this.editedItem.htmlItem!.nativeElement.innerText = this.editedItem.name!.trim()!;




          // if (this.selectable) {
          //   this.selectedItem = this.editedItem;
          //   this.selectedItem.selected = true;
          // }
          this.reselectItem();
        }

        // // Reset
        // this.newItem = false;
        // this.editedItem = null!;


        // this.reselectItem();
      }



    }

    // As long as the (Enter) key was NOT pressed
    if (isEscape || isBlur) this.setButtonsState();
  }


  sort(listItem?: ListItem) {
    this.sourceList.sort((a, b) => (a.name! > b.name!) ? 1 : -1);
    // listItem!.htmlItem!.nativeElement.innerText = listItem!.name?.trim()!;
    // return listItem
  }


  async openContextMenu(e: MouseEvent) {
    if (this.options && this.options.menu) {
      this.lazyLoadingService.load(async () => {
        const { ContextMenuComponent } = await import('../components/context-menu/context-menu.component');
        const { ContextMenuModule } = await import('../components/context-menu/context-menu.module');

        return {
          component: ContextMenuComponent,
          module: ContextMenuModule
        }
      }, SpinnerAction.None).then((contextMenu: ContextMenuComponent) => {
        this.contextMenu = contextMenu;
        this.contextMenuOpen = true;
        contextMenu.xPos = e.clientX + 5;
        contextMenu.yPos = e.clientY + 5;
        contextMenu.parentObj = this.options.menu?.parentObj!;
        contextMenu.options = this.options.menu?.menuOptions!;
        this.overContextMenuListener = contextMenu.overMenu.subscribe((overMenu: boolean) => {
          this.overContextMenu = overMenu;
        })
        this.contextMenuOpenListener = contextMenu.menuOpen.subscribe((menuOpen: boolean) => {
          this.contextMenuOpen = menuOpen;
        })
      });
    }
  }


  closeContextMenu() {
    if (this.contextMenuOpen) {
      this.contextMenu.onHide();
      // Delay so the context menu and a selected item doesn't close at the same time
      window.setTimeout(() => {
        this.contextMenuOpen = false;
      }, 10)
      this.overContextMenuListener.unsubscribe();
      this.contextMenuOpenListener.unsubscribe();
    }
  }




  resetIndent() { }




  async openPrompt(promptOption: Prompt) {
    this.lazyLoadingService.load(async () => {
      const { PromptComponent } = await import('../components/prompt/prompt.component');
      const { PromptModule } = await import('../components/prompt/prompt.module');

      return {
        component: PromptComponent,
        module: PromptModule
      }
    }, SpinnerAction.None).then((prompt: PromptComponent) => {
      this.prompt = prompt;
      this.promptOpen = true;
      prompt.parentObj = promptOption.parentObj!;
      prompt.title = promptOption.title!;
      prompt.message = promptOption.message!;
      prompt.primaryButton = promptOption.primaryButton!;
      prompt.secondaryButton = promptOption.secondaryButton!;
      prompt.tertiaryButton = promptOption.tertiaryButton!;

      // Close the context menu (if open)
      this.closeContextMenu();


      // If the duplicate prompt is being opened
      if (this.addEditVerificationInProgress) {
        // Take the focus away from the duplicate item
        this.editedItem.htmlItem?.nativeElement.blur();
      }

      let promptCloseListener: Subscription = prompt.onClose.subscribe(() => {
        // If the duplicate prompt is being closed
        if (this.addEditVerificationInProgress) {
          this.addEditVerificationInProgress = false;

          this.onDuplicatePromptClose();
        }

        // Wait a frame so the escape and enter key events know the prompt was open
        window.setTimeout(() => {
          this.promptOpen = false;
        })
        // this.setItemFocus(this.selectedItem);
        promptCloseListener.unsubscribe();
      })
    })
  }



  onDuplicatePromptClose() {
    // If a duplicate item was found while adding an item
    if (this.newItem) {
      this.editedItem.htmlItem!.nativeElement.innerText = '';

      // If a duplicate item was found while editing an item
    } else {
      this.editedItem.htmlItem!.nativeElement.innerText = this.editedItem.name?.trim()!;
    }

    this.setItemFocus(this.editedItem);
    this.addDisabled = true;
    this.editDisabled = true;
    this.deleteDisabled = true;
    this.buttonsUpdate();
  }


  buttonsUpdate() {
    this.onListUpdate.next(
      {
        addDisabled: this.addDisabled,
        editDisabled: this.editDisabled,
        deleteDisabled: this.deleteDisabled
      }
    );
  }


  addEditUpdate(listItem: ListItem) {

    this.onListUpdate.next(
      {
        type: this.newItem ? ListUpdateType.Add : ListUpdateType.Edit,
        id: listItem.id,
        index: this.sourceList.findIndex(x => x.id == listItem.id && x.name == listItem.name),
        name: listItem.name
      }
    );
  }


  verifyAddEditUpdate(listItem: ListItem, name: string) {
    this.onListUpdate.next(
      {
        type: ListUpdateType.VerifyAddEdit,
        id: listItem.id,
        index: this.sourceList.findIndex(x => x.id == listItem.id && x.name == listItem.name),
        name: name
      }
    );
  }


  selectedItemsUpdate(rightClick: boolean) {
    const selectedItems = this.sourceList.filter(x => x.selected == true);
    this.onListUpdate.next(
      {
        type: ListUpdateType.SelectedItems,
        rightClick: rightClick,
        selectedItems: selectedItems!.map((x) => {
          return {
            id: x.id,
            index: this.sourceList.findIndex(y => y.id == x.id && y.name == x.name),
            name: x.name
          }
        })
      }
    );
  }


  unSelectedItemsUpdate() {
    this.onListUpdate.next({
      type: ListUpdateType.UnselectedItems,
      addDisabled: this.addDisabled,
      editDisabled: this.editDisabled,
      deleteDisabled: this.deleteDisabled
    })
  }


  doubleClickUpdate() {
    this.onListUpdate.next({
      type: ListUpdateType.DoubleClick,
      addDisabled: this.addDisabled,
      editDisabled: this.editDisabled,
      deleteDisabled: this.deleteDisabled
    })
  }


  deletePromptUpdate(deletedItems: Array<ListItem>) {
    this.onListUpdate.next(
      {
        type: ListUpdateType.DeletePrompt,
        deletedItems: deletedItems!.map((x) => {
          return {
            id: x.id,
            index: this.sourceList.findIndex(y => y.id == x.id && y.name == x.name),
            name: x.name
          }
        })
      }
    );
  }


  deleteUpdate(deletedItems: Array<ListItem>) {
    this.onListUpdate.next(
      {
        type: ListUpdateType.Delete,
        deletedItems: deletedItems!.map((x) => {
          return {
            id: x.id,
            index: this.sourceList.findIndex(y => y.id == x.id && y.name == x.name),
            name: x.name
          }
        })
      });
  }
}