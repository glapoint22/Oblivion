import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { DataService } from "common";
import { debounceTime, fromEvent, Subject, Subscription } from "rxjs";
import { ListComponent } from "../components/lists/list/list.component";
import { NewListUpdateService } from "../services/new-list-update/new-list-update.service";
import { ListUpdateType, MenuOptionType, SortType } from "./enums";
import { ListItem } from "./list-item";
import { ListOptions } from "./list-options";
import { ListUpdate } from "./list-update";
import { MultiColumnItem } from "./multi-column-item";
import { MultiColumnListUpdate } from "./multi-column-list-update";
import { SearchResultItem } from "./search-result-item";

export class NewListUpdateManager {
    // private
    private _listUpdate!: ListUpdate;
    private _searchUpdate!: MultiColumnListUpdate;

    // Public
    // public childType!: string;
    public itemType!: string; // parentType
    public sortType!: SortType;
    public searchMode!: boolean;
    // public searchNameWidth!: string;
    // public searchTypeWidth!: string;
    // public childSearchType!: string;
    // public parentSearchType!: string;
    public addIconButtonTitle!: string;
    // public childDataServicePath!: string;
    public searchInput!: HTMLInputElement;
    // public isThreeTierHierarchy!: boolean;
    public dataServicePath!: string; // parentDataServicePath
    public editIconButtonTitle: string = 'Rename';
    public deleteIconButtonTitle: string = 'Delete';
    public searchIconButtonTitle: string = 'Search';
    public newListUpdateService?: NewListUpdateService; // listUpdateService: ListUpdateService
    public searchInputSubscription!: Subscription;
    public selectLastSelectedItemOnOpen!: boolean;
    // public collapseHierarchyOnOpen: boolean = true;
    public listComponent!: ListComponent; // hierarchyComponent: HierarchyComponent
    public searchComponent!: ListComponent; // searchComponent: MultiColumnListComponent
    // public isSecondLevelHierarchyItemParent!: boolean;
    public otherListComponent!: ListComponent; // otherHierarchyComponent: HierarchyComponent
    public onClose: Subject<void> = new Subject<void>();
    public searchOptions: ListOptions = new ListOptions();
    public listOptions: ListOptions = new ListOptions(); // hierarchyOptions
    // public onChildrenLoad: Subject<void> = new Subject<void>();
    public thisArray: Array<ListItem> = new Array<ListItem>();
    public otherArray: Array<ListItem> = new Array<ListItem>();
    public thisSortList: Array<ListItem> = new Array<ListItem>();
    public thisSearchList: Array<ListItem> = new Array<ListItem>(); // Array<MultiColumnItem>
    public otherSearchList: Array<ListItem> = new Array<ListItem>(); // Array<MultiColumnItem>
    public get listUpdate(): ListUpdate { return this._listUpdate; }
    public get searchUpdate(): MultiColumnListUpdate { return this._searchUpdate; }
    public set searchUpdate(searchUpdate: MultiColumnListUpdate) { this.onSearchUpdate(searchUpdate); }
    public set listUpdate(listUpdate: ListUpdate) { this.onHierarchyUpdate(listUpdate); }


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
                    // ,
                    // {
                    //     type: MenuOptionType.Divider
                    // },
                    // {
                    //     type: MenuOptionType.MenuItem,
                    //     name: 'Go to Hierarchy',
                    //     shortcut: 'Alt+H',
                    //     optionFunction: this.goToHierarchy
                    // }
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
                        this.thisArray.push({
                            id: x.id,
                            name: x.name,
                            // hierarchyGroupID: 0,
                            // hidden: false,
                            // arrowDown: false
                        })

