import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { DataService } from "common";
import { debounceTime, fromEvent, Subject, Subscription } from "rxjs";
import { HierarchyComponent } from "../components/hierarchies/hierarchy/hierarchy.component";
import { MultiColumnListComponent } from "../components/lists/multi-column-list/multi-column-list.component";
import { ListUpdateService } from "../services/list-update/list-update.service";
import { DuplicateItem } from "./duplicate-item";
import { ListUpdateType, MenuOptionType, SortType } from "./enums";
import { HierarchyItem } from "./hierarchy-item";
import { HierarchyUpdate } from "./hierarchy-update";
import { Item } from "./item";
import { ListItem } from "./list-item";
import { ListOptions } from "./list-options";
import { ListUpdate } from "./list-update";
import { MultiColumnItem } from "./multi-column-item";
import { MultiColumnListUpdate } from "./multi-column-list-update";
import { SearchResultItem } from "./search-result-item";

export class ListUpdateManager {
    // private
    private _hierarchyUpdate!: HierarchyUpdate;
    private _searchUpdate!: MultiColumnListUpdate;

    // Public
    public childType!: string;
    public parentType!: string;
    public sortType!: SortType;
    public searchMode!: boolean;
    public searchNameWidth!: string;
    public searchTypeWidth!: string;
    public childSearchType!: string;
    public parentSearchType!: string;
    public addIconButtonTitle!: string;
    public childDataServicePath!: string;
    public searchInput!: HTMLInputElement;
    public isThreeTierHierarchy!: boolean;
    public parentDataServicePath!: string;
    public editIconButtonTitle: string = 'Rename';
    public deleteIconButtonTitle: string = 'Delete';
    public searchIconButtonTitle: string = 'Search';
    public listUpdateService?: ListUpdateService;
    public searchInputSubscription!: Subscription;
    public selectLastSelectedItemOnOpen!: boolean;
    public collapseHierarchyOnOpen: boolean = true;
    public hierarchyComponent!: HierarchyComponent;
    public searchComponent!: MultiColumnListComponent;
    public isSecondLevelHierarchyItemParent!: boolean;
    public otherHierarchyComponent!: HierarchyComponent;
    public onClose: Subject<void> = new Subject<void>();
    public searchOptions: ListOptions = new ListOptions();
    public hierarchyOptions: ListOptions = new ListOptions();
    public onChildrenLoad: Subject<void> = new Subject<void>();
    public thisArray: Array<HierarchyItem> = new Array<HierarchyItem>();
    public otherArray: Array<HierarchyItem> = new Array<HierarchyItem>();
    public thisSortList: Array<HierarchyItem> = new Array<HierarchyItem>();
    public thisSearchList: Array<MultiColumnItem> = new Array<MultiColumnItem>();
    public otherSearchList: Array<MultiColumnItem> = new Array<MultiColumnItem>();
    public get hierarchyUpdate(): HierarchyUpdate { return this._hierarchyUpdate; }
    public get searchUpdate(): MultiColumnListUpdate { return this._searchUpdate; }
    public set searchUpdate(searchUpdate: MultiColumnListUpdate) { this.onSearchUpdate(searchUpdate); }
    public set hierarchyUpdate(hierarchyUpdate: HierarchyUpdate) { this.onHierarchyUpdate(hierarchyUpdate); }


    // ====================================================================( CONSTRUCTOR )==================================================================== \\

