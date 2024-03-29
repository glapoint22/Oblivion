import { Subject, Subscription } from "rxjs";
import { CaseType, ItemSelectType, ListUpdateType } from "./enums";
import { ListItem } from "./list-item";
import { ListOptions } from "./list-options";
import { ListUpdate } from "./list-update";
import { LazyLoadingService, SpinnerAction } from 'common';
import { ContextMenuComponent } from "../components/context-menu/context-menu.component";
import { PromptComponent } from "../components/prompt/prompt.component";
import { Prompt } from "./prompt";
import { CapitalizedCase, TitleCase } from "text-box";

export class ListManager {
  public prompt!: PromptComponent;
  public sourceList!: Array<ListItem>;
  public selectedItem!: ListItem;
  public unselectedItem!: ListItem;
  public editedItem!: ListItem;
  public pivotItem!: ListItem;
  public shiftKeyDown!: boolean;
  public ctrlKeyDown!: boolean;
  public eventListenersAdded!: boolean;
  public preventUnselectionFromRightMousedown!: boolean;
  public newItem!: boolean;
  public options!: ListOptions;
  public SelectType = ItemSelectType;
  public addDisabled: boolean = false;
  public editDisabled: boolean = true;
  public deleteDisabled: boolean = true;
  public editable: boolean = true;
  public selectable: boolean = true;
  public unselectable: boolean = true;
  public deletable: boolean = true;
  public multiselectable: boolean = true;
  public sortable: boolean = true;
  public verifyAddEdit: boolean = false;
  public showSelection: boolean = true;
  public cursor!: string;
  public addEditVerificationInProgress!: boolean;
  public onListUpdate = new Subject<ListUpdate>();
  public contextMenuOpen!: boolean;
  public promptOpen!: boolean;
  public editItemOldName!: string;
  public contextMenu!: ContextMenuComponent;



  // ====================================================================( CONSTRUCTOR )==================================================================== \\

  constructor(public lazyLoadingService: LazyLoadingService) { }



  // ================================================================( ADD EVENT LISTENERS )================================================================ \\

  addEventListeners() {
    if (!this.eventListenersAdded) {
      this.eventListenersAdded = true;
      window.addEventListener('keyup', this.onKeyUp);
      window.addEventListener('keydown', this.onKeyDown);
      window.addEventListener('blur', this.onInnerWindowBlur);
      window.addEventListener('mousedown', this.onMouseDown);
      window.addEventListener('paste', this.onPaste);
    }
  }



  // ==============================================================( REMOVE EVENT LISTENERS )=============================================================== \\

  removeEventListeners() {
    if (this.unselectable) {
      this.removeFocus();
      this.eventListenersAdded = false;
      this.shiftKeyDown = false;
      this.ctrlKeyDown = false;
      this.setRemoveEventListeners();
      this.unSelectedItemsUpdate();
      this.setButtonsState();
    }
  }



  // ============================================================( SET REMOVE EVENT LISTENERS )============================================================= \\

  setRemoveEventListeners() {
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('blur', this.onInnerWindowBlur);
    window.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('paste', this.onPaste);
  }



  // ====================================================================( ON KEY DOWN )==================================================================== \\

  onKeyDown = (e: KeyboardEvent) => {
    this.keydown(e);
  }



  // ======================================================================( KEY DOWN )===================================================================== \\

  keydown(e: KeyboardEvent) {
    if (e.key === 'Delete') if (!this.editedItem) this.setDelete();
    if (e.key === 'Escape') this.escape();
    if (e.key === 'Enter') this.enter(e);
    if (e.key === 'ArrowUp') this.arrowUp();
    if (e.key === 'ArrowDown') this.arrowDown();

    if (this.multiselectable) {
      if (e.key === 'Control') this.ctrlKeyDown = true;
      if (e.key === 'Shift') this.shiftKeyDown = true;
    }
  }



  // =====================================================================( ON KEY UP )===================================================================== \\

  onKeyUp = (e: KeyboardEvent) => {
    if (e.key === 'Control') this.ctrlKeyDown = false;
    if (e.key === 'Shift') this.shiftKeyDown = false;
  }



  // =================================================================( SET BUTTONS STATE )================================================================= \\

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



