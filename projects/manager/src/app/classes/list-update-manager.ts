import { KeyValue } from "@angular/common";
import { Directive } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { DataService } from "common";
import { debounceTime, fromEvent, Subject, Subscription } from "rxjs";
import { ListComponent } from "../components/lists/list/list.component";
import { ListUpdateService } from "../services/list-update/list-update.service";
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
    public addIconButtonTitle!: string
    public listComponent!: ListComponent;
    public searchComponent!: ListComponent;
    public listUpdateService!: ListUpdateService;
    public searchInputSubscription!: Subscription;
    public selectLastSelectedItemOnOpen!: boolean;
    public editIconButtonTitle: string = 'Rename';
    public deleteIconButtonTitle: string = 'Delete';
    public searchIconButtonTitle: string = 'Search';
    public onClose: Subject<void> = new Subject<void>();
    public searchOptions: ListOptions = new ListOptions();
    public listOptions: ListOptions = new ListOptions();
    public thisArray: Array<ListItem> = new Array<ListItem>();
    public otherArray: Array<ListItem> = new Array<ListItem>();
    public thisSearchList: Array<ListItem> = new Array<ListItem>();
    public otherSearchList: Array<ListItem> = new Array<ListItem>();
    public get listUpdate(): ListUpdate { return this._listUpdate; }
    public get searchUpdate(): ListUpdate { return this._searchListUpdate; }
    public set listUpdate(listUpdate: ListUpdate) { this.onListUpdate(listUpdate); }
    public set searchUpdate(searchUpdate: ListUpdate) { this.onSearchListUpdate(searchUpdate); }
    public get itemType(): string { return this._itemType; }
    public set itemType(v: string) { this._itemType = v; this.addIconButtonTitle = 'Add ' + v; }


    // ====================================================================( CONSTRUCTOR )==================================================================== \\

    constructor(public dataService: DataService, public sanitizer: DomSanitizer) {

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
            this.dataService.get<Array<ListItem>>('api/' + this.dataServicePath, this.getItemParameters())
                .subscribe((thisArray: Array<ListItem>) => {
                    thisArray.forEach(x => {
                        this.thisArray.push(this.getItem(x));
                        if (this.getOtherItem(x)) this.otherArray.push(this.getOtherItem(x));
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
                    this.listComponent.listManager.onItemDown(selectedItem);
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
            this.thisSearchList.splice(0, this.thisSearchList.length);
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
                    this.listComponent.overButton = true;
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
            this.listComponent.edit();
            this.addIconButtonTitle = 'Add';
            this.editIconButtonTitle = 'Rename';
            this.deleteIconButtonTitle = 'Delete';
        } else {

            if (this.thisSearchList.length > 0) {
                this.searchComponent.edit();
                this.editIconButtonTitle = 'Rename';
                this.deleteIconButtonTitle = 'Delete';
            }
        }
    }



    // ======================================================================( DELETE )======================================================================= \\

    delete() {
        if (!this.searchMode) {
            this.listComponent.delete();
        } else {
            if (this.thisSearchList.length > 0) this.searchComponent.delete();
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
        if (listUpdate.type == ListUpdateType.Delete) this.onItemDelete(listUpdate.deletedItems![0]);
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
        if (searchUpdate.type == ListUpdateType.Delete) this.onSearchItemDelete(searchUpdate.deletedItems![0]);
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

    private listAddId: number = 1000;
    onItemAdd(listUpdate: ListUpdate) {
        this.listAddId++;
        // ********* commited Data Service *********
        // this.dataService.post<number>('api/' + this.dataServicePath, {
        //     name: listUpdate.name
        // }).subscribe((id: number) => {
        this.thisArray[listUpdate.index!].id = this.listAddId//id;
        this.sort(this.addItem(this.otherArray, listUpdate.index!, this.thisArray[listUpdate.index!]), this.otherArray);
        // });
    }



    // ======================================================================( ADD ITEM )===================================================================== \\

    addItem(list: Array<ListItem>, index: number, item: ListItem): ListItem {
        list.splice(index, 0, {
            id: item.id,
            name: item.name
        })
        return list[index];
    }



    // ===================================================================( ON ITEM EDIT )==================================================================== \\

    onItemEdit(listUpdate: ListUpdate) {
        // ********* commited Data Service *********
        // this.dataService.put('api/' + this.dataServicePath, {
        //     id: listUpdate.id,
        //     name: listUpdate.name
        // }).subscribe();
        this.sort(this.editItem(this.otherArray, listUpdate, 0), this.otherArray);
        this.editItem(this.otherSearchList, listUpdate, this.parentSearchType);
    }



    // ================================================================( ON SEARCH ITEM EDIT )================================================================ \\

    onSearchItemEdit(searchUpdate: ListUpdate) {
        // ********* commited Data Service *********
        // this.dataService.put('api/' + this.dataServicePath, {
        //     id: searchUpdate.id,
        //     name: searchUpdate.values![0].name
        // }).subscribe();
        this.sort(this.editItem(this.thisArray, searchUpdate, 0), this.thisArray);
        this.sort(this.editItem(this.otherArray, searchUpdate, 0), this.otherArray);
        this.editItem(this.otherSearchList, searchUpdate, this.parentSearchType);
    }



    // =====================================================================( EDIT ITEM )===================================================================== \\

    editItem(list: Array<ListItem>, update: ListUpdate, type?: number | string): ListItem {
        const editedItem: ListItem = list.find(x => x.id == update.id)!;
        if (editedItem) editedItem.name = update.name;
        return editedItem;
    }



    // ========================================================================( SORT )======================================================================= \\

    sort(item: ListItem, array: Array<ListItem>) {
        array.sort((a, b) => (a.name! > b.name!) ? 1 : -1);
    }

    

    // ==================================================================( ON ITEM VERIFY )=================================================================== \\

    onItemVerify(listUpdate: ListUpdate) {
        let matchFound: boolean = false;

        // Loop through each parent item and check for a duplicate
        this.thisArray.forEach(x => {
            if (x.name?.toLowerCase() == listUpdate.name?.toLowerCase()) {
                matchFound = true;
            }
        })

        // If no match was found
        if (!matchFound) {
            this.listComponent.commitAddEdit();

            // If a match was found
        } else {
            this.listOptions.duplicatePrompt!.title = 'Duplicate ' + this.itemType;
            this.listOptions.duplicatePrompt!.message = this.sanitizer.bypassSecurityTrustHtml('A ' + this.itemType + ' with the name <span style="color: #ffba00">\"' + listUpdate.name + '\"</span> already exists. Please choose a different name.');
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
            this.searchOptions.duplicatePrompt!.message = this.sanitizer.bypassSecurityTrustHtml('A ' + this.itemType + ' with the name <span style="color: #ffba00">\"' + searchUpdate.name + '\"</span> already exists. Please choose a different name.');
            this.searchComponent.openDuplicatePrompt();
        }
    }



    // ===============================================================( DELETE PROMPT MESSAGE )=============================================================== \\

    deletePromptMessage(itemType: string, parentName: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(
            'The ' +
            itemType +
            ' <span style="color: #ffba00">\"' + parentName + '\"</span>' +
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

    onItemDelete(deletedItem: ListItem) {
        // ********* commited Data Service *********
        this.dataService.delete('api/' + this.dataServicePath, {
            id: deletedItem.id
        }).subscribe();
        this.deleteItem(this.otherArray, deletedItem, 0);
        this.deleteItem(this.otherSearchList, deletedItem, this.parentSearchType);
    }



    // ===============================================================( ON SEARCH ITEM DELETE )=============================================================== \\

    onSearchItemDelete(deletedItem: ListItem) {
        // ********* commited Data Service *********
        // this.dataService.delete('api/' + this.dataServicePath, {
        //     id: deletedItem.id
        // }).subscribe();
        this.deleteItem(this.otherSearchList, deletedItem, this.parentSearchType);
        this.deleteItem(this.thisArray, deletedItem, 0);
        this.deleteItem(this.otherArray, deletedItem, 0);
    }



    // ====================================================================( DELETE ITEM )==================================================================== \\

    deleteItem(list: Array<ListItem>, deletedItem: ListItem, type?: number | string) {
        const index = list.findIndex(x => x.id == deletedItem.id && x.name == deletedItem.name);
        // If the index is found, delete the item of that index
        if (index != -1) list.splice(index, 1);
    }



    // ==============================================================( ON SEARCH INPUT CHANGE )=============================================================== \\

    onSearchInputChange(searchInput: any) {
        if (searchInput.value.length == 1) {
            this.getSearchResults(searchInput.value);
        } else if (searchInput.value.length == 0) {
            this.thisSearchList.splice(0, this.thisSearchList.length);
        }
    }



    // ================================================================( GET SEARCH RESULTS )================================================================= \\

    getSearchResults(searchWords: string) {
        this.thisSearchList.splice(0, this.thisSearchList.length);
        this.dataService.get<Array<SearchResultItem>>('api/' + this.dataServicePath + '/Search', this.getSearchResultsParameters(searchWords))
            .subscribe((searchResults: Array<SearchResultItem>) => {

                // As long as search results were returned
                if (searchResults) {
                    searchResults.forEach(x => {
                        this.thisSearchList.push(this.getSearchResultItem(x));
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
        } else if (this.searchMode && this.thisSearchList.length > 0) {

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
            (this.searchMode && this.thisSearchList.length == 0)

            ||

            // Search With Results
            (this.searchMode && this.thisSearchList.length > 0 &&
                this.searchComponent.listManager.selectedItem == null &&
                this.searchComponent.listManager.editedItem == null &&
                !this.searchComponent.listManager.promptOpen))

            this.onClose.next();
    }



    // ====================================================================( OVER BUTTON )==================================================================== \\

    private _overButton!: boolean;
    public get overButton(): boolean {
        return this._overButton;
    }
    public set overButton(v: boolean) {
        this._overButton = v;

        if (!this.searchMode) {
            this.listComponent.overButton = v;
        } else {

            if (this.thisSearchList.length > 0) {
                this.searchComponent.overButton = v;
            }
        }
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



    // ===================================================================( GET OTHER ITEM )=================================================================== \\

    getOtherItem(x: ListItem) {
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

    getSearchResultsParameters(searchWords: string): Array<KeyValue<any, any>> {
        return [{ key: 'searchWords', value: searchWords }];
    }
}