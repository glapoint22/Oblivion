import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { DataService } from "common";
import { debounceTime, fromEvent, Subject, Subscription } from "rxjs";
import { ListComponent } from "../components/lists/list/list.component";
import { NewListUpdateService } from "../services/new-list-update/new-list-update.service";
import { ListUpdateType, MenuOptionType, SortType } from "./enums";
import { ListItem } from "./list-item";
import { ListOptions } from "./list-options";
import { ListUpdate } from "./list-update";
import { SearchResultItem } from "./search-result-item";

export class NewListUpdateManager {
    // private
    private _listUpdate!: ListUpdate;
    private _searchListUpdate!: ListUpdate;

    // Public
    public itemType!: string;
    public sortType!: SortType;
    public searchMode!: boolean;
    public parentSearchType!: string;
    public addIconButtonTitle!: string;
    public searchInput!: HTMLInputElement;
    public dataServicePath!: string;
    public editIconButtonTitle: string = 'Rename';
    public deleteIconButtonTitle: string = 'Delete';
    public searchIconButtonTitle: string = 'Search';
    public newListUpdateService?: NewListUpdateService;
    public searchInputSubscription!: Subscription;
    public selectLastSelectedItemOnOpen!: boolean;
    public listComponent!: ListComponent;
    public searchComponent!: ListComponent;
    public otherListComponent!: ListComponent;
    public onClose: Subject<void> = new Subject<void>();
    public searchOptions: ListOptions = new ListOptions();
    public listOptions: ListOptions = new ListOptions();
    public thisArray: Array<ListItem> = new Array<ListItem>();
    public otherArray: Array<ListItem> = new Array<ListItem>();
    public thisSortList: Array<ListItem> = new Array<ListItem>();
    public thisSearchList: Array<ListItem> = new Array<ListItem>();
    public otherSearchList: Array<ListItem> = new Array<ListItem>();
    public get listUpdate(): ListUpdate { return this._listUpdate; }
    public get searchUpdate(): ListUpdate { return this._searchListUpdate; }
    public set searchUpdate(searchUpdate: ListUpdate) { this.onSearchListUpdate(searchUpdate); }
    public set listUpdate(listUpdate: ListUpdate) { this.onListUpdate(listUpdate); }


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
            sortable: false,

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
        this.addIconButtonTitle = 'Add ' + this.itemType;
        if (this.thisArray.length == 0) {
            this.dataService.get<Array<ListItem>>('api/' + this.dataServicePath)
                .subscribe((thisArray: Array<ListItem>) => {
                    thisArray.forEach(x => {
                        this.thisArray.push(this.newItem(x));
                        this.otherArray.push(this.newItem(x));
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
        this.sortPendingItems();
    }



    // ===================================================================( TOGGLE SEARCH )=================================================================== \\

    toggleSearch() {
        this.searchMode = !this.searchMode;

        // If we're toggling to search mode
        if (this.searchMode) {
            this.searchIconButtonTitle = 'Back to List';
            this.thisSearchList.splice(0, this.thisSearchList.length);
            window.setTimeout(() => {
                this.searchInput!.focus();
                this.searchInputSubscription = fromEvent(this.searchInput, 'input').pipe(debounceTime(500)).subscribe(() => {
                    if (this.searchInput.value.length > 1) {
                        this.getSearchResults(this.searchInput.value);
                    }
                });
            })
            this.onUnselectedSearchItem();

            // If we're toggling back to list mode
        } else {

            this.searchIconButtonTitle = 'Search';

            window.setTimeout(() => {

                this.sortPendingItems();
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

    add() {
        this.listComponent.add();
    }



    // =======================================================================( EDIT )======================================================================== \\

    edit() {
        if (!this.searchMode) {
            this.listComponent.edit();
        } else {

            if (this.thisSearchList.length > 0) this.searchComponent.edit();
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



    // ================================================================( ON HIERARCHY UPDATE )================================================================ \\

    onListUpdate(listUpdate: ListUpdate) {
        this._listUpdate = listUpdate;
        if (listUpdate.type == ListUpdateType.Add) this.onItemAdd(listUpdate);
        if (listUpdate.type == ListUpdateType.Edit) this.onItemEdit(listUpdate);
        if (listUpdate.type == ListUpdateType.VerifyAddEdit) this.onItemVerify(listUpdate);
        if (listUpdate.type == ListUpdateType.SelectedItems) this.onSelectedItem(listUpdate);
        if (listUpdate.type == ListUpdateType.UnselectedItems) this.onUnselectedItem();
        if (listUpdate.type == ListUpdateType.Delete) this.onItemDelete(listUpdate.deletedItems![0]);
        if (listUpdate.type == ListUpdateType.DeletePrompt) this.onDeletePrompt(listUpdate.deletedItems![0]);
    }



    // =================================================================( ON SEARCH UPDATE )================================================================== \\

    onSearchListUpdate(searchUpdate: ListUpdate) {
        this._searchListUpdate = searchUpdate;
        if (searchUpdate.type == ListUpdateType.Edit) this.onSearchItemEdit(searchUpdate);
        if (searchUpdate.type == ListUpdateType.VerifyAddEdit) this.onSearchItemVerify(searchUpdate);
        if (searchUpdate.type == ListUpdateType.SelectedItems) this.onSelectedSearchItem(searchUpdate);
        if (searchUpdate.type == ListUpdateType.UnselectedItems) this.onUnselectedSearchItem();
        if (searchUpdate.type == ListUpdateType.Delete) this.onSearchItemDelete(searchUpdate.deletedItems![0]);
        if (searchUpdate.type == ListUpdateType.DeletePrompt) this.onSearchDeletePrompt(searchUpdate.deletedItems![0]);
    }



    // ============================================================( ON SELECTED HIERARCHY ITEM )============================================================= \\

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



    // ===========================================================( ON UNSELECTED HIERARCHY ITEM )============================================================ \\

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


    addItem(list: Array<ListItem>, index: number, item: ListItem): ListItem {
        list.splice(index, 0, {
            id: item.id,
            name: item.name
        })
        return list[index];
    }


    // ===============================================================( ON HIERARCHY ITEM ADD )=============================================================== \\

    onItemAdd(listUpdate: ListUpdate) {
        // this.dataService.post<number>('api/' + this.dataServicePath, {
        //     name: listUpdate.name
        // }).subscribe((id: number) => {
        this.thisArray[listUpdate.index!].id = 1000//id;
        this.setSort(this.addItem(this.otherArray, listUpdate.index!, this.thisArray[listUpdate.index!]));
        // });
    }



    // ==============================================================( ON HIERARCHY ITEM EDIT )=============================================================== \\

    onItemEdit(listUpdate: ListUpdate) {
        // this.dataService.put('api/' + this.dataServicePath, {
        //     id: listUpdate.id,
        //     name: listUpdate.name
        // }).subscribe();
        this.setSort(this.editItem(this.otherArray, listUpdate, 0));
        this.editItem(this.otherSearchList, listUpdate, this.parentSearchType);
    }



    // ================================================================( ON SEARCH ITEM EDIT )================================================================ \\

    onSearchItemEdit(searchUpdate: ListUpdate) {
        // this.dataService.put('api/' + this.dataServicePath, {
        //     id: searchUpdate.id,
        //     name: searchUpdate.values![0].name
        // }).subscribe();
        this.thisSortList.push(this.editItem(this.thisArray, searchUpdate, 0));
        this.setSort(this.editItem(this.otherArray, searchUpdate, 0));
        this.editItem(this.otherSearchList, searchUpdate, this.parentSearchType);
    }



    // =====================================================================( EDIT ITEM )===================================================================== \\

    editItem(list: Array<ListItem>, update: ListUpdate, type?: number | string): ListItem {
        const editedItem: ListItem = list.find(x => x.id == update.id)!;
        if (editedItem) editedItem.name = update.name;
        return editedItem;
    }



    // =============================================================( SET OTHER HIERARCHY SORT )============================================================== \\

    setSort(otherListItem: ListItem) {
        // As long as the other list item is NOT null
        if (otherListItem) {
            // And as long as the other list Is visible
            if (this.otherListComponent) {
                // Then sort the other list
                this.otherListComponent.listManager.sort(otherListItem);

                // But if the other list is NOT visible
            } else {

                // Make a list of all the items we edited in this list so that when we go back to the other list we can then sort those items accordingly
                this.newListUpdateService!.otherSortList.push(otherListItem!);
                this.newListUpdateService!.targetSortType = this.sortType == SortType.Form ? SortType.Product : SortType.Form;
            }
        }
    }



    // =============================================================( ON HIERARCHY ITEM VERIFY )============================================================== \\

    onItemVerify(listUpdate: ListUpdate) {
        let matchFound: boolean = false;

        // Loop through each parent item and check for a duplicate
        this.thisArray.forEach(x => {
            if (x.name?.toLowerCase() == listUpdate.name?.toLowerCase() && x.index != listUpdate.index) {
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
            if (x.name?.toLowerCase() == searchUpdate.name?.toLowerCase() && x.index != searchUpdate.index) {
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



    // ===========================================================( DELETE PROMPT PARENT MESSAGE )============================================================ \\

    deletePromptMessage(itemType: string, parentName: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(
            'The ' +
            itemType +
            ' <span style="color: #ffba00">\"' + parentName + '\"</span>' +
            ' will be permanently deleted.');
    }



    // ============================================================( ON HIERARCHY DELETE PROMPT )============================================================= \\

    onDeletePrompt(deletedItem: ListItem) {
        this.listOptions.deletePrompt!.message = this.deletePromptMessage(this.itemType, deletedItem.name!);
    }



    // ==============================================================( ON SEARCH DELETE PROMPT )============================================================== \\

    onSearchDeletePrompt(deletedItem: ListItem) {
        this.searchOptions.deletePrompt!.message = this.deletePromptMessage(this.itemType, deletedItem.name!);
    }



    // =============================================================( ON HIERARCHY ITEM DELETE )============================================================== \\

    onItemDelete(deletedItem: ListItem) {
        // this.dataService.delete('api/' + this.dataServicePath, {
        //     id: deletedItem.id
        // }).subscribe();
        this.deleteItem(this.otherArray, deletedItem, 0);
        this.deleteItem(this.otherSearchList, deletedItem, this.parentSearchType);
    }



    // ===============================================================( ON SEARCH ITEM DELETE )=============================================================== \\

    onSearchItemDelete(deletedItem: ListItem) { // MultiColumnItem
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

    getSearchResults(value: string) {
        this.thisSearchList.splice(0, this.thisSearchList.length);

        this.dataService.get<Array<SearchResultItem>>('api/' + this.dataServicePath + '/Search', [{ key: 'searchWords', value: value }])
            .subscribe((searchResults: Array<SearchResultItem>) => {

                // As long as search results were returned
                if (searchResults) {
                    searchResults.forEach(x => {
                        this.thisSearchList.push(this.newSearchItem(x));
                    })
                }
            });
    }



    // ===========================================================( SORT PENDING HIERARCHY ITEMS )============================================================ \\

    sortPendingItems() {
        // If an item was edited in search mode
        if (this.thisSortList.length > 0) {
            // Then we need to sort those items once we return to list mode
            this.thisSortList.forEach(x => {
                // As long as the item that was added to the sort list is NOT null
                if (x) {
                    this.listComponent.listManager.sort(x);
                }
                const index = this.thisSortList.indexOf(x);
                this.thisSortList.splice(index, 1);
            })
        }

        // But if any items were added or edited from the other list whether it was done in search mode or list mode
        if (this.newListUpdateService!.otherSortList.length > 0 &&
            this.newListUpdateService!.targetSortType == this.sortType) {

            // Then we need to sort those items now in this list
            this.newListUpdateService!.otherSortList.forEach(x => {
                this.listComponent.listManager.sort(x);
                const index = this.newListUpdateService!.otherSortList.indexOf(x);
                this.newListUpdateService!.otherSortList.splice(index, 1);
            })
        }
    }



    // ====================================================================( IS DISABLED )==================================================================== \\

    isDisabled(disabledUpdateProperty: keyof ListUpdate): boolean {
        // If we're in list mode
        if (!this.searchMode) {

            // As long as the list update is not null
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


    // ======================================================================( NEW ITEM )===================================================================== \\

    newItem(x: ListItem) {
        return {
            id: x.id,
            name: x.name
        }
    }



    // ==================================================================( NEW SEARCH ITEM )================================================================== \\

    newSearchItem(x: ListItem) {
        return {
            id: x.id,
            name: x.name
        }
    }
}