  // ===============================================================( ON INNER WINDOW BLUR )================================================================ \\

  onInnerWindowBlur = () => {
    // * When the focus gets set to something that is outside the inner-window * \\

    if (!this.promptOpen && !this.contextMenuOpen) {
      // If a list item is being edited or added
      if (this.editedItem) {
        // Evaluate the state of the edit and then act accordingly
        this.evaluateEdit(null!, true);

        // If a list item is NOT being edited
      } else {
        // Then remove all listeners and selections
        this.removeEventListeners();
      }
    }
  }



  // ==================================================================( SET ITEM FOCUS )=================================================================== \\

  setItemFocus() {
    // When NO text is in the editable item
    this.getHtmlItem().focus();

    // When text is in the editable item and we want to select a range
    let range = document.createRange();
    range.selectNodeContents(this.getHtmlItem());
    let sel = window.getSelection();
    sel!.removeAllRanges();
    sel!.addRange(range);

    this.preventUnselectionFromRightMousedown = false;
  }



  // ===================================================================( ON MOUSE DOWN )=================================================================== \\

  onMouseDown = () => {
    if (!this.promptOpen && !this.contextMenuOpen) {
      // If an item is being edited or added
      if (this.editedItem) {

        // Evaluate the state of the edit and then act accordingly
        this.evaluateEdit(null!, true);

        // If an item is NOT being edited
      } else {

        // Remove all listeners and selections
        this.removeEventListeners();
      }
    }
  }



  // =====================================================================( ON PASTE )====================================================================== \\

  onPaste = (e: Event) => {
    if (this.getEditedItem()) {
      e.preventDefault();

      // Record the clipboard data
      const clipboardData = (e as ClipboardEvent).clipboardData!.getData('text/plain').trim();

      // As long as there is clipboard data (and not an empty string)
      if (clipboardData) {
        // Convert the clipboard data into an array anywhere there is a newline detected (if any)
        const clipboardDataArray = clipboardData.split("\n");

        // Remove \r anywhere it is found (if any)
        clipboardDataArray.forEach((x, i, arry) => {
          arry[i] = x.replace('\r', '').toLowerCase();
        })

        // If the array has more than one element (that would mean a list was pasted in)
        if (clipboardDataArray.length > 1) {
          // Remove the duplicate items (if any)
          let uniqueClipboardDataArray = [...new Set(clipboardDataArray)];

          // And as long as the list was pasted into a new list item (not an existing list item that is being edited)
          if (this.newItem) {
            this.newItem = false;
            this.getEditedItem().items = uniqueClipboardDataArray;
            this.multiItemAddUpdate(this.getEditedItem());
          }

          // But if the array has only one element (that would mean a list was (NOT) pasted in)
        } else {
          this.getHtmlItem().innerText = clipboardData;
        }
      }
    }
  }



  // ===================================================================( ON ITEM DOWN )==================================================================== \\

  onItemDown(listItem: ListItem, e?: MouseEvent) {
    if (e) e!.stopPropagation()

    // As long as the item that just received this mouse down is NOT currently being edited
    if (this.editedItem != listItem) {

      // If another item is being edited, remove it from edit mode
      if (this.editedItem) this.evaluateEdit(null!, true);

      // Initialize
      this.preventUnselectionFromRightMousedown = false;

      // If the context menu is already open, close it
      if (this.contextMenuOpen) this.contextMenu.close();

      // If this item is being selected from a right mouse down
      if (e != null && e.button == 2) {

        // As long as we're not in edit mode
        if (!this.editedItem) {

          window.setTimeout(() => {
            // Open the context menu
            this.openContextMenu(e);
          }, 100)
        }

        // Check to see if this item is already selected
        if (listItem.selected) {

          // Prevent it from being unselected
          this.preventUnselectionFromRightMousedown = true;
        }
      }

      if (this.selectable && (listItem.selectable == null || listItem.selectable)) {
        // As long as we're not right clicking on an item that's already selected
        if (!this.preventUnselectionFromRightMousedown) {
          this.setItemSelection(listItem);
          this.setButtonsState();
        }

        // As long as we're not in edit mode
        if (!this.editedItem) {
          this.selectedItemsUpdate(e != null && e.button == 2);
          this.buttonsUpdate();
        }

      } else if (!listItem.selectable) {
        this.removeEventListeners();
      }
    }
  }



