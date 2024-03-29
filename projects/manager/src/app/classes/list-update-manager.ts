import { KeyValue } from "@angular/common";
import { Directive } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { DataService } from "common";
import { debounceTime, fromEvent, Subject, Subscription } from "rxjs";
import { ListComponent } from "../components/lists/list/list.component";
import { ProductFormComponent } from "../components/product/product-form/product-form.component";
import { ProductService } from "../services/product/product.service";
import { ListUpdateType, MenuOptionType } from "./enums";
import { ListItem } from "./list-item";
import { ListOptions } from "./list-options";
import { ListUpdate } from "./list-update";
import { SearchResultItem } from "./search-result-item";

@Directive()
export class ListUpdateManager {
    // private
    private _itemType!: string;
    private _listUpdate!: ListUpdate;
    private _searchListUpdate!: ListUpdate;

    // Public
    public searchMode!: boolean;
    public dataServicePath!: string;
    public searchInputName!: string;
    public parentSearchType!: string;
    public thisArray: Array<ListItem> = new Array<ListItem>();
    public addIconButtonTitle!: string;
    public otherArray: Array<ListItem> = new Array<ListItem>();
    public listComponent!: ListComponent;
    public searchComponent!: ListComponent;
    public thisSearchArray: Array<ListItem> = new Array<ListItem>();
    public otherSearchArray: Array<ListItem> = new Array<ListItem>();
    public searchInputSubscription!: Subscription;
    public selectLastSelectedItemOnOpen!: boolean;
    public editIconButtonTitle: string = 'Rename';
    public deleteIconButtonTitle: string = 'Delete';
    public searchIconButtonTitle: string = 'Search';
    public onClose: Subject<void> = new Subject<void>();
    public listOptions: ListOptions = new ListOptions();
    public searchOptions: ListOptions = new ListOptions();
    public get itemType(): string { return this._itemType; }
    public otherProductArray!: keyof ProductFormComponent;
    public get listUpdate(): ListUpdate { return this._listUpdate; }
    public otherProductSearchArray!: keyof ProductFormComponent;
    public get searchUpdate(): ListUpdate { return this._searchListUpdate; }
    public set listUpdate(listUpdate: ListUpdate) { this.onListUpdate(listUpdate); }
    public set itemType(v: string) { this._itemType = v; this.addIconButtonTitle = 'Add ' + v; }
    public set searchUpdate(searchUpdate: ListUpdate) { this.onSearchListUpdate(searchUpdate); }


    // ====================================================================( CONSTRUCTOR )==================================================================== \\

    constructor(public dataService: DataService, public sanitizer: DomSanitizer, public productService: ProductService) { }



    // ====================================================================( NG ON INIT )===================================================================== \\

    ngOnInit() {
        // ---------- LIST OPTIONS ---------- \\

        this.listOptions = {
            multiselectable: false,
            verifyAddEdit: true,

            // Delete Prompt
            deletePrompt: {
                parentObj: this,
                primaryButton: {
                    name: 'Delete',
                    buttonFunction: this.delete
                },
                secondaryButton: {
                    name: 'Cancel'
                }
            },

            // Duplicate Prompt
            duplicatePrompt: {
                parentObj: this,
                secondaryButton: {
                    name: 'Close'
                }
            },

            // Menu
            menu: {
                parentObj: this,
                menuOptions: [
                    {
                        type: MenuOptionType.MenuItem,
                        shortcut: 'Alt+A',
                        optionFunction: this.add
                    },
                    {
                        type: MenuOptionType.MenuItem,
                        shortcut: 'F2',
                        optionFunction: this.edit
                    },
                    {
                        type: MenuOptionType.MenuItem,
                        shortcut: 'Delete',
                        optionFunction: this.delete
                    }
                ]
            }
        }

        // ---------- SEARCH OPTIONS ---------- \\

        this.searchOptions = {
            multiselectable: false,
            verifyAddEdit: true,

            // Delete Prompt
            deletePrompt: {
                parentObj: this,
                primaryButton: {
                    name: 'Delete',
                    buttonFunction: this.delete
                },
                secondaryButton: {
                    name: 'Cancel'
                }
            },

            // Duplicate Prompt
            duplicatePrompt: {
                parentObj: this,
                secondaryButton: {
                    name: 'Close'
                }
            },

            // Menu
            menu: {
                parentObj: this,
                menuOptions: [
                    {
                        type: MenuOptionType.MenuItem,
                        shortcut: 'F2',
                        optionFunction: this.edit
                    },
                    {
                        type: MenuOptionType.MenuItem,
                        shortcut: 'Delete',
                        optionFunction: this.delete
                    }
                ]
            }
        }
    }