    constructor(public dataService: DataService, public sanitizer: DomSanitizer) {

        // ---------- HIERARCHY OPTIONS ---------- \\

        this.hierarchyOptions = {
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
                        type: MenuOptionType.MenuItem
                    },
                    {
                        type: MenuOptionType.MenuItem
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
                        shortcut: 'Ctrl+Alt+R',
                        optionFunction: this.edit
                    },
                    {
                        type: MenuOptionType.MenuItem,
                        shortcut: 'Delete',
                        optionFunction: this.delete
                    },
                    {
                        type: MenuOptionType.MenuItem,
                        name: 'Go to Hierarchy',
                        shortcut: 'Alt+H',
                        optionFunction: this.goToHierarchy
                    }
                ]
            }
        }
    }



    // ======================================================================( ON OPEN )====================================================================== \\

    onOpen() {
        this.addIconButtonTitle = 'Add ' + this.parentType;
        if (this.thisArray.length == 0) {
            this.dataService.get<Array<HierarchyItem>>('api/' + this.parentDataServicePath)
                .subscribe((thisArray: Array<HierarchyItem>) => {
                    thisArray.forEach(x => {
                        this.thisArray.push({
                            id: x.id,
                            name: x.name,
                            hierarchyGroupID: 0,
                            hidden: false,
                            arrowDown: false
                        })

                        this.otherArray.push({
                            id: x.id,
                            name: x.name,
                            hierarchyGroupID: 0,
                            hidden: false,
                            arrowDown: false
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
                    this.hierarchyComponent.listManager.onItemDown(selectedItem);
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
            if (this.collapseHierarchyOnOpen) this.hierarchyComponent.listManager.collapseHierarchy();
        }
        this.sortPendingHierarchyItems();
    }



    // ==================================================================( ON ARROW CLICK )=================================================================== \\

    onArrowClick(hierarchyUpdate: HierarchyUpdate) {
        // If a parent item was expanded and its children hasn't been loaded yet
        if (hierarchyUpdate.arrowDown && !hierarchyUpdate.hasChildren) {

            // If the hierarchy item is a top level hierarchy item
            if (hierarchyUpdate.hierarchyGroupID == 0) {

                this.dataService.get<Array<Item>>('api/' + this.childDataServicePath, [{ key: 'parentId', value: hierarchyUpdate.id }])
                    .subscribe((children: Array<Item>) => {
                        let num = this.hierarchyComponent.listManager.editedItem ? 2 : 1;

                        for (let i = children.length - 1; i >= 0; i--) {

                            // This Array
                            this.thisArray.splice(hierarchyUpdate.index! + num, 0,
                                {
                                    id: children[i].id,
                                    name: children[i].name,
                                    hierarchyGroupID: 1,
                                    hidden: false,
                                    arrowDown: false,
                                    isParent: this.isSecondLevelHierarchyItemParent
                                }
                            )

                            // Other Array
                            this.otherArray.splice(hierarchyUpdate.index! + 1, 0,
                                {
                                    id: children[i].id,
                                    name: children[i].name,
                                    hierarchyGroupID: 1,
                                    arrowDown: false,
                                    isParent: this.isSecondLevelHierarchyItemParent,
                                    hidden: !this.otherArray[hierarchyUpdate.index!].arrowDown,
                                }
                            )
                        }
                        this.onChildrenLoad.next();
                    })
            }



        } else if (hierarchyUpdate.arrowDown && hierarchyUpdate.hasChildren) {

            let checkForIdentity = (hierarchyUpdate: HierarchyUpdate) => {
                if (!this.thisArray[hierarchyUpdate.index! + 1].identity) {
                    window.setTimeout(() => {
                        checkForIdentity(hierarchyUpdate);
                    })
                } else {
                    this.sortPendingHierarchyItems();
                }
            }
            checkForIdentity(hierarchyUpdate);
        }
    }



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
                    this.hierarchyComponent.listManager.onItemDown(selectedItem);
                    this.hierarchyComponent.overButton = true;
                } else {
                    this.onUnselectedHierarchyItem();
                }

                this.hierarchyComponent.listManager.collapseDisabled = this.hierarchyComponent.listManager.getIsCollapsed();
            })
        }
    }



    // =======================================================================( ADD )========================================================================= \\

    add() {
        this.hierarchyComponent.add();
    }



    // ====================================================================( ADD PARENT )===================================================================== \\

    addParent() {
        this.hierarchyComponent.listManager.selectedItem = null!
        this.hierarchyComponent.add();
    }



    // =======================================================================( EDIT )======================================================================== \\

    edit() {
        if (!this.searchMode) {
            this.hierarchyComponent.edit();
        } else {

            if (this.thisSearchList.length > 0) this.searchComponent.edit();
        }
    }



    // ======================================================================( DELETE )======================================================================= \\

    delete() {
        if (!this.searchMode) {
            this.hierarchyComponent.delete();
        } else {
            if (this.thisSearchList.length > 0) this.searchComponent.delete();
        }
    }



    // ======================================================================( COLLAPSE )===================================================================== \\

    collapse() {
        this.hierarchyComponent.collapse();
    }



    // ================================================================( ON HIERARCHY UPDATE )================================================================ \\

    onHierarchyUpdate(hierarchyUpdate: HierarchyUpdate) {
        this._hierarchyUpdate = hierarchyUpdate;
        if (hierarchyUpdate.type == ListUpdateType.Add) this.onHierarchyItemAdd(hierarchyUpdate);
        if (hierarchyUpdate.type == ListUpdateType.ArrowClicked) this.onArrowClick(hierarchyUpdate);
        if (hierarchyUpdate.type == ListUpdateType.Edit) this.onHierarchyItemEdit(hierarchyUpdate);
        if (hierarchyUpdate.type == ListUpdateType.VerifyAddEdit) this.onHierarchyItemVerify(hierarchyUpdate);
        if (hierarchyUpdate.type == ListUpdateType.SelectedItems) this.onSelectedHierarchyItem(hierarchyUpdate);
        if (hierarchyUpdate.type == ListUpdateType.UnselectedItems) this.onUnselectedHierarchyItem();
        if (hierarchyUpdate.type == ListUpdateType.Delete) this.onHierarchyItemDelete(hierarchyUpdate.deletedItems![0]);
        if (hierarchyUpdate.type == ListUpdateType.DeletePrompt) this.onHierarchyDeletePrompt(hierarchyUpdate.deletedItems![0]);
    }



    // =================================================================( ON SEARCH UPDATE )================================================================== \\

    onSearchUpdate(searchUpdate: MultiColumnListUpdate) {
        this._searchUpdate = searchUpdate;
        if (searchUpdate.type == ListUpdateType.Edit) this.onSearchItemEdit(searchUpdate);
        if (searchUpdate.type == ListUpdateType.VerifyAddEdit) this.onSearchItemVerify(searchUpdate);
        if (searchUpdate.type == ListUpdateType.SelectedItems) this.onSelectedSearchItem(searchUpdate);
        if (searchUpdate.type == ListUpdateType.UnselectedItems) this.onUnselectedSearchItem();
        if (searchUpdate.type == ListUpdateType.Delete) this.onSearchItemDelete(searchUpdate.deletedMultiColumnItems![0]);
        if (searchUpdate.type == ListUpdateType.DeletePrompt) this.onSearchDeletePrompt(searchUpdate.deletedMultiColumnItems![0]);
    }



    // ============================================================( ON SELECTED HIERARCHY ITEM )============================================================= \\

    onSelectedHierarchyItem(hierarchyUpdate: HierarchyUpdate) {
        if (hierarchyUpdate.selectedItems![0].hierarchyGroupID == 0) {
            this.addIconButtonTitle = 'Add ' + this.childType;
            this.editIconButtonTitle = 'Rename ' + this.parentType;
            this.deleteIconButtonTitle = 'Delete ' + this.parentType;
            this.hierarchyOptions.deletePrompt!.title = 'Delete ' + this.parentType;

            if (this.hierarchyOptions.menu) {
                this.hierarchyOptions.menu!.menuOptions[0].name = 'Add ' + this.parentType;
                this.hierarchyOptions.menu!.menuOptions[0].optionFunction = this.addParent;
                this.hierarchyOptions.menu!.menuOptions[1].hidden = false;
                this.hierarchyOptions.menu!.menuOptions[1].name = 'Add ' + this.childType;
                this.hierarchyOptions.menu!.menuOptions[1].optionFunction = this.add;
                this.hierarchyOptions.menu!.menuOptions[2].name = 'Rename ' + this.parentType;
                this.hierarchyOptions.menu!.menuOptions[3].name = 'Delete ' + this.parentType;
            }

        }

        if (hierarchyUpdate.selectedItems![0].hierarchyGroupID == 1) {
            this.addIconButtonTitle = 'Add ' + this.childType;
            this.editIconButtonTitle = 'Rename ' + this.childType;
            this.deleteIconButtonTitle = 'Delete ' + this.childType;
            this.hierarchyOptions.deletePrompt!.title = 'Delete ' + this.childType;

            if (this.hierarchyOptions.menu) {
                this.hierarchyOptions.menu!.menuOptions[0].name = 'Add ' + this.childType;
                this.hierarchyOptions.menu!.menuOptions[0].optionFunction = this.add;
                this.hierarchyOptions.menu!.menuOptions[1].hidden = true;
                this.hierarchyOptions.menu!.menuOptions[2].name = 'Rename ' + this.childType;
                this.hierarchyOptions.menu!.menuOptions[3].name = 'Delete ' + this.childType;
            }
        }
    }



    // ==============================================================( ON SELECTED SEARCH ITEM )============================================================== \\

    onSelectedSearchItem(searchUpdate: MultiColumnListUpdate) {
        if (searchUpdate.selectedMultiColumnItems![0].values[1].name == this.parentSearchType) {
            this.editIconButtonTitle = 'Rename ' + this.parentType;
            this.deleteIconButtonTitle = 'Delete ' + this.parentType;
            this.searchOptions.deletePrompt!.title = 'Delete ' + this.parentType;

            this.searchOptions.menu!.menuOptions[0].name = 'Rename ' + this.parentType;
            this.searchOptions.menu!.menuOptions[1].name = 'Delete ' + this.parentType;
            this.searchOptions.menu!.menuOptions[2].name = 'Go to ' + this.parentType + ' in Hierarchy';
        }

        if (searchUpdate.selectedMultiColumnItems![0].values[1].name == this.childSearchType) {
            this.editIconButtonTitle = 'Rename ' + this.childType;
            this.deleteIconButtonTitle = 'Delete ' + this.childType;
            this.searchOptions.deletePrompt!.title = 'Delete ' + this.childType;
            this.searchOptions.menu!.menuOptions[0].name = 'Rename ' + this.childType;
            this.searchOptions.menu!.menuOptions[1].name = 'Delete ' + this.childType;
            this.searchOptions.menu!.menuOptions[2].name = 'Go to ' + this.childType + ' in Hierarchy';
        }
    }



    // ===========================================================( ON UNSELECTED HIERARCHY ITEM )============================================================ \\

    onUnselectedHierarchyItem() {
        this.addIconButtonTitle = 'Add ' + this.parentType;
        this.editIconButtonTitle = 'Rename';
        this.deleteIconButtonTitle = 'Delete';
    }



    // =============================================================( ON UNSELECTED SEARCH ITEM )============================================================= \\

    onUnselectedSearchItem() {
        this.editIconButtonTitle = 'Rename';
        this.deleteIconButtonTitle = 'Delete';
    }



    // ===============================================================( ON HIERARCHY ITEM ADD )=============================================================== \\

    onHierarchyItemAdd(hierarchyUpdate: HierarchyUpdate) {

        // Add parent hierarchy item
        if (hierarchyUpdate.hierarchyGroupID == 0) {
            this.dataService.post<number>('api/' + this.parentDataServicePath, {
                name: hierarchyUpdate.name
            }).subscribe((id: number) => {
                this.thisArray[hierarchyUpdate.index!].id = id;

                // Other array
                this.otherArray.splice(hierarchyUpdate.index!, 0, {
                    id: this.thisArray[hierarchyUpdate.index!].id,
                    hierarchyGroupID: this.thisArray[hierarchyUpdate.index!].hierarchyGroupID,
                    name: this.thisArray[hierarchyUpdate.index!].name
                })
                const addedOtherHierarchyItem: HierarchyItem = this.otherArray.find(x => x.id == this.otherArray[hierarchyUpdate.index!].id && x.hierarchyGroupID == this.otherArray[hierarchyUpdate.index!].hierarchyGroupID)!;
                this.setOtherHierarchySort(addedOtherHierarchyItem);
            });
        }

        // Add child hierarchy item
        if (hierarchyUpdate.hierarchyGroupID == 1) {
            const indexOfHierarchyItemParent = this.hierarchyComponent.listManager.getIndexOfHierarchyItemParent(this.thisArray[hierarchyUpdate.index!]);

            this.dataService.post<number>('api/' + this.childDataServicePath, {
                id: this.thisArray[indexOfHierarchyItemParent].id,
                name: hierarchyUpdate.name
            }).subscribe((id: number) => {
                this.thisArray[hierarchyUpdate.index!].id = id;

                // Other array
                this.otherArray.splice(hierarchyUpdate.index!, 0, {
                    id: this.thisArray[hierarchyUpdate.index!].id,
                    hierarchyGroupID: this.thisArray[hierarchyUpdate.index!].hierarchyGroupID,
                    name: this.thisArray[hierarchyUpdate.index!].name,
                    hidden: !this.otherArray[indexOfHierarchyItemParent].arrowDown
                })
                const addedOtherHierarchyItem: HierarchyItem = this.otherArray.find(x => x.id == this.otherArray[hierarchyUpdate.index!].id && x.hierarchyGroupID == this.otherArray[hierarchyUpdate.index!].hierarchyGroupID)!;
                this.setOtherHierarchySort(addedOtherHierarchyItem);
            })
        }
    }



    // ==============================================================( ON HIERARCHY ITEM EDIT )=============================================================== \\

    onHierarchyItemEdit(hierarchyUpdate: HierarchyUpdate) {
        // Edit parent hierarchy item
        if (hierarchyUpdate.hierarchyGroupID == 0) {
            this.dataService.put('api/' + this.parentDataServicePath, {
                id: hierarchyUpdate.id,
                name: hierarchyUpdate.name
            }).subscribe();

            this.setOtherSearchEdit<HierarchyUpdate>(hierarchyUpdate, this.parentSearchType);
        }

        // Edit child hierarchy item
        if (hierarchyUpdate.hierarchyGroupID == 1) {
            this.dataService.put('api/' + this.childDataServicePath, {
                id: hierarchyUpdate.id,
                name: hierarchyUpdate.name
            }).subscribe();

            this.setOtherSearchEdit<HierarchyUpdate>(hierarchyUpdate, this.childSearchType);
        }
        this.setOtherHierarchyEdit<HierarchyUpdate>(hierarchyUpdate, hierarchyUpdate.hierarchyGroupID!);

    }



    // ================================================================( ON SEARCH ITEM EDIT )================================================================ \\

    onSearchItemEdit(searchUpdate: MultiColumnListUpdate) {
        // Edit parent search item
        if (searchUpdate.values![1].name == this.parentSearchType) {
            this.dataService.put('api/' + this.parentDataServicePath, {
                id: searchUpdate.id,
                name: searchUpdate.values![0].name
            }).subscribe();

            // Find the item in the hierarchy list that we just edited in this search list
            const editedSearchItem = this.thisArray.find(x => x.id == searchUpdate.id && x.hierarchyGroupID == 0)!;
            // Then update the name of that item in the hierarchy list to the name of the item we just edited in the search list
            editedSearchItem.name = searchUpdate.values![0].name;
            // Now add the item we just edited in search mode to a sort list so that when we go back to hierarchy mode we can then sort the hierarchy list based on the items in that sort list
            this.thisSortList.push(editedSearchItem);
            // Update that same item in the ochyther list
            this.setOtherHierarchyEdit<MultiColumnListUpdate>(searchUpdate, 0);
            this.setOtherSearchEdit<MultiColumnListUpdate>(searchUpdate, this.parentSearchType);
        }

        // Edit child search item
        if (searchUpdate.values![1].name == this.childSearchType) {
            this.dataService.put('api/' + this.childDataServicePath, {
                id: searchUpdate.id,
                name: searchUpdate.values![0].name
            }).subscribe();


            // Find the item in the hierarchy list that we just edited in this search list
            const editedSearchItemChild = this.thisArray.find(x => x.id == searchUpdate.id && x.hierarchyGroupID == 1)!;
            // If the item in the hierarchy list was found
            if (editedSearchItemChild) {
                // Then update the name of that item in the hierarchy list to the name of the item we just edited in the search list
                editedSearchItemChild.name = searchUpdate.values![0].name;
                // Now add the item we just edited in search mode to a sort list so that when we go back to hierarchy mode we can then sort the hierarchy list based on the items in that sort list
                this.thisSortList.push(editedSearchItemChild);
            }
            // Update that same item in the other list
            this.setOtherHierarchyEdit<MultiColumnListUpdate>(searchUpdate, 1);
            this.setOtherSearchEdit<MultiColumnListUpdate>(searchUpdate, this.childSearchType);
        }
    }



    // =============================================================( SET OTHER HIERARCHY EDIT )============================================================== \\

    setOtherHierarchyEdit<T extends ListUpdate>(update: T, hierarchyGroupID: number) {
        // Find itme in the other hierarchy list that we just edited in this list
        const editedOtherHierarchyItem: HierarchyItem = this.otherArray.find(x => x.id == update.id && x.hierarchyGroupID == hierarchyGroupID)!;

        // If the item in the other hierarchy list was found
        if (editedOtherHierarchyItem) {

            // Then update the name of that item in the other list to the name of the item we just edited in this list
            editedOtherHierarchyItem!.name = (update as MultiColumnListUpdate).values ? (update as MultiColumnListUpdate).values![0].name : update.name;
            // Then sort the other list
            this.setOtherHierarchySort(editedOtherHierarchyItem);
        }
    }



    // ===============================================================( SET OTHER SEARCH EDIT )=============================================================== \\

    setOtherSearchEdit<T extends ListUpdate>(update: T, type: string) {
        // Find itme in the other search list that we just edited in this list
        const editedOtherSearchItem: MultiColumnItem = this.otherSearchList.find(x => x.id == update.id && x.values[1].name == type)!;

        // If the item in the other search list was found
        if (editedOtherSearchItem) {

            // Then update the name of that item in the other search list to the name of the item we just edited in this list
            editedOtherSearchItem!.values[0].name = (update as MultiColumnListUpdate).values ? (update as MultiColumnListUpdate).values![0].name : update.name!;
        }
    }



    // =============================================================( SET OTHER HIERARCHY SORT )============================================================== \\

    setOtherHierarchySort(otherHierarchyItem: HierarchyItem) {
        // As long as the other hierarchy sort group is NOT hidden
        if (!otherHierarchyItem.hidden && this.otherHierarchyComponent) {

            // Then sort the other hierarchy list
            this.otherHierarchyComponent.listManager.sort(otherHierarchyItem);

            // But if the other hierarchy sort group is NOT visible
        } else {

            // Make a list of all the items we edited in this hierarchy so that when we go back to the other hierarchy we can then sort those items accordingly
            this.listUpdateService!.otherSortList.push(otherHierarchyItem!);
            this.listUpdateService!.targetSortType = this.sortType == SortType.Form ? SortType.Product : SortType.Form;
        }
    }



    // =============================================================( ON HIERARCHY ITEM VERIFY )============================================================== \\

    onHierarchyItemVerify(hierarchyUpdate: HierarchyUpdate) {
        let matchFound: boolean = false;

        // If we're verifying a parent item
        if (hierarchyUpdate.hierarchyGroupID == 0) {
            // Loop through each parent item and check for a duplicate
            this.thisArray.forEach(x => {
                if (x.hierarchyGroupID == 0) {
                    if (x.name?.toLowerCase() == hierarchyUpdate.name?.toLowerCase()) {
                        matchFound = true;
                    }
                }
            })

            // If no match was found
            if (!matchFound) {
                this.hierarchyComponent.commitAddEdit();

                // If a match was found
            } else {
                this.hierarchyOptions.duplicatePrompt!.title = 'Duplicate ' + this.parentType;
                this.hierarchyOptions.duplicatePrompt!.message = this.sanitizer.bypassSecurityTrustHtml('A ' + this.parentType + ' with the name <span style="color: #ffba00">\"' + hierarchyUpdate.name + '\"</span> already exists. Please choose a different name.');
                this.hierarchyComponent.openDuplicatePrompt();
            }
        }

        // If we're verifying a child item
        if (hierarchyUpdate.hierarchyGroupID == 1) {
            const childItem = this.thisArray.find(x => x.id == hierarchyUpdate.id && x.hierarchyGroupID == 1);
            const indexOfParentItem = this.hierarchyComponent.listManager.getIndexOfHierarchyItemParent(childItem!);

            // Loop through each child item of the parent item and check for a duplicate
            for (let i = indexOfParentItem + 1; i < this.thisArray.length; i++) {
                if (this.thisArray[i].hierarchyGroupID == 0) break;
                if (this.thisArray[i].name?.toLowerCase() == hierarchyUpdate.name?.toLowerCase()) {
                    matchFound = true;
                }
            }

            // If no match was found
            if (!matchFound) {
                this.hierarchyComponent.commitAddEdit();

                // If a match was found
            } else {
                this.hierarchyOptions.duplicatePrompt!.title = 'Duplicate ' + this.childType;
                this.hierarchyOptions.duplicatePrompt!.message = this.sanitizer.bypassSecurityTrustHtml('The ' + this.parentType + '<span style="color: #ffba00"> \"' + this.thisArray[indexOfParentItem].name + '\"</span> already contains a ' + this.childType + ' with the name <span style="color: #ffba00">\"' + hierarchyUpdate.name + '\"</span>. Please choose a different name.');
                this.hierarchyComponent.openDuplicatePrompt();
            }
        }
    }



    // ===============================================================( ON SEARCH ITEM VERIFY )=============================================================== \\

    onSearchItemVerify(searchUpdate: MultiColumnListUpdate) {
        let matchFound: boolean = false;

        // If we're verifying a parent item
        if (searchUpdate.values![1].name == this.parentSearchType) {
            // Loop through each parent item and check for a duplicate
            this.thisArray.forEach(x => {
                if (x.hierarchyGroupID == 0) {
                    if (x.name?.toLowerCase() == searchUpdate.name?.toLowerCase()) {
                        matchFound = true;
                    }
                }
            })

            // If no match was found
            if (!matchFound) {
                this.searchComponent.commitAddEdit();

                // If a match was found
            } else {
                this.searchOptions.duplicatePrompt!.title = 'Duplicate ' + this.parentType;
                this.searchOptions.duplicatePrompt!.message = this.sanitizer.bypassSecurityTrustHtml('A ' + this.parentType + ' with the name <span style="color: #ffba00">\"' + searchUpdate.name + '\"</span> already exists. Please choose a different name.');
                this.searchComponent.openDuplicatePrompt();
            }
        }

        // If we're verifying a child item
        if (searchUpdate.values![1].name == this.childSearchType) {

            // Query the database to check for a duplicate
            this.dataService.get<DuplicateItem>('api/' + this.childDataServicePath + '/CheckDuplicate', [{ key: 'childId', value: searchUpdate.id }, { key: 'childName', value: searchUpdate.name }])
                .subscribe((duplicateItem: DuplicateItem) => {

                    // If no match was found
                    if (duplicateItem == null) {
                        this.searchComponent.commitAddEdit();

                        // If a match was found
                    } else {
                        const parentItem = this.thisArray.find(x => x.id == duplicateItem.parentId && x.hierarchyGroupID == 0);
                        this.searchOptions.duplicatePrompt!.title = 'Duplicate ' + this.childType;
                        this.searchOptions.duplicatePrompt!.message = this.sanitizer.bypassSecurityTrustHtml('The ' + this.parentType + '<span style="color: #ffba00"> \"' + parentItem!.name + '\"</span> already contains a ' + this.childType + ' with the name <span style="color: #ffba00">\"' + searchUpdate.name + '\"</span>. Please choose a different name.');
                        this.searchComponent.openDuplicatePrompt();
                    }
                })
        }
    }



    // ===========================================================( DELETE PROMPT PARENT MESSAGE )============================================================ \\

    deletePromptParentMessage(parentType: string, parentName: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(
            'The ' +
            parentType +
            ' <span style="color: #ffba00">\"' + parentName + '\"</span>' +
            ' and its contents will be permanently deleted.');
    }



    // ============================================================( DELETE PROMPT CHILD MESSAGE )============================================================ \\

    deletePromptChildMessage(childType: string, childName: string, parentType: string, parentName: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(
            'The ' +
            childType +
            ' <span style="color: #ffba00">\"' + childName + '\"</span>' +
            ' will be permanently deleted from the '
            + parentType +
            ' <span style="color: #ffba00">\"' + parentName + '\"</span>' +
            '.');
    }



    // ============================================================( ON HIERARCHY DELETE PROMPT )============================================================= \\

    onHierarchyDeletePrompt(deletedItem: HierarchyItem) {
        // If we're deleting a parent item
        if (deletedItem.hierarchyGroupID == 0) {
            this.hierarchyOptions.deletePrompt!.message = this.deletePromptParentMessage(this.parentType, deletedItem.name!);
        }

        // If we're deleting a child item
        if (deletedItem.hierarchyGroupID == 1 && !this.isThreeTierHierarchy) {
            const childItem = this.thisArray.find(x => x.id == deletedItem.id && x.hierarchyGroupID == 1);
            const indexOfParentItem = this.hierarchyComponent.listManager.getIndexOfHierarchyItemParent(childItem!);
            this.hierarchyOptions.deletePrompt!.message = this.deletePromptChildMessage(this.childType, deletedItem.name!, this.parentType, this.thisArray[indexOfParentItem].name!);
        }
    }



    // ==============================================================( ON SEARCH DELETE PROMPT )============================================================== \\

    onSearchDeletePrompt(deletedItem: MultiColumnItem) {
        // If we're deleting a parent item
        if (deletedItem.values[1].name == this.parentSearchType) {
            this.searchOptions.deletePrompt!.message = this.deletePromptParentMessage(this.parentType, deletedItem.values[0].name);
        }

        // If we're deleting a child item
        if (deletedItem.values[1].name == this.childSearchType && !this.isThreeTierHierarchy) {

            // Prefill the prompt so if the prompt opens before we get the parent name, it won't be an empty prompt
            this.searchOptions.deletePrompt!.message = this.deletePromptChildMessage(this.childType, deletedItem.values[0].name, this.parentType, '');

            this.dataService.get<Item>('api/' + this.childDataServicePath + '/Parent', [{ key: 'childId', value: deletedItem.id }])
                .subscribe((parentItem: Item) => {
                    // If the parent name comes back before the propmt is opened
                    if (!this.searchComponent.listManager.prompt) {
                        this.searchOptions.deletePrompt!.message = this.deletePromptChildMessage(this.childType, deletedItem.values[0].name, this.parentType, parentItem.name!);

                        // But if the prompt opens first before the parent name comes back
                    } else {
                        this.searchComponent.listManager.prompt.message = this.deletePromptChildMessage(this.childType, deletedItem.values[0].name, this.parentType, parentItem.name!);
                    }
                })
        }
    }



    // =============================================================( ON HIERARCHY ITEM DELETE )============================================================== \\

    onHierarchyItemDelete(deletedItem: HierarchyItem) {
        // If we're deleting a parent item
        if (deletedItem.hierarchyGroupID == 0) {
            this.dataService.delete('api/' + this.parentDataServicePath, {
                id: deletedItem.id
            }).subscribe();
        }

        // If we're deleting a child item
        if (deletedItem.hierarchyGroupID == 1) {
            this.dataService.delete('api/' + this.childDataServicePath, {
                id: deletedItem.id
            }).subscribe();
        }
        this.deleteItem<HierarchyItem>(this.otherArray, deletedItem, deletedItem.hierarchyGroupID!);
        this.deleteItem<MultiColumnItem>(this.otherSearchList, deletedItem as MultiColumnItem, deletedItem.hierarchyGroupID == 0 ? this.parentSearchType : this.childSearchType);
    }



    // ===============================================================( ON SEARCH ITEM DELETE )=============================================================== \\

    onSearchItemDelete(deletedItem: MultiColumnItem) {
        // If we're deleting a parent item
        if (deletedItem.values[1].name == this.parentSearchType) {
            this.dataService.delete('api/' + this.parentDataServicePath, {
                id: deletedItem.id
            }).subscribe();
        }

        // If we're deleting a child item
        if (deletedItem.values[1].name == this.childSearchType) {
            this.dataService.delete('api/' + this.childDataServicePath, {
                id: deletedItem.id
            }).subscribe();
        }
        this.deleteChildren(this.thisSearchList, deletedItem, this.thisArray);
        this.deleteItem<MultiColumnItem>(this.otherSearchList, deletedItem, deletedItem.values[1].name);
        this.deleteItem<HierarchyItem>(this.thisArray, deletedItem, deletedItem.values[1].name == this.parentSearchType ? 0 : 1);
        this.deleteItem<HierarchyItem>(this.otherArray, deletedItem, deletedItem.values[1].name == this.parentSearchType ? 0 : 1);
    }



    // ====================================================================( DELETE ITEM )==================================================================== \\

    deleteItem<T extends MultiColumnItem | HierarchyItem>(list: Array<T>, deletedItem: T, type: number | string) {
        // Find the index of the item in the list
        const index = typeof type == 'number' ? list.findIndex(x => x.id == deletedItem.id && x.hierarchyGroupID == type) : list.findIndex(x => x.id == deletedItem.id && (x as MultiColumnItem).values[1].name == type);

        // If the index is found, delete the item of that index
        if (index != -1) list.splice(index, 1);

        // If we're deleting a parent item from a search list, then check to see if any of its children is also included in the search list. If so, delete them
        if (type == this.parentSearchType && list.length > 0) {
            this.deleteChildren(list as Array<MultiColumnItem>, deletedItem as MultiColumnItem);
        }
    }



    // ==================================================================( DELETE CHILDREN )================================================================== \\

    deleteChildren(searchList: Array<MultiColumnItem>, deletedItem: MultiColumnItem, hierarchyList?: Array<HierarchyItem>) {
        this.dataService.get<Array<MultiColumnItem>>('api/' + this.childDataServicePath, [{ key: 'parentId', value: deletedItem.id }])
            .subscribe((children: Array<MultiColumnItem>) => {
                children.forEach(x => {
                    // Check to see if any of the children of the parent item is present in the search list. If so, delete them
                    const searchChildIndex = searchList.findIndex(y => y.id == x.id && (y as MultiColumnItem).values[0].name == x.name && (y as MultiColumnItem).values[1].name == this.childSearchType);
                    if (searchChildIndex != -1) searchList.splice(searchChildIndex, 1);

                    // If the hierarchy list has been passed in
                    if (hierarchyList) {
                        // Check to see if any of the children of the parent item is present in the hierarchy list. If so, delete those too
                        const hierarchyChildIndex = hierarchyList!.findIndex(y => y.id == x.id && y.name == x.name && y.hierarchyGroupID == 1);
                        if (hierarchyChildIndex != -1) hierarchyList.splice(hierarchyChildIndex, 1);
                    }
                })
            })
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

        this.dataService.get<Array<SearchResultItem>>('api/' + this.parentDataServicePath + '/Search', [{ key: 'searchWords', value: value }])
            .subscribe((searchResults: Array<SearchResultItem>) => {

                // As long as search results were returned
                if (searchResults) {
                    searchResults.forEach(x => {
                        this.thisSearchList.push({

                            id: x.id!,
                            values: [{ name: x.name!, width: this.searchNameWidth, allowEdit: true }, { name: x.type!, width: this.searchTypeWidth }]
                        })
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
                if (!x.hidden) {
                    this.hierarchyComponent.listManager.sort(x);
                    const index = this.thisSortList.indexOf(x);
                    this.thisSortList.splice(index, 1);
                }
            })
        }

        // But if any items were added or edited from the other list whether it was done in search mode or hierarchy mode
        if (this.listUpdateService!.otherSortList.length > 0 &&
            this.listUpdateService!.targetSortType == this.sortType) {

            // Then we need to sort those items now in this hierarchy list
            this.listUpdateService!.otherSortList.forEach(x => {
                if (!x.hidden) {
                    this.hierarchyComponent.listManager.sort(x);
                    const index = this.listUpdateService!.otherSortList.indexOf(x);
                    this.listUpdateService!.otherSortList.splice(index, 1);
                }
            })
        }
    }



    // ==================================================================( GO TO HIERARCHY )================================================================== \\

    goToHierarchy() {

        // Go to parent item
        if ((this.searchComponent.listManager.selectedItem as MultiColumnItem).values[1].name == this.parentSearchType) {
            const parentSearchItem: MultiColumnItem = this.searchComponent.listManager.selectedItem as MultiColumnItem;

            // Now go to the hierarchy
            this.searchMode = false;
            window.setTimeout(() => {
                this.searchInputSubscription.unsubscribe();

                // Find and select the parent item
                this.selectItem(parentSearchItem.id, 0);
            })
        }


        // Go to child item
        if ((this.searchComponent.listManager.selectedItem as MultiColumnItem).values[1].name == this.childSearchType) {
            const child: MultiColumnItem = this.searchComponent.listManager.selectedItem as MultiColumnItem;

            // Get the parent item of the selected child item
            this.dataService.get<Item>('api/' + this.childDataServicePath + '/Parent', [{ key: 'childId', value: child.id }])
                .subscribe((parent: Item) => {

                    // Now go to the hierarchy
                    this.searchMode = false;
                    window.setTimeout(() => {
                        this.searchInputSubscription.unsubscribe();
                        this.goToParent(parent.id, child.id, this.selectItem, [child.id, 1], this.selectItem, [child.id, 1]);
                    })
                })
        }
    }



    // ===================================================================( GO TO PARENT )==================================================================== \\

    goToParent(parentId: number, childId: number, func1: Function, func1Parameters: Array<any>, func2: Function, func2Parameters: Array<any>) {
        // Find the parent in the hierarchy
        const parent: HierarchyItem = this.thisArray.find(x => x.hierarchyGroupID == 0 && x.id == parentId)!;

        // If the parent does NOT have its arrow down
        if (!parent.arrowDown) {

            // Check to see if its arrow was ever down and its children has already been loaded
            const child: HierarchyItem = this.thisArray.find(x => x.hierarchyGroupID == 1 && x.id == childId)!;

            // Then set that arrow of that parent to be down
            this.hierarchyComponent.listManager.onArrowClick(parent);

            // If the children has already been loaded
            if (child) {
                func1.apply(this, func1Parameters);

                // But if its children were never loaded
            } else {

                // Now that the parent's arrow is down, wait for its children to load
                let onChildrenLoadListener = this.onChildrenLoad.subscribe(() => {
                    onChildrenLoadListener.unsubscribe();
                    func2.apply(this, func2Parameters);
                });
            }

            // If the arrow of the parent is already down
        } else {

            func1.apply(this, func1Parameters);
        }
    }



    // ====================================================================( SELECT ITEM )==================================================================== \\

    selectItem(itemId: number, hierarchyGroupID: number) {
        // Find the child we're looking for in the hierarchy
        const item: HierarchyItem = this.thisArray.find(x => x.id == itemId && x.hierarchyGroupID == hierarchyGroupID)!;
        // Then select that child
        this.hierarchyComponent.listManager.onItemDown(item);
    }



    // ====================================================================( IS DISABLED )==================================================================== \\

    isDisabled(disabledUpdateProperty: keyof HierarchyUpdate | keyof MultiColumnListUpdate): boolean {
        // If we're in hierarchy mode
        if (!this.searchMode) {

            // As long as the hierarchy update is not null
            if (this.hierarchyUpdate) {
                // Update it
                let hierarchyDisabledUpdateProperty = disabledUpdateProperty as keyof HierarchyUpdate;
                return this.hierarchyUpdate[hierarchyDisabledUpdateProperty] as boolean;
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
                this.hierarchyComponent.listManager.selectedItem == null &&
                this.hierarchyComponent.listManager.editedItem == null &&
                !this.hierarchyComponent.listManager.promptOpen)

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
            this.hierarchyComponent.overButton = v;
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