  // ================================================================( SET ITEM SELECTION )================================================================= \\

  setItemSelection(listItem: ListItem) {
    // If an item is NOT being edited
    if (!this.editedItem) {

      this.addEventListeners();
      this.selectedItem = listItem;
      this.unselectedItem = null!;
      // Define what items are selected
      this.setSelectedItems(listItem);
      // Then define what the selection type is for each item
      this.setItemsSelectType();
    }
  }



  // ================================================================( SET SELECTED ITEMS )================================================================= \\

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



  // ==============================================================( SET ITEMS SELECT TYPE )================================================================ \\

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



  // ===========================================================( SET SELECTED ITEMS SHIFT KEY )============================================================ \\

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



  // ============================================================( SET SELECTED ITEMS CTRL KEY )============================================================ \\

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



  // ========================================================( SET SELECTED ITEMS NO MODIFIER KEY )========================================================= \\

  setSelectedItemsNoModifierKey(listItem: ListItem) {
    // Clear the selection for all items
    this.sourceList.forEach(x => x.selected = false);
    // Set the selected
    listItem.selected = true;
    // Define the pivot item
    this.pivotItem = listItem;
  }



  // ===================================================================( REMOVE FOCUS )==================================================================== \\

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



  // ===================================================================( SET ADD ITEM )==================================================================== \\

  setAddItem(listItem: ListItem) {
    this.addEventListeners();

    this.sourceList.forEach(x => {
      x.selected = false;
      x.selectType = null!;
    })

    // If the list item is NOT editable
    if (!this.editable) {
      listItem.selected = true;
      this.selectedItem = listItem;
      this.editedItem = null!;
      this.unselectedItem = null!;
      this.deleteDisabled = false;

      this.selectedItemsUpdate(false);

      this.onListUpdate.next(
        {
          type: ListUpdateType.Add,
          id: listItem.id,
          index: this.sourceList.findIndex(x => x.id == listItem.id && x.name == listItem.name),
          name: listItem.name
        }
      );

      // If the list item IS editable
    } else {

      this.addDisabled = true;
      this.editDisabled = true;
      this.deleteDisabled = true;
      this.newItem = true;
      this.selectedItem = null!;
      this.unselectedItem = null!;
      this.editedItem = listItem;
      this.editedItem.htmlItem!.nativeElement.innerText = this.editedItem.htmlItem!.nativeElement.innerText?.trim()!;
      this.setItemFocus();
    }
    this.buttonsUpdate();
  }



  // ===================================================================( SET EDIT ITEM )=================================================================== \\

  setEditItem(listItem: ListItem) {
    if (listItem && this.editable) {
      this.setEdit(listItem);
    }
  }



  // ======================================================================( SET EDIT )===================================================================== \\

  setEdit(listItem: ListItem) {
    this.addDisabled = true;
    this.editDisabled = true;
    this.deleteDisabled = true;
    this.addEventListeners();
    this.editedItem = listItem;
    this.getHtmlItem().innerText = this.getHtmlItem().innerText.trim()!;
    this.selectedItem = null!;

    this.sourceList.forEach(x => {
      if (x.selected) x.selected = false;
      if (x.selectType) x.selectType = null!;
    })
    this.setItemFocus();
    this.buttonsUpdate();
  }



  // =====================================================================( SET DELETE )==================================================================== \\