    // ======================================================================( ON OPEN )====================================================================== \\

    onOpen() {
        if (this.thisArray.length == 0) {
            this.dataService.get<Array<ListItem>>('api/' + this.dataServicePath, this.getItemParameters(), {
                authorization: true
            })
                .subscribe((thisArray: Array<ListItem>) => {
                    thisArray.forEach(x => {
                        this.thisArray.push(this.getItem(x));
                    })
                })
        } else {

            // If the list is set to select the last selected item on open
            if (this.selectLastSelectedItemOnOpen) {

                // Check to see if an item was selected before it last closed
                const selectedItem = this.thisArray.filter(x => x.selectType != null || x.selected == true)[0];
                // If an item was selected
                if (selectedItem) {
                    // Then select that item
                    this.listComponent.listManager.setItemSelection(selectedItem);
                    this.listComponent.listManager.setButtonsState();
                    selectedItem.htmlItem!.nativeElement.focus();
                }

                // If it's not set to select the last selected item
            } else {

                // Clear all selections
                this.thisArray.forEach(x => {
                    x.selectType = null!;
                    x.selected = false;
                })
            }
        }
    }



    // ===================================================================( TOGGLE SEARCH )=================================================================== \\

    toggleSearch() {
        this.searchMode = !this.searchMode;

        // If we're toggling to search mode
        if (this.searchMode) {
            this.searchIconButtonTitle = 'Back to List';
            this.thisSearchArray.splice(0, this.thisSearchArray.length);
            window.setTimeout(() => {
                const searchInput = document.getElementById(this.searchInputName) as HTMLInputElement;
                searchInput.focus();
                this.searchInputSubscription = fromEvent(searchInput, 'input').pipe(debounceTime(500)).subscribe(() => {
                    if (searchInput.value.length > 1) {
                        this.getSearchResults(searchInput.value);
                    }
                });
            })
            this.onUnselectedSearchItem();

            // If we're toggling back to list mode
        } else {

            this.searchIconButtonTitle = 'Search';

            window.setTimeout(() => {

                this.searchInputSubscription.unsubscribe();


                const selectedItem = this.thisArray.filter(x => x.selectType != null || x.selected == true)[0];
                if (selectedItem) {
                    this.listComponent.listManager.onItemDown(selectedItem);
                } else {
                    this.onUnselectedItem();
                }
            })
        }
    }



    // =======================================================================( ADD )========================================================================= \\

    add(id?: number, name?: string) {
        this.addIconButtonTitle = 'Add';
        this.editIconButtonTitle = 'Rename';
        this.deleteIconButtonTitle = 'Delete';
        this.listComponent.add(id, name);
    }



    // =======================================================================( EDIT )======================================================================== \\

    edit() {
        if (!this.searchMode) {
            this.addIconButtonTitle = 'Add';
            this.editIconButtonTitle = 'Rename';
            this.deleteIconButtonTitle = 'Delete';
            this.listComponent.edit();
        } else {

            if (this.thisSearchArray.length > 0) {
                this.editIconButtonTitle = 'Rename';
                this.deleteIconButtonTitle = 'Delete';
                this.searchComponent.edit();
            }
        }
    }



    // ======================================================================( DELETE )======================================================================= \\

    delete() {
        if (!this.searchMode) {
            this.listComponent.delete();
        } else {
            if (this.thisSearchArray.length > 0) this.searchComponent.delete();
        }
    }



    // ==================================================================( ON LIST UPDATE )=================================================================== \\