                        this.otherArray.push({
                            id: x.id,
                            name: x.name,
                            // hierarchyGroupID: 0,
                            // hidden: false,
                            // arrowDown: false
                        })
                    })
                })
        } else {

            // If the hierarchy is set to select the last selected item on open
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

            // If the hierarchy is set to collapse on open, then collapse the hierarchy
            // if (this.collapseHierarchyOnOpen) this.hierarchyComponent.listManager.collapseHierarchy();
        }
        this.sortPendingHierarchyItems();
    }



    // ==================================================================( ON ARROW CLICK )=================================================================== \\

    // onArrowClick(hierarchyUpdate: HierarchyUpdate) {
    //     // If a parent item was expanded and its children has NOT been loaded yet
    //     if (hierarchyUpdate.arrowDown && !hierarchyUpdate.hasChildren) {

    //         // If the hierarchy item is a top level hierarchy item
    //         if (hierarchyUpdate.hierarchyGroupID == 0) {

    //             this.dataService.get<Array<Item>>('api/' + this.childDataServicePath, [{ key: 'parentId', value: hierarchyUpdate.id }])
    //                 .subscribe((children: Array<Item>) => {
    //                     let num = this.hierarchyComponent.listManager.editedItem ? 2 : 1;

    //                     for (let i = children.length - 1; i >= 0; i--) {

    //                         // This Array
    //                         this.thisArray.splice(hierarchyUpdate.index! + num, 0,
    //                             {
    //                                 id: children[i].id,
    //                                 name: children[i].name,
    //                                 hierarchyGroupID: 1,
    //                                 hidden: false,
    //                                 arrowDown: false,
    //                                 isParent: this.isSecondLevelHierarchyItemParent
    //                             }
    //                         )

    //                         // Other Array
    //                         this.otherArray.splice(hierarchyUpdate.index! + 1, 0,
    //                             {
    //                                 id: children[i].id,
    //                                 name: children[i].name,
    //                                 hierarchyGroupID: 1,
    //                                 arrowDown: false,
    //                                 isParent: this.isSecondLevelHierarchyItemParent,
    //                                 hidden: !this.otherArray[hierarchyUpdate.index!].arrowDown,
    //                             }
    //                         )
    //                     }
    //                     this.onChildrenLoad.next();
    //                 })
    //         }

    //         // But if a parent item was expanded and its children has ALREADY been loaded
    //     } else if (hierarchyUpdate.arrowDown && hierarchyUpdate.hasChildren) {
    //         // Sort any pending edited items
    //         this.sortPendingHierarchyItems();
    //     }
    // }



    // ===================================================================( TOGGLE SEARCH )=================================================================== \\

    toggleSearch() {
        this.searchMode = !this.searchMode;

        // If we're toggling to search mode
        if (this.searchMode) {
            this.searchIconButtonTitle = 'Back to Hierarchy';
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

            // If we're toggling back to hierarchy mode
        } else {

            this.searchIconButtonTitle = 'Search';

            window.setTimeout(() => {

                this.sortPendingHierarchyItems();
                this.searchInputSubscription.unsubscribe();


                const selectedItem = this.thisArray.filter(x => x.selectType != null || x.selected == true)[0];
                if (selectedItem) {
                    this.listComponent.listManager.onItemDown(selectedItem);
                    this.listComponent.overButton = true;
                } else {
                    this.onUnselectedHierarchyItem();
                }

                // this.hierarchyComponent.listManager.collapseDisabled = this.hierarchyComponent.listManager.getIsCollapsed();
            })
        }
    }



    // =======================================================================( ADD )========================================================================= \\

    add() {
        this.listComponent.add();
    }



    // // ====================================================================( ADD PARENT )===================================================================== \\

    // addParent() {
    //     this.listComponent.listManager.selectedItem = null!
    //     this.listComponent.add();
    // }



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



    // ======================================================================( COLLAPSE )===================================================================== \\

    // collapse() {
    //     this.hierarchyComponent.collapse();
    // }



    // ================================================================( ON HIERARCHY UPDATE )================================================================ \\

    onHierarchyUpdate(listUpdate: ListUpdate) {
        this._listUpdate = listUpdate;
        if (listUpdate.type == ListUpdateType.Add) this.onHierarchyItemAdd(listUpdate);
        // if (hierarchyUpdate.type == ListUpdateType.ArrowClicked) this.onArrowClick(hierarchyUpdate);
        if (listUpdate.type == ListUpdateType.Edit) this.onHierarchyItemEdit(listUpdate);
        if (listUpdate.type == ListUpdateType.VerifyAddEdit) this.onHierarchyItemVerify(listUpdate);
        if (listUpdate.type == ListUpdateType.SelectedItems) this.onSelectedHierarchyItem(listUpdate);
        if (listUpdate.type == ListUpdateType.UnselectedItems) this.onUnselectedHierarchyItem();
        if (listUpdate.type == ListUpdateType.Delete) this.onHierarchyItemDelete(listUpdate.deletedItems![0]);
        if (listUpdate.type == ListUpdateType.DeletePrompt) this.onHierarchyDeletePrompt(listUpdate.deletedItems![0]);
    }



    // =================================================================( ON SEARCH UPDATE )================================================================== \\

    onSearchUpdate(searchUpdate: MultiColumnListUpdate) {
        this._searchUpdate = searchUpdate;
        if (searchUpdate.type == ListUpdateType.Edit) this.onSearchItemEdit(searchUpdate);
        if (searchUpdate.type == ListUpdateType.VerifyAddEdit) this.onSearchItemVerify(searchUpdate);
        if (searchUpdate.type == ListUpdateType.SelectedItems) this.onSelectedSearchItem(searchUpdate);
        if (searchUpdate.type == ListUpdateType.UnselectedItems) this.onUnselectedSearchItem();
        if (searchUpdate.type == ListUpdateType.Delete) this.onSearchItemDelete(searchUpdate.deletedItems![0]); // searchUpdate.deletedMultiColumnItems![0]
        if (searchUpdate.type == ListUpdateType.DeletePrompt) this.onSearchDeletePrompt(searchUpdate.deletedItems![0]); // searchUpdate.deletedMultiColumnItems![0]
    }



    // ============================================================( ON SELECTED HIERARCHY ITEM )============================================================= \\

    onSelectedHierarchyItem(listUpdate: ListUpdate) {
        // if (listUpdate.selectedItems![0].hierarchyGroupID == 0) {
        // this.addIconButtonTitle = 'Add ' + this.childType;
        this.editIconButtonTitle = 'Rename ' + this.itemType;
        this.deleteIconButtonTitle = 'Delete ' + this.itemType;
        this.listOptions.deletePrompt!.title = 'Delete ' + this.itemType;

        if (this.listOptions.menu) {
            this.listOptions.menu!.menuOptions[0].name = 'Add ' + this.itemType;
            // this.listOptions.menu!.menuOptions[0].optionFunction = this.add;
            // this.listOptions.menu!.menuOptions[1].hidden = false;
            // this.hierarchyOptions.menu!.menuOptions[1].name = 'Add ' + this.childType;
            // this.listOptions.menu!.menuOptions[1].optionFunction = this.add;
            this.listOptions.menu!.menuOptions[1].name = 'Rename ' + this.itemType;
            this.listOptions.menu!.menuOptions[2].name = 'Delete ' + this.itemType;
        }

        // }

        // if (listUpdate.selectedItems![0].hierarchyGroupID == 1) {
        //     // this.addIconButtonTitle = 'Add ' + this.childType;
        //     // this.editIconButtonTitle = 'Rename ' + this.childType;
        //     // this.deleteIconButtonTitle = 'Delete ' + this.childType;
        //     // this.hierarchyOptions.deletePrompt!.title = 'Delete ' + this.childType;

        //     if (this.listOptions.menu) {
        //         // this.hierarchyOptions.menu!.menuOptions[0].name = 'Add ' + this.childType;
        //         this.listOptions.menu!.menuOptions[0].optionFunction = this.add;
        //         this.listOptions.menu!.menuOptions[1].hidden = true;
        //         // this.hierarchyOptions.menu!.menuOptions[3].name = 'Rename ' + this.childType;
        //         // this.hierarchyOptions.menu!.menuOptions[5].name = 'Delete ' + this.childType;
        //     }
        // }
    }



    // ==============================================================( ON SELECTED SEARCH ITEM )============================================================== \\

    onSelectedSearchItem(searchUpdate: MultiColumnListUpdate) {
        // if (searchUpdate.selectedMultiColumnItems![0].values[1].name == this.parentSearchType) {
        this.editIconButtonTitle = 'Rename ' + this.itemType;
        this.deleteIconButtonTitle = 'Delete ' + this.itemType;
        this.searchOptions.deletePrompt!.title = 'Delete ' + this.itemType;

        this.searchOptions.menu!.menuOptions[0].name = 'Rename ' + this.itemType;
        this.searchOptions.menu!.menuOptions[1].name = 'Delete ' + this.itemType;
        // this.searchOptions.menu!.menuOptions[3].name = 'Go to ' + this.itemType + ' in Hierarchy';
        // }

        // if (searchUpdate.selectedMultiColumnItems![0].values[1].name == this.childSearchType) {
        // this.editIconButtonTitle = 'Rename ' + this.childType;
        // this.deleteIconButtonTitle = 'Delete ' + this.childType;
        // this.searchOptions.deletePrompt!.title = 'Delete ' + this.childType;
        // this.searchOptions.menu!.menuOptions[0].name = 'Rename ' + this.childType;
        // this.searchOptions.menu!.menuOptions[2].name = 'Delete ' + this.childType;
        // this.searchOptions.menu!.menuOptions[4].name = 'Go to ' + this.childType + ' in Hierarchy';
        // }
    }



    // ===========================================================( ON UNSELECTED HIERARCHY ITEM )============================================================ \\

    onUnselectedHierarchyItem() {
        this.addIconButtonTitle = 'Add ' + this.itemType;
        this.editIconButtonTitle = 'Rename';
        this.deleteIconButtonTitle = 'Delete';
    }



    // =============================================================( ON UNSELECTED SEARCH ITEM )============================================================= \\

    onUnselectedSearchItem() {
        this.editIconButtonTitle = 'Rename';
        this.deleteIconButtonTitle = 'Delete';
    }



    // ===============================================================( ON HIERARCHY ITEM ADD )=============================================================== \\

    onHierarchyItemAdd(listUpdate: ListUpdate) {

        // Add parent hierarchy item
        // if (listUpdate.hierarchyGroupID == 0) {
        this.dataService.post<number>('api/' + this.dataServicePath, {
            name: listUpdate.name
        }).subscribe((id: number) => {
            this.thisArray[listUpdate.index!].id = id;

            // Other array
            this.otherArray.splice(listUpdate.index!, 0, {
                id: this.thisArray[listUpdate.index!].id,
                hierarchyGroupID: this.thisArray[listUpdate.index!].hierarchyGroupID,
                name: this.thisArray[listUpdate.index!].name
            })
            const addedOtherHierarchyItem: ListItem = this.otherArray.find(x => x.id == this.otherArray[listUpdate.index!].id && x.hierarchyGroupID == this.otherArray[listUpdate.index!].hierarchyGroupID)!;
            this.setSort(addedOtherHierarchyItem);
        });
        // }

        // // Add child hierarchy item
        // if (hierarchyUpdate.hierarchyGroupID == 1) {
        //     const indexOfHierarchyItemParent = this.hierarchyComponent.listManager.getIndexOfHierarchyItemParent(this.thisArray[hierarchyUpdate.index!]);

        //     this.dataService.post<number>('api/' + this.childDataServicePath, {
        //         id: this.thisArray[indexOfHierarchyItemParent].id,
        //         name: hierarchyUpdate.name
        //     }).subscribe((id: number) => {
        //         this.thisArray[hierarchyUpdate.index!].id = id;

        //         // Other array
        //         this.otherArray.splice(hierarchyUpdate.index!, 0, {
        //             id: this.thisArray[hierarchyUpdate.index!].id,
        //             hierarchyGroupID: this.thisArray[hierarchyUpdate.index!].hierarchyGroupID,
        //             name: this.thisArray[hierarchyUpdate.index!].name,
        //             hidden: !this.otherArray[indexOfHierarchyItemParent].arrowDown
        //         })
        //         const addedOtherHierarchyItem: HierarchyItem = this.otherArray.find(x => x.id == this.otherArray[hierarchyUpdate.index!].id && x.hierarchyGroupID == this.otherArray[hierarchyUpdate.index!].hierarchyGroupID)!;
        //         this.setSort(addedOtherHierarchyItem);
        //     })
        // }
    }



    // ==============================================================( ON HIERARCHY ITEM EDIT )=============================================================== \\

    onHierarchyItemEdit(listUpdate: ListUpdate) {
        // Edit parent hierarchy item
        // if (listUpdate.hierarchyGroupID == 0) {


        // this.dataService.put('api/' + this.dataServicePath, {
        //     id: listUpdate.id,
        //     name: listUpdate.name
        // }).subscribe();

        this.editItem(this.otherSearchList, listUpdate);
        // this.setOtherSearchEdit<ListUpdate>(listUpdate);

        // }

        // Edit child hierarchy item
        // if (hierarchyUpdate.hierarchyGroupID == 1) {
        //     this.dataService.put('api/' + this.childDataServicePath, {
        //         id: hierarchyUpdate.id,
        //         name: hierarchyUpdate.name
        //     }).subscribe();

        //     // this.setOtherSearchEdit<HierarchyUpdate>(hierarchyUpdate, this.childSearchType);
        // }
        this.setSort(this.editItem(this.otherArray, listUpdate));
        // this.setOtherHierarchyEdit<ListUpdate>(listUpdate);

    }



    // ================================================================( ON SEARCH ITEM EDIT )================================================================ \\

    onSearchItemEdit(searchUpdate: MultiColumnListUpdate) {
        // Edit parent search item
        // if (searchUpdate.values![1].name == this.parentSearchType) {


        // this.dataService.put('api/' + this.dataServicePath, {
        //     id: searchUpdate.id,
        //     name: searchUpdate.values![0].name
        // }).subscribe();



        // // Find the item in the hierarchy list that we just edited in this search list
        // const editedSearchItem = this.thisArray.find(x => x.id == searchUpdate.id)!;
        // // Then update the name of that item in the hierarchy list to the name of the item we just edited in the search list
        // editedSearchItem.name = searchUpdate.name;
        // // Now add the item we just edited in search mode to a sort list so that when we go back to hierarchy mode we can then sort the hierarchy list based on the items in that sort list
        // this.thisSortList.push(editedSearchItem);


        this.thisSortList.push(this.editItem(this.thisArray, searchUpdate));
        this.setSort(this.editItem(this.otherArray, searchUpdate));
        this.editItem(this.otherSearchList, searchUpdate);

        // Update that same item in the other list
        // this.setOtherHierarchyEdit<ListUpdate>(searchUpdate);
        // this.setOtherSearchEdit<ListUpdate>(searchUpdate);
        // }

        // Edit child search item
        // if (searchUpdate.values![1].name == this.childSearchType) {
        //     this.dataService.put('api/' + this.childDataServicePath, {
        //         id: searchUpdate.id,
        //         name: searchUpdate.values![0].name
        //     }).subscribe();


        //     // Find the item in the hierarchy list that we just edited in this search list
        //     const editedSearchItemChild = this.thisArray.find(x => x.id == searchUpdate.id && x.hierarchyGroupID == 1)!;
        //     // If the item in the hierarchy list was found
        //     if (editedSearchItemChild) {
        //         // Then update the name of that item in the hierarchy list to the name of the item we just edited in the search list
        //         editedSearchItemChild.name = searchUpdate.values![0].name;
        //         // Now add the item we just edited in search mode to a sort list so that when we go back to hierarchy mode we can then sort the hierarchy list based on the items in that sort list
        //         this.thisSortList.push(editedSearchItemChild);
        //     }
        //     // Update that same item in the other list
        //     this.setOtherHierarchyEdit<MultiColumnListUpdate>(searchUpdate, 1);
        //     this.setOtherSearchEdit<MultiColumnListUpdate>(searchUpdate, this.childSearchType);
        // }
    }



    // =====================================================================( EDIT ITEM )===================================================================== \\

    editItem(list: Array<ListItem>, update: ListUpdate, type?: number | string): ListItem {
        const editedItem: ListItem = list.find(x => x.id == update.id)!;
        if (editedItem) editedItem.name = update.name;
        return editedItem;
    }



    // // =============================================================( SET OTHER HIERARCHY EDIT )============================================================== \\

    // setOtherHierarchyEdit<T extends ListUpdate>(update: T, hierarchyGroupID?: number) {
    //     // Find itme in the other hierarchy list that we just edited in this list
    //     // const editedOtherHierarchyItem: ListItem = this.otherArray.find(x => x.id == update.id && x.hierarchyGroupID == hierarchyGroupID)!;

    //     const editedOtherHierarchyItem: ListItem = this.otherArray.find(x => x.id == update.id)!;

    //     // If the item in the other hierarchy list was found
    //     if (editedOtherHierarchyItem) {

    //         // Then update the name of that item in the other list to the name of the item we just edited in this list
    //         // editedOtherHierarchyItem!.name = (update as MultiColumnListUpdate).values ? (update as MultiColumnListUpdate).values![0].name : update.name;



    //         editedOtherHierarchyItem.name = update.name;



    //         // Then sort the other list
    //         this.setSort(editedOtherHierarchyItem);
    //     }
    // }



    // // ===============================================================( SET OTHER SEARCH EDIT )=============================================================== \\

    // setOtherSearchEdit<T extends ListUpdate>(update: T, type?: string) {
    //     // Find itme in the other search list that we just edited in this list
    //     // const editedOtherSearchItem: MultiColumnItem = this.otherSearchList.find(x => x.id == update.id && x.values[1].name == type)!;

    //     const editedOtherSearchItem: ListItem = this.otherSearchList.find(x => x.id == update.id)!;


    //     // If the item in the other search list was found
    //     if (editedOtherSearchItem) {

    //         // Then update the name of that item in the other search list to the name of the item we just edited in this list
    //         // editedOtherSearchItem!.values[0].name = (update as MultiColumnListUpdate).values ? (update as MultiColumnListUpdate).values![0].name : update.name!;



    //         editedOtherSearchItem.name = update.name;
    //     }
    // }



    // =============================================================( SET OTHER HIERARCHY SORT )============================================================== \\

    setSort(otherHierarchyItem: ListItem) {
        if (otherHierarchyItem) {
            // As long as the other hierarchy sort group is NOT hidden
            if (this.otherListComponent) { // **************************************!otherHierarchyItem.hidden && 
                // Then sort the other hierarchy list
                this.otherListComponent.listManager.sort(otherHierarchyItem);

                // But if the other hierarchy sort group is NOT visible
            } else {

                // Make a list of all the items we edited in this hierarchy so that when we go back to the other hierarchy we can then sort those items accordingly
                this.newListUpdateService!.otherSortList.push(otherHierarchyItem!);
                this.newListUpdateService!.targetSortType = this.sortType == SortType.Form ? SortType.Product : SortType.Form;
            }
        }
    }



    // =============================================================( ON HIERARCHY ITEM VERIFY )============================================================== \\

    onHierarchyItemVerify(listUpdate: ListUpdate) {
        
        let matchFound: boolean = false;
        // If we're verifying a parent item
        // if (listUpdate.hierarchyGroupID == 0) {
        // Loop through each parent item and check for a duplicate
        this.thisArray.forEach(x => {
            // if (x.hierarchyGroupID == 0) {
                if (x.name?.toLowerCase() == listUpdate.name?.toLowerCase()) {
                    matchFound = true;
                }
            // }
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
        // }

        // If we're verifying a child item
        // if (hierarchyUpdate.hierarchyGroupID == 1) {
        //     const childItem = this.thisArray.find(x => x.id == hierarchyUpdate.id && x.hierarchyGroupID == 1);
        //     const indexOfParentItem = this.hierarchyComponent.listManager.getIndexOfHierarchyItemParent(childItem!);

        //     // Loop through each child item of the parent item and check for a duplicate
        //     for (let i = indexOfParentItem + 1; i < this.thisArray.length; i++) {
        //         if (this.thisArray[i].hierarchyGroupID == 0) break;
        //         if (this.thisArray[i].name?.toLowerCase() == hierarchyUpdate.name?.toLowerCase()) {
        //             matchFound = true;
        //         }
        //     }

        //     // If no match was found
        //     if (!matchFound) {
        //         this.hierarchyComponent.commitAddEdit();

        //         // If a match was found
        //     } else {
        //         this.hierarchyOptions.duplicatePrompt!.title = 'Duplicate ' + this.childType;
        //         this.hierarchyOptions.duplicatePrompt!.message = this.sanitizer.bypassSecurityTrustHtml('The ' + this.itemType + '<span style="color: #ffba00"> \"' + this.thisArray[indexOfParentItem].name + '\"</span> already contains a ' + this.childType + ' with the name <span style="color: #ffba00">\"' + hierarchyUpdate.name + '\"</span>. Please choose a different name.');
        //         this.hierarchyComponent.openDuplicatePrompt();
        //     }
        // }
    }



    // ===============================================================( ON SEARCH ITEM VERIFY )=============================================================== \\

    onSearchItemVerify(searchUpdate: MultiColumnListUpdate) {
        let matchFound: boolean = false;

        // If we're verifying a parent item
        // if (searchUpdate.values![1].name == this.parentSearchType) {
        // Loop through each parent item and check for a duplicate
        this.thisArray.forEach(x => {
            // if (x.hierarchyGroupID == 0) {
                if (x.name?.toLowerCase() == searchUpdate.name?.toLowerCase()) {
                    matchFound = true;
                }
            // }
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
        // }

        // // If we're verifying a child item
        // if (searchUpdate.values![1].name == this.childSearchType) {

        //     // Query the database to check for a duplicate
        //     this.dataService.get<DuplicateItem>('api/' + this.childDataServicePath + '/CheckDuplicate', [{ key: 'childId', value: searchUpdate.id }, { key: 'childName', value: searchUpdate.name }])
        //         .subscribe((duplicateItem: DuplicateItem) => {

        //             // If no match was found
        //             if (duplicateItem == null) {
        //                 this.searchComponent.commitAddEdit();

        //                 // If a match was found
        //             } else {
        //                 const parentItem = this.thisArray.find(x => x.id == duplicateItem.parentId && x.hierarchyGroupID == 0);
        // this.searchOptions.duplicatePrompt!.title = 'Duplicate ' + this.childType;
        // this.searchOptions.duplicatePrompt!.message = this.sanitizer.bypassSecurityTrustHtml('The ' + this.itemType + '<span style="color: #ffba00"> \"' + parentItem!.name + '\"</span> already contains a ' + this.childType + ' with the name <span style="color: #ffba00">\"' + searchUpdate.name + '\"</span>. Please choose a different name.');
        //                 this.searchComponent.openDuplicatePrompt();
        //             }
        //         })
        // }
    }



    // ===========================================================( DELETE PROMPT PARENT MESSAGE )============================================================ \\

    deletePromptParentMessage(itemType: string, parentName: string): SafeHtml {
        // return this.sanitizer.bypassSecurityTrustHtml(
        //     'The ' +
        //     itemType +
        //     ' <span style="color: #ffba00">\"' + parentName + '\"</span>' +
        //     ' and its contents will be permanently deleted.');

        return this.sanitizer.bypassSecurityTrustHtml(
            'The ' +
            itemType +
            ' <span style="color: #ffba00">\"' + parentName + '\"</span>' +
            ' will be permanently deleted.');
    }



    // ============================================================( DELETE PROMPT CHILD MESSAGE )============================================================ \\

    // deletePromptChildMessage(childType: string, childName: string, itemType: string, parentName: string): SafeHtml {
    //     return this.sanitizer.bypassSecurityTrustHtml(
    //         'The ' +
    //         childType +
    //         ' <span style="color: #ffba00">\"' + childName + '\"</span>' +
    //         ' will be permanently deleted from the '
    //         + itemType +
    //         ' <span style="color: #ffba00">\"' + parentName + '\"</span>' +
    //         '.');
    // }



    // ============================================================( ON HIERARCHY DELETE PROMPT )============================================================= \\

    onHierarchyDeletePrompt(deletedItem: ListItem) {
        // If we're deleting a parent item
        // if (deletedItem.hierarchyGroupID == 0) {
        this.listOptions.deletePrompt!.message = this.deletePromptParentMessage(this.itemType, deletedItem.name!);
        // }

        // If we're deleting a child item
        // if (deletedItem.hierarchyGroupID == 1 && !this.isThreeTierHierarchy) {
        //     const childItem = this.thisArray.find(x => x.id == deletedItem.id && x.hierarchyGroupID == 1);
        //     const indexOfParentItem = this.hierarchyComponent.listManager.getIndexOfHierarchyItemParent(childItem!);
        //     // this.hierarchyOptions.deletePrompt!.message = this.deletePromptChildMessage(this.childType, deletedItem.name!, this.itemType, this.thisArray[indexOfParentItem].name!);
        // }
    }



    // ==============================================================( ON SEARCH DELETE PROMPT )============================================================== \\

    onSearchDeletePrompt(deletedItem: ListItem) { // MultiColumnItem
        // If we're deleting a parent item
        // if (deletedItem.values[1].name == this.parentSearchType) {
        this.searchOptions.deletePrompt!.message = this.deletePromptParentMessage(this.itemType, deletedItem.name!);
        // }

        // // If we're deleting a child item
        // if (deletedItem.values[1].name == this.childSearchType && !this.isThreeTierHierarchy) {

        //     // Prefill the prompt so if the prompt opens before we get the parent name, it won't be an empty prompt
        //     // this.searchOptions.deletePrompt!.message = this.deletePromptChildMessage(this.childType, deletedItem.values[0].name, this.itemType, '');

        //     this.dataService.get<Item>('api/' + this.childDataServicePath + '/Parent', [{ key: 'childId', value: deletedItem.id }])
        //         .subscribe((parentItem: Item) => {
        //             // If the parent name comes back before the propmt is opened
        //             if (!this.searchComponent.listManager.prompt) {
        //                 // this.searchOptions.deletePrompt!.message = this.deletePromptChildMessage(this.childType, deletedItem.values[0].name, this.itemType, parentItem.name!);

        //                 // But if the prompt opens first before the parent name comes back
        //             } else {
        //                 // this.searchComponent.listManager.prompt.message = this.deletePromptChildMessage(this.childType, deletedItem.values[0].name, this.itemType, parentItem.name!);
        //             }
        //         })
        // }
    }



    // =============================================================( ON HIERARCHY ITEM DELETE )============================================================== \\

    onHierarchyItemDelete(deletedItem: ListItem) {
        // If we're deleting a parent item
        // if (deletedItem.hierarchyGroupID == 0) {


        // this.dataService.delete('api/' + this.dataServicePath, {
        //     id: deletedItem.id
        // }).subscribe();


        // }

        // // If we're deleting a child item
        // if (deletedItem.hierarchyGroupID == 1) {
        //     this.dataService.delete('api/' + this.childDataServicePath, {
        //         id: deletedItem.id
        //     }).subscribe();
        // }
        this.deleteItem(this.otherArray, deletedItem);
        this.deleteItem(this.otherSearchList, deletedItem);
    }



    // ===============================================================( ON SEARCH ITEM DELETE )=============================================================== \\

    onSearchItemDelete(deletedItem: ListItem) { // MultiColumnItem
        // If we're deleting a parent item
        // if (deletedItem.values[1].name == this.parentSearchType) {



        // this.dataService.delete('api/' + this.dataServicePath, {
        //     id: deletedItem.id
        // }).subscribe();



        // }

        // If we're deleting a child item
        // if (deletedItem.values[1].name == this.childSearchType) {
        //     this.dataService.delete('api/' + this.childDataServicePath, {
        //         id: deletedItem.id
        //     }).subscribe();
        // }
        // this.deleteChildren(this.thisSearchList, deletedItem, this.thisArray);
        this.deleteItem(this.otherSearchList, deletedItem);
        this.deleteItem(this.thisArray, deletedItem);
        this.deleteItem(this.otherArray, deletedItem);
    }



    // ====================================================================( DELETE ITEM )==================================================================== \\

    deleteItem(list: Array<ListItem>, deletedItem: ListItem, type?: number | string) {
        // Find the index of the item in the list
        // const index = typeof type == 'number' ? list.findIndex(x => x.id == deletedItem.id && x.hierarchyGroupID == type) : list.findIndex(x => x.id == deletedItem.id && (x as MultiColumnItem).values[1].name == type);


        const index = list.findIndex(x => x.id == deletedItem.id && x.name == deletedItem.name);

        // If the index is found, delete the item of that index
        if (index != -1) list.splice(index, 1);

        // If we're deleting a parent item from a search list, then check to see if any of its children is also included in the search list. If so, delete them
        // if (type == this.parentSearchType && list.length > 0) {
        // this.deleteChildren(list as Array<MultiColumnItem>, deletedItem as MultiColumnItem);
        // }
    }



    // ==================================================================( DELETE CHILDREN )================================================================== \\

    // deleteChildren(searchList: Array<MultiColumnItem>, deletedItem: MultiColumnItem, hierarchyList?: Array<ListItem>) {
    // this.dataService.get<Array<MultiColumnItem>>('api/' + this.childDataServicePath, [{ key: 'parentId', value: deletedItem.id }])
    //     .subscribe((children: Array<MultiColumnItem>) => {
    //         children.forEach(x => {
    //             // Check to see if any of the children of the parent item is present in the search list. If so, delete them
    //             // const searchChildIndex = searchList.findIndex(y => y.id == x.id && (y as MultiColumnItem).values[0].name == x.name && (y as MultiColumnItem).values[1].name == this.childSearchType);
    //             // if (searchChildIndex != -1) searchList.splice(searchChildIndex, 1);

    //             // If the hierarchy list has been passed in
    //             if (hierarchyList) {
    //                 // Check to see if any of the children of the parent item is present in the hierarchy list. If so, delete those too
    //                 const hierarchyChildIndex = hierarchyList!.findIndex(y => y.id == x.id && y.name == x.name && y.hierarchyGroupID == 1);
    //                 if (hierarchyChildIndex != -1) hierarchyList.splice(hierarchyChildIndex, 1);
    //             }
    //         })
    //     })
    // }



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
                        this.thisSearchList.push(



                            {
                                id: x.id,
                                name: x.name
                            }


                            //     {

                            //     id: x.id!,
                            //     values: [{ name: x.name!, width: this.searchNameWidth, allowEdit: true }, { name: x.type!, width: this.searchTypeWidth }]
                            // }
                        )
                    })
                }
            });
    }



    // ===========================================================( SORT PENDING HIERARCHY ITEMS )============================================================ \\

    sortPendingHierarchyItems() {
        // If an item was edited in search mode
        if (this.thisSortList.length > 0) {
            // Then we need to sort those items now that we're in hierarchy mode
            this.thisSortList.forEach(x => {
                if (x) { // if (!x.hidden) {
                    this.listComponent.listManager.sort(x);
                    const index = this.thisSortList.indexOf(x);
                    this.thisSortList.splice(index, 1);
                }


                // }
            })
        }

        // But if any items were added or edited from the other list whether it was done in search mode or hierarchy mode
        if (this.newListUpdateService!.otherSortList.length > 0 &&
            this.newListUpdateService!.targetSortType == this.sortType) {

            // Then we need to sort those items now in this hierarchy list
            this.newListUpdateService!.otherSortList.forEach(x => {
                // if (!x.hidden) {
                this.listComponent.listManager.sort(x);
                const index = this.newListUpdateService!.otherSortList.indexOf(x);
                this.newListUpdateService!.otherSortList.splice(index, 1);
                // }
            })
        }
    }



    // ==================================================================( GO TO HIERARCHY )================================================================== \\

    goToHierarchy() {

        // Go to parent item
        // if ((this.searchComponent.listManager.selectedItem as MultiColumnItem).values[1].name == this.parentSearchType) {
        const parentSearchItem: MultiColumnItem = this.searchComponent.listManager.selectedItem as MultiColumnItem;

        // Now go to the hierarchy
        this.searchMode = false;
        window.setTimeout(() => {
            this.searchInputSubscription.unsubscribe();

            // Find and select the parent item
            this.selectItem(parentSearchItem.id, 0);
        })
        // }


        // Go to child item
        // if ((this.searchComponent.listManager.selectedItem as MultiColumnItem).values[1].name == this.childSearchType) {
        //     const child: MultiColumnItem = this.searchComponent.listManager.selectedItem as MultiColumnItem;

        //     // Get the parent item of the selected child item
        //     this.dataService.get<Item>('api/' + this.childDataServicePath + '/Parent', [{ key: 'childId', value: child.id }])
        //         .subscribe((parent: Item) => {

        //             // Now go to the hierarchy
        //             this.searchMode = false;
        //             window.setTimeout(() => {
        //                 this.searchInputSubscription.unsubscribe();
        //                 this.goToParent(parent.id, child.id, this.selectItem, [child.id, 1], this.selectItem, [child.id, 1]);
        //             })
        //         })
        // }
    }



    // ===================================================================( GO TO PARENT )==================================================================== \\

    goToParent(parentId: number, childId: number, func1: Function, func1Parameters: Array<any>, func2: Function, func2Parameters: Array<any>) {
        // // Find the parent in the hierarchy
        // const parent: ListItem = this.thisArray.find(x => x.hierarchyGroupID == 0 && x.id == parentId)!;

        // // If the parent does NOT have its arrow down
        // if (!parent.arrowDown) {

        //     // Check to see if its arrow was ever down and its children has already been loaded
        //     const child: ListItem = this.thisArray.find(x => x.hierarchyGroupID == 1 && x.id == childId)!;

        //     // Then set that arrow of that parent to be down
        //     // this.hierarchyComponent.listManager.onArrowClick(parent);

        //     // If the children has already been loaded
        //     if (child) {
        //         func1.apply(this, func1Parameters);

        //         // But if its children were never loaded
        //     } else {

        //         // Now that the parent's arrow is down, wait for its children to load
        //         // let onChildrenLoadListener = this.onChildrenLoad.subscribe(() => {
        //         //     onChildrenLoadListener.unsubscribe();
        //         //     func2.apply(this, func2Parameters);
        //         // });
        //     }

        //     // If the arrow of the parent is already down
        // } else {

        //     func1.apply(this, func1Parameters);
        // }
    }



    // ====================================================================( SELECT ITEM )==================================================================== \\

    selectItem(itemId: number, hierarchyGroupID: number) {
        // Find the child we're looking for in the hierarchy
        const item: ListItem = this.thisArray.find(x => x.id == itemId && x.hierarchyGroupID == hierarchyGroupID)!;
        // Then select that child
        this.listComponent.listManager.onItemDown(item);
    }



    // ====================================================================( IS DISABLED )==================================================================== \\

    isDisabled(disabledUpdateProperty: keyof ListUpdate | keyof MultiColumnListUpdate): boolean {
        // If we're in hierarchy mode
        if (!this.searchMode) {

            // As long as the hierarchy update is not null
            if (this.listUpdate) {
                // Update it
                let hierarchyDisabledUpdateProperty = disabledUpdateProperty as keyof ListUpdate;
                return this.listUpdate[hierarchyDisabledUpdateProperty] as boolean;
            }

            // If we're in search mode
        } else if (this.searchMode && this.thisSearchList.length > 0) {

            // As long as the search update is not null
            if (this.searchUpdate) {
                // Update it
                let searchDisabledUpdateProperty = disabledUpdateProperty as keyof MultiColumnListUpdate;
                return this.searchUpdate[searchDisabledUpdateProperty] as boolean;
            }
        }
        // Otherwise, set as disabled
        return true;
    }



    // =====================================================================( ON ESCAPE )===================================================================== \\

    onEscape(): void {
        if (
            // Hierarchy
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
}