  setDelete() {
    if (!this.editedItem && this.deletable) {
      // If a delete prompt is being used with this list
      if (this.options && this.options.deletePrompt) {
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



  // =======================================================================( DELETE )====================================================================== \\

  delete() {
    // If an item is selected
    if (this.sourceList.filter(x => x.selected).length > 0) {
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
          // Select that list item
          this.onItemDown(nextSelectedItem);

          // If there is NOT a next available list item that can be selected
        } else {
          // Make no list item marked as selected
          this.selectedItem = null!;
          this.pivotItem = null!;
          this.removeEventListeners();
        }
      }

      // If a list item was unselected
      if (this.unselectedItem != null) {
        // Unselect that list item again
        this.unselectedItem = nextSelectedItem;
        // Re-establish the pivot index
        this.pivotItem = this.unselectedItem;
        this.setButtonsState();
      }
    }
  }



  // =================================================================( GET DELETED ITEMS )================================================================= \\

  getDeletedItems(selectedItems: Array<ListItem>): Array<ListItem> {
    let deletedItems: Array<ListItem> = new Array<ListItem>();

    // Loop through all the selected items
    selectedItems.forEach(x => {
      // Update the deleted items list with every item in the source list that has the same index as an item in the selected list
      deletedItems.push(this.sourceList[this.sourceList.indexOf(x)]);
    })
    return deletedItems;
  }



  // ========================================================( GET NEXT SELECTED ITEM AFTER DELETE )======================================================== \\

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



  // ===============================================================( ON ITEM DOUBLE CLICK )================================================================ \\

  onItemDoubleClick(listItem: ListItem, value?: ListItem) {
    if (!this.shiftKeyDown && !this.ctrlKeyDown && (listItem.selectable == null || listItem.selectable) && (listItem.editable == null || listItem.editable)) {
      this.setDoubleClick(listItem, value!);
      this.doubleClickUpdate();
    }
  }



  // =================================================================( SET DOUBLE CLICK )================================================================== \\

  setDoubleClick(listItem: ListItem, value?: ListItem) {
    this.setEditItem(listItem);
  }



  // ======================================================================( ESCAPE )======================================================================= \\

  escape() {
    if (!this.promptOpen && !this.contextMenuOpen) {

      // If an item is being edited
      if (this.editedItem) {

        // Evaluate the state of the edit and then act accordingly
        this.evaluateEdit(true);

        // If an item is NOT being edited
      } else {

        // Then remove all listeners and selections
        this.removeEventListeners();
      }
    }
  }



  // =====================================================================( ARROW UP )====================================================================== \\

  arrowUp() {
    let index: number = this.selectedItem != null ? this.sourceList.indexOf(this.selectedItem) : this.sourceList.indexOf(this.unselectedItem);

    if (index > 0) {
      index--;
      this.onItemDown(this.sourceList[index]);
    }
  }



  // ====================================================================( ARROW DOWN )===================================================================== \\

  arrowDown() {
    let index: number = this.selectedItem != null ? this.sourceList.indexOf(this.selectedItem) : this.sourceList.indexOf(this.unselectedItem);

    if (index < this.sourceList.length - 1) {
      index++;
      this.onItemDown(this.sourceList[index]);
    }
  }



  // =======================================================================( ENTER )======================================================================= \\

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



  // ===================================================================( RESELECT ITEM )=================================================================== \\

  reselectItem() {

    this.newItem = false;
    if (this.selectable) {
      this.selectedItem = this.editedItem;
      this.selectedItem.selected = true;
      this.selectedItemsUpdate(false);
    }
    this.editedItem = null!;
  }



  // =====================================================================( GET CASE )====================================================================== \\

  getCase(): string {
    let text: string;

    switch (this.editedItem.case) {

      // Capitalized Case
      case CaseType.CapitalizedCase:
        const capCase = new CapitalizedCase();
        text = capCase.getCase(this.getHtmlItem().innerText.trim());
        break;

      // Title Case
      case CaseType.TitleCase:
        const titleCase = new TitleCase();
        text = titleCase.getCase(this.getHtmlItem().innerText.trim());
        break;

      // Lower Case
      case CaseType.LowerCase:
        text = this.getHtmlItem().innerText.trim().toLowerCase();
        break;

      // No Case
      default:
        text = this.getHtmlItem().innerText.trim();
        break;
    }
    return text;
  }



  // ==================================================================( COMMIT ADD EDIT )================================================================== \\

  commitAddEdit() {
    this.addEditVerificationInProgress = false;

    // Before we update the edited item with the new value, save the old value first
    this.editItemOldName = this.getEditedItem().name!;

    // Update the name property
    this.getEditedItem().name = this.getCase();


    // As long as the list is sortable
    if (this.sortable) {

      // Sort the list
      this.sort(this.editedItem)!

      // If the list is NOT sortable
    } else {
      this.restoreIndent(); // * Used for hierarchy list * (calling this puts back the indent)
    }
    this.addEditUpdate(this.editedItem);
    this.reselectItem();
    this.setButtonsState();
  }



  // ==================================================================( GET EDITED ITEM )================================================================== \\

  getEditedItem() {
    return this.editedItem;
  }



  // ===================================================================( GET HTML ITEM )=================================================================== \\

  getHtmlItem() {
    return this.editedItem.htmlItem!.nativeElement;
  }



  // ===================================================================( EVALUATE EDIT )=================================================================== \\

  evaluateEdit(isEscape?: boolean, isBlur?: boolean) {
    const trimmedEditedItem = this.getHtmlItem().innerText.trim();

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

          // Reset the item back to the way it was before the edit
          this.getHtmlItem().innerText = this.getEditedItem().name!.trim()!;
          this.restoreIndent(); // * Used for hierarchy list * (calling this puts back the indent)
          this.reselectItem();
        }

        // If we did NOT press the (Escape) key
        // But the (Enter) key was pressed or the list item was (Blurred)
      } else {
        
        // As long as a list was (NOT) pasted into the list item
        if(!this.getEditedItem().items) {
          
          // If its a new item, asign the case type (if need be)
          if (this.newItem) this.caseTypeUpdate(this.editedItem);

          // As long as the edited name is different from what it was before the edit
          if (trimmedEditedItem.toLowerCase() != this.getEditedItem().name!.trim().toLowerCase()) {

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
              this.commitAddEdit();
            }

            // If the edited name has NOT changed
          } else {

            //If the case was changed. i.e. lower case to upper case
            if (trimmedEditedItem != this.getEditedItem().name!.trim()) {
              this.getEditedItem().name = this.getCase();
              if (this.sortable) this.sort(this.editedItem);
              this.addEditUpdate(this.editedItem);
            }
            this.restoreIndent(); // * Used for hierarchy list * (calling this puts back the indent)
            this.reselectItem();
          }
        }
      }

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
          this.getHtmlItem().innerText = this.getEditedItem().name!.trim()!;
          this.restoreIndent(); // * Used for hierarchy list * (calling this puts back the indent)
          this.reselectItem();
        }
      }
    }
    // As long as the (Enter) key was NOT pressed
    if (isEscape || isBlur) this.setButtonsState();
  }



  // =======================================================================( SORT )======================================================================== \\

  sort(listItem?: ListItem) {
    this.getHtmlItem().innerText = this.getEditedItem().name!.trim()!;
    this.sourceList.sort((a, b) => (a.name! > b.name!) ? 1 : -1);
  }



  // =================================================================( OPEN CONTEXT MENU )================================================================= \\

  async openContextMenu(e: MouseEvent) {
    if (this.options && this.options.menu && this.selectable && this.selectedItem && (this.selectedItem.selectable == null || this.selectedItem.selectable)) {
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

        const contextMenuOpenListener = contextMenu.menuOpen.subscribe((menuOpen: boolean) => {
          contextMenuOpenListener.unsubscribe();
          // Delay so the context menu and a selected item doesn't close at the same time
          window.setTimeout(() => {
            this.contextMenuOpen = menuOpen;
          })
        })
      });
    }
  }



  // ==================================================================( RESTORE INDENT )=================================================================== \\

  restoreIndent() {
    this.getHtmlItem().innerText = this.getEditedItem().name!.trim()!;
  }



  // ====================================================================( OPEN PROMPT )==================================================================== \\

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

      // If the duplicate prompt is being opened
      if (this.addEditVerificationInProgress) {

        // If the list IS editable
        if (this.editable) {
          // Take the focus away from the duplicate item
          this.editedItem.htmlItem?.nativeElement.blur();

          // If the list is NOT editable
        } else {
          this.duplicatePromptOpenUpdate();
        }
      }

      // If the duplicate prompt is being closed
      let promptCloseListener: Subscription = prompt.onClose.subscribe(() => {
        if (this.addEditVerificationInProgress) {
          this.addEditVerificationInProgress = false;
          if (this.editable) this.onDuplicatePromptClose();
          this.duplicatePromptCloseUpdate();
        }

        // Wait a frame so the escape and enter key events know the prompt was open
        window.setTimeout(() => {
          this.promptOpen = false;
        })
        promptCloseListener.unsubscribe();
      })
    })
  }



  // =============================================================( ON DUPLICATE PROMPT CLOSE )============================================================= \\

  onDuplicatePromptClose() {
    // If a duplicate item was found while adding an item
    if (this.newItem) {
      this.getHtmlItem().innerText = '';

      // If a duplicate item was found while editing an item
    } else {
      this.getHtmlItem().innerText = this.getEditedItem().name?.trim()!;
    }

    this.setItemFocus();
    this.addDisabled = true;
    this.editDisabled = true;
    this.deleteDisabled = true;
    this.buttonsUpdate();
  }



  // ==================================================================( BUTTONS UPDATE )=================================================================== \\

  buttonsUpdate() {
    this.onListUpdate.next(
      {
        addDisabled: this.addDisabled,
        editDisabled: this.editDisabled,
        deleteDisabled: this.deleteDisabled
      }
    );
  }



  // ==================================================================( ADD EDIT UPDATE )================================================================== \\

  addEditUpdate(listItem: ListItem) {
    this.onListUpdate.next(
      {
        type: this.newItem ? ListUpdateType.Add : ListUpdateType.Edit,
        id: listItem.id,
        index: this.sourceList.findIndex(x => x.id == listItem.id && x.name == listItem.name),
        name: listItem.name,
        oldName: this.editItemOldName
      }
    );
  }



  // ==============================================================( VERIFY ADD EDIT UPDATE )=============================================================== \\

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



  // ================================================================( DELETE PROMPT UPDATE )=============================================================== \\

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



  // ====================================================================( DELETE UPDATE )================================================================== \\

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



  // ===============================================================( SELECTED ITEMS UPDATE )=============================================================== \\

  selectedItemsUpdate(rightClick: boolean) {
    const selectedItems = this.sourceList.filter(x => x.selected == true);
    selectedItems.forEach(x => x.index = this.sourceList.findIndex(y => y.id == x?.id && y.hierarchyGroupID == x.hierarchyGroupID));
    this.onListUpdate.next({ type: ListUpdateType.SelectedItems, selectedItems: selectedItems, rightClick: rightClick });
  }



  // ==============================================================( UNSELECTED ITEMS UPDATE )============================================================== \\

  unSelectedItemsUpdate() {
    this.onListUpdate.next({
      type: ListUpdateType.UnselectedItems,
      addDisabled: this.addDisabled,
      editDisabled: this.editDisabled,
      deleteDisabled: this.deleteDisabled
    })
  }



  // ================================================================( DOUBLE CLICK UPDATE )================================================================ \\

  doubleClickUpdate() {
    this.onListUpdate.next({
      type: ListUpdateType.DoubleClick,
      addDisabled: this.addDisabled,
      editDisabled: this.editDisabled,
      deleteDisabled: this.deleteDisabled
    })
  }



  // ===========================================================( DUPLICATE PROMPT OPEN UPDATE )============================================================ \\

  duplicatePromptOpenUpdate() {
    this.onListUpdate.next({
      type: ListUpdateType.DuplicatePromptOpen,
      addDisabled: this.addDisabled,
      editDisabled: this.editDisabled,
      deleteDisabled: this.deleteDisabled
    })
  }



  // ===========================================================( DUPLICATE PROMPT CLOSE UPDATE )=========================================================== \\

  duplicatePromptCloseUpdate() {
    this.onListUpdate.next({
      type: ListUpdateType.DuplicatePromptClose,
      addDisabled: this.addDisabled,
      editDisabled: this.editDisabled,
      deleteDisabled: this.deleteDisabled
    })
  }



  // =================================================================( CASE TYPE UPDATE )================================================================== \\

  caseTypeUpdate(listItem: ListItem) {
    this.onListUpdate.next(
      {
        type: ListUpdateType.CaseTypeUpdate,
        id: listItem.id,
        index: this.sourceList.findIndex(x => x.id == listItem.id && x.name == listItem.name),
        name: listItem.name
      }
    );
  }



  // ===============================================================( MULTI ITEM ADD UPDATE )=============================================================== \\

  multiItemAddUpdate(listItem: ListItem) {
    this.onListUpdate.next(
      {
        type: ListUpdateType.MultiItemAdd,
        id: listItem.id,
        index: this.sourceList.findIndex(x => x.id == listItem.id && x.name == listItem.name),
        items: listItem.items,
      }
    );
  }
}