    onListUpdate(listUpdate: ListUpdate) {
        this._listUpdate = listUpdate;
        if (listUpdate.type == ListUpdateType.Add) this.onItemAdd(listUpdate);
        if (listUpdate.type == ListUpdateType.Edit) this.onItemEdit(listUpdate);
        if (listUpdate.type == ListUpdateType.VerifyAddEdit) this.onItemVerify(listUpdate);
        if (listUpdate.type == ListUpdateType.SelectedItems) this.onSelectedItem(listUpdate);
        if (listUpdate.type == ListUpdateType.UnselectedItems) this.onUnselectedItem();
        if (listUpdate.type == ListUpdateType.Delete) this.onItemDelete(listUpdate);
        if (listUpdate.type == ListUpdateType.DeletePrompt) this.onDeletePrompt(listUpdate.deletedItems![0]);
        if (listUpdate.type == ListUpdateType.DoubleClick) this.onItemDoubleClick();
    }



    // ===============================================================( ON SEARCH LIST UPDATE )=============================================================== \\

    onSearchListUpdate(searchUpdate: ListUpdate) {
        this._searchListUpdate = searchUpdate;
        if (searchUpdate.type == ListUpdateType.Edit) this.onSearchItemEdit(searchUpdate);
        if (searchUpdate.type == ListUpdateType.VerifyAddEdit) this.onSearchItemVerify(searchUpdate);
        if (searchUpdate.type == ListUpdateType.SelectedItems) this.onSelectedSearchItem(searchUpdate);
        if (searchUpdate.type == ListUpdateType.UnselectedItems) this.onUnselectedSearchItem();
        if (searchUpdate.type == ListUpdateType.Delete) this.onSearchItemDelete(searchUpdate);
        if (searchUpdate.type == ListUpdateType.DeletePrompt) this.onSearchDeletePrompt(searchUpdate.deletedItems![0]);
    }



    // =================================================================( ON SELECTED ITEM )================================================================== \\

    onSelectedItem(listUpdate: ListUpdate) {
        this.editIconButtonTitle = 'Rename ' + this.itemType;
        this.deleteIconButtonTitle = 'Delete ' + this.itemType;
        this.listOptions.deletePrompt!.title = 'Delete ' + this.itemType;
        this.listOptions.menu!.menuOptions[0].name = 'Add ' + this.itemType;
        this.listOptions.menu!.menuOptions[1].name = 'Rename ' + this.itemType;
        this.listOptions.menu!.menuOptions[2].name = 'Delete ' + this.itemType;
    }



    // ==============================================================( ON SELECTED SEARCH ITEM )============================================================== \\

    onSelectedSearchItem(searchUpdate: ListUpdate) {
        this.editIconButtonTitle = 'Rename ' + this.itemType;
        this.deleteIconButtonTitle = 'Delete ' + this.itemType;
        this.searchOptions.deletePrompt!.title = 'Delete ' + this.itemType;
        this.searchOptions.menu!.menuOptions[0].name = 'Rename ' + this.itemType;
        this.searchOptions.menu!.menuOptions[1].name = 'Delete ' + this.itemType;
    }



    // ===============================================================( ON ITEM DOUBLE CLICK )================================================================ \\

    onItemDoubleClick() {
        this.addIconButtonTitle = 'Add';
        this.editIconButtonTitle = 'Rename';
        this.deleteIconButtonTitle = 'Delete';
    }



    // ================================================================( ON UNSELECTED ITEM )================================================================= \\

    onUnselectedItem() {
        this.addIconButtonTitle = 'Add ' + this.itemType;
        this.editIconButtonTitle = 'Rename';
        this.deleteIconButtonTitle = 'Delete';
    }



    // =============================================================( ON UNSELECTED SEARCH ITEM )============================================================= \\

    onUnselectedSearchItem() {
        this.editIconButtonTitle = 'Rename';
        this.deleteIconButtonTitle = 'Delete';
    }



    // ====================================================================( ON ITEM ADD )==================================================================== \\

    onItemAdd(listUpdate: ListUpdate) {
        this.dataService.post<number>('api/' + this.dataServicePath, {
            name: listUpdate.name
        }, {
            authorization: true
        }).subscribe((id: number) => {
            this.thisArray[listUpdate.index!].id = id;
            this.updateOtherItems(listUpdate);
        });
    }



    // ==================================================================( ADD OTHER ITEM )=================================================================== \\

    addOtherItem(otherArray: Array<ListItem>, thisIndex: number, thisListItem: ListItem) {
        const addedItem = otherArray.find(x => x.name == thisListItem.name);

        // As long as the array exist and it doesn't already contain the added item
        if (otherArray.length > 0 && !addedItem) {

            otherArray.splice(thisIndex, 0, {
                id: thisListItem.id,
                name: thisListItem.name
            })
        }
    }



    // ===================================================================( ON ITEM EDIT )==================================================================== \\

    onItemEdit(listUpdate: ListUpdate) {
        this.dataService.put('api/' + this.dataServicePath, {
            id: listUpdate.id,
            name: listUpdate.name
        }, {
            authorization: true
        }).subscribe();
        this.updateOtherItems(listUpdate);
    }



    // ================================================================( ON SEARCH ITEM EDIT )================================================================ \\

    onSearchItemEdit(searchUpdate: ListUpdate) {
        this.dataService.put(this.getDataServicePath(), this.getEditedSearchItemParameters(searchUpdate), {
            authorization: true
        }).subscribe();
        this.updateOtherItems(searchUpdate);
    }



    // ==================================================================( EDIT OTHER ITEM )================================================================== \\

    editOtherItem(list: Array<ListItem>, update: ListUpdate, type?: number | string) {
        const editedItem: ListItem = list.find(x => x.id == update.id && x.name == update.oldName)!;
        if (editedItem) {
            editedItem.name = update.name;
            if (typeof type == 'number') this.sort(editedItem, list);
        }
    }



    // ===============================================================( DELETE PROMPT MESSAGE )=============================================================== \\

    deletePromptMessage(itemType: string, name: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(
            'The ' +
            itemType +
            ' <span style="color: #ffba00">\"' + name + '\"</span>' +
            ' will be permanently deleted.');
    }



    // =================================================================( ON DELETE PROMPT )================================================================== \\

    onDeletePrompt(deletedItem: ListItem) {
        this.listOptions.deletePrompt!.message = this.deletePromptMessage(this.itemType, deletedItem.name!);
    }



    // ==============================================================( ON SEARCH DELETE PROMPT )============================================================== \\

    onSearchDeletePrompt(deletedItem: ListItem) {
        this.searchOptions.deletePrompt!.message = this.deletePromptMessage(this.itemType, deletedItem.name!);
    }



    // ==================================================================( ON ITEM DELETE )=================================================================== \\

    onItemDelete(listUpdate: ListUpdate) {
        this.dataService.delete('api/' + this.dataServicePath, this.getDeletedItemParameters(listUpdate.deletedItems![0]), {
            authorization: true
        }).subscribe();
        this.updateOtherItems(listUpdate);
    }



    // ===============================================================( ON SEARCH ITEM DELETE )=============================================================== \\

    onSearchItemDelete(searchUpdate: ListUpdate) {
        this.dataService.delete('api/' + this.dataServicePath, this.getDeletedItemParameters(searchUpdate.deletedItems![0]), {
            authorization: true
        }).subscribe();
        this.updateOtherItems(searchUpdate);
    }



    // ====================================================================( DELETE ITEM )==================================================================== \\

    deleteOtherItem(list: Array<ListItem>, deletedItem: ListItem, type?: number | string) {
        // Wait a frame because the item being deleted from the "from array" doesn't show as being
        // deleted right away, which causes a second item to be deleted from the "from array"
        window.setTimeout(() => {
            const index = list.findIndex(x => x.id == deletedItem.id && x.name == deletedItem.name);
            // If the index is found, delete the item of that index
            if (index != -1) list.splice(index, 1);
        })
    }



    // =================================================================( UPDATE OTHER ITEMS )================================================================ \\

    updateOtherItems(update: ListUpdate) {
        // Other Form
        if (this.otherArray) {

            // Add Other
            if (update.type == ListUpdateType.Add) {
                this.addOtherItem(this.otherArray, update.index!, this.thisArray[update.index!]);
            }


            // Edit Other
            if (update.type == ListUpdateType.Edit) {
                this.editOtherItem(this.thisArray, update, 1);
                this.editOtherItem(this.otherArray, update, 1);
                this.editOtherItem(this.otherSearchArray, update, '');
            }


            // Delete Other
            if (update.type == ListUpdateType.Delete) {
                this.deleteOtherItem(this.thisArray, update.deletedItems![0]);
                this.deleteOtherItem(this.otherArray, update.deletedItems![0]);
                this.deleteOtherItem(this.otherSearchArray, update.deletedItems![0]);
            }
        }

        // Other Products
        if (this.otherProductArray) {
            this.productService.products.forEach(x => {

                // Add Other
                if (update.type == ListUpdateType.Add) {
                    this.addOtherItem(x[this.otherProductArray] as Array<ListItem>, update.index!, this.thisArray[update.index!]);
                }

                // Edit Other
                if (update.type == ListUpdateType.Edit) {
                    this.editOtherItem(x[this.otherProductArray] as Array<ListItem>, update, 1);
                    this.editOtherItem(x[this.otherProductSearchArray] as Array<ListItem>, update, '');
                }

                // Delete Other
                if (update.type == ListUpdateType.Delete) {
                    this.deleteOtherItem(x[this.otherProductArray] as Array<ListItem>, update.deletedItems![0]);
                    this.deleteOtherItem(x[this.otherProductSearchArray] as Array<ListItem>, update.deletedItems![0]);
                }
            })
        }
    }



    // ========================================================================( SORT )======================================================================= \\

    sort(item: ListItem, array: Array<ListItem>) {
        array.sort((a, b) => (a.name! > b.name!) ? 1 : -1);
    }



    // =============================================================( DUPLICATE PROMPT MESSAGE )============================================================== \\

    duplicatePromptMessage(listComponent: ListComponent, itemType: string, name: string): SafeHtml {

        // If the list is NOT Editable
        if (!listComponent.listManager.editable) {
            return this.sanitizer.bypassSecurityTrustHtml(
                'The '
                + itemType +
                ' <span style="color: #ffba00">\"' + name + '\"</span>' +
                ' is already being used. Please select a different ' +
                this.itemType + '.')

            // But if the list IS editable
        } else {

            return this.sanitizer.bypassSecurityTrustHtml(
                'A ' +
                itemType +
                ' with the name ' +
                '<span style="color: #ffba00">\"' + name + '\"</span>' +
                ' already exists. Please choose a different name.');
        }
    }



    // ==================================================================( ON ITEM VERIFY )=================================================================== \\

    onItemVerify(listUpdate: ListUpdate) {
        let matchFound: boolean = false;

        // Loop through each item and check for a duplicate
        this.thisArray.forEach(x => {
            if (x.name?.toLowerCase() == listUpdate.name?.toLowerCase()) {
                matchFound = true;
            }
        })

        // If no match was found
        if (!matchFound) {

            // If the list is NOT Editable
            if (!this.listComponent.listManager.editable) {
                this.listComponent.commitAdd(listUpdate.id!, listUpdate.name!);

                // But if the list IS editable
            } else {
                this.listComponent.commitAddEdit();
            }


            // If a match was found
        } else {
            this.listOptions.duplicatePrompt!.title = 'Duplicate ' + this.itemType;
            this.listOptions.duplicatePrompt!.message = this.duplicatePromptMessage(this.listComponent, this.itemType, listUpdate.name!);
            this.listComponent.openDuplicatePrompt();
        }
    }



    // ===============================================================( ON SEARCH ITEM VERIFY )=============================================================== \\

    onSearchItemVerify(searchUpdate: ListUpdate) {
        let matchFound: boolean = false;

        this.thisArray.forEach(x => {
            if (x.name?.toLowerCase() == searchUpdate.name?.toLowerCase()) {
                matchFound = true;
            }
        })

        // If no match was found
        if (!matchFound) {
            this.searchComponent.commitAddEdit();

            // If a match was found
        } else {
            this.searchOptions.duplicatePrompt!.title = 'Duplicate ' + this.itemType;
            this.searchOptions.duplicatePrompt!.message = this.duplicatePromptMessage(this.searchComponent, this.itemType, searchUpdate.name!);
            this.searchComponent.openDuplicatePrompt();
        }
    }



    // ==============================================================( ON SEARCH INPUT CHANGE )=============================================================== \\

    onSearchInputChange(searchInput: any) {
        if (searchInput.value.length == 1) {
            this.getSearchResults(searchInput.value);
        } else if (searchInput.value.length == 0) {
            this.thisSearchArray.splice(0, this.thisSearchArray.length);
        }
    }



    // ================================================================( GET SEARCH RESULTS )================================================================= \\

    getSearchResults(searchWords: string) {
        this.thisSearchArray.splice(0, this.thisSearchArray.length);
        this.dataService.get<Array<SearchResultItem>>('api/' + this.dataServicePath + '/Search', this.getSearchResultsParameters(searchWords), {
            authorization: true
        })
            .subscribe((searchResults: Array<SearchResultItem>) => {

                // As long as search results were returned
                if (searchResults) {
                    searchResults.forEach(x => {
                        this.thisSearchArray.push(this.getSearchResultItem(x));
                    })
                }
            });
    }



    // ====================================================================( IS DISABLED )==================================================================== \\

    isDisabled(disabledUpdateProperty: keyof ListUpdate): boolean {
        // If we're in list mode
        if (!this.searchMode) {

            // As long as the update is not null
            if (this.listUpdate) {
                // Update it
                return this.listUpdate[disabledUpdateProperty] as boolean;
            }

            // If we're in search mode
        } else if (this.searchMode && this.thisSearchArray.length > 0) {

            // As long as the search update is not null
            if (this.searchUpdate) {
                // Update it
                return this.searchUpdate[disabledUpdateProperty] as boolean;
            }
        }
        // Otherwise, set as disabled
        return true;
    }



    // =====================================================================( ON ESCAPE )===================================================================== \\

    onEscape(): void {
        if (
            // List
            (!this.searchMode &&
                this.listComponent.listManager.selectedItem == null &&
                this.listComponent.listManager.editedItem == null &&
                !this.listComponent.listManager.promptOpen)

            ||

            // Search No Results
            (this.searchMode && this.thisSearchArray.length == 0)

            ||

            // Search With Results
            (this.searchMode && this.thisSearchArray.length > 0 &&
                this.searchComponent.listManager.selectedItem == null &&
                this.searchComponent.listManager.editedItem == null &&
                !this.searchComponent.listManager.promptOpen))

            this.onClose.next();
    }



    // ====================================================================( SEARCH ICON )==================================================================== \\

    public get searchIcon(): string {
        return !this.searchMode ? 'fas fa-search' : 'fa fa-list';
    }



    // ======================================================================( GET ITEM )====================================================================== \\

    getItem(x: ListItem) {
        return {
            id: x.id,
            name: x.name
        }
    }



    // ================================================================( GET ITEM PARAMETERS )================================================================= \\

    getItemParameters(): Array<KeyValue<any, any>> {
        return [];
    }



    // ===============================================================( GET SEARCH RESULT ITEM )============================================================== \\

    getSearchResultItem(x: SearchResultItem) {
        return {
            id: x.id,
            name: x.name
        }
    }



    // ===========================================================( GET SEARCH RESULTS PARAMETERS )=========================================================== \\

    getSearchResultsParameters(searchTerm: string): Array<KeyValue<any, any>> {
        return [{ key: 'searchTerm', value: searchTerm }];
    }



    // =========================================================( GET EDITED SEARCH ITEM PARAMETERS )========================================================= \\

    getEditedSearchItemParameters(searchUpdate: ListUpdate) {
        return {
            id: searchUpdate.id,
            name: searchUpdate.name
        }
    }



    // ============================================================( GET DELETED ITEM PARAMETERS )============================================================ \\

    getDeletedItemParameters(deletedItem: ListItem) {
        return {
            id: deletedItem.id
        }
    }



    // ===============================================================( GET DATA SERVICE PATH )=============================================================== \\

    getDataServicePath() {
        return 'api/' + this.dataServicePath;
    }
}