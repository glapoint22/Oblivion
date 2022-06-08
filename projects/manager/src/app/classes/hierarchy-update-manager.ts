import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { DataService } from "common";
import { Subject } from "rxjs";
import { HierarchyComponent } from "../components/hierarchies/hierarchy/hierarchy.component";
import { MultiColumnListComponent } from "../components/lists/multi-column-list/multi-column-list.component";
import { HierarchyUpdateService } from "../services/hierarchy-update/hierarchy-update.service";
import { DuplicateItem } from "./duplicate-item";
import { ListUpdateType, MenuOptionType, SortType } from "./enums";
import { HierarchyItem } from "./hierarchy-item";
import { HierarchyUpdate } from "./hierarchy-update";
import { Item } from "./item";
import { ListUpdate } from "./list-update";
import { MultiColumnItem } from "./multi-column-item";
import { MultiColumnListUpdate } from "./multi-column-list-update";
import { ListUpdateManager } from "./list-update-manager";
import { SearchResultItem } from "./search-result-item";
import { ListItem } from "./list-item";
import { KeyValue } from "@angular/common";

export class HierarchyUpdateManager extends ListUpdateManager {
    // private
    private _hierarchyUpdate!: HierarchyUpdate;
    private _searchUpdate!: MultiColumnListUpdate;

    // Public
    public childType!: string;
    public searchNameWidth!: string;
    public searchTypeWidth!: string;
    public childSearchType!: string;
    public childDataServicePath!: string;
    public listComponent!: HierarchyComponent;
    public collapseHierarchyOnOpen: boolean = true;
    public otherListComponent!: HierarchyComponent;
    public searchComponent!: MultiColumnListComponent;
    public hierarchyUpdateService!: HierarchyUpdateService;
    public onChildrenLoad: Subject<void> = new Subject<void>();
    public thisArray: Array<HierarchyItem> = new Array<HierarchyItem>();
    public otherArray: Array<HierarchyItem> = new Array<HierarchyItem>();
    public thisSortList: Array<HierarchyItem> = new Array<HierarchyItem>();
    public thisSearchList: Array<MultiColumnItem> = new Array<MultiColumnItem>();
    public otherSearchList: Array<MultiColumnItem> = new Array<MultiColumnItem>();
    public get listUpdate(): HierarchyUpdate { return this._hierarchyUpdate; }
    public get searchUpdate(): MultiColumnListUpdate { return this._searchUpdate; }
    public set listUpdate(listUpdate: HierarchyUpdate) { this.onListUpdate(listUpdate); }
    public set searchUpdate(searchUpdate: MultiColumnListUpdate) { this.onSearchListUpdate(searchUpdate); }


    // ====================================================================( CONSTRUCTOR )==================================================================== \\

    constructor(dataService: DataService, sanitizer: DomSanitizer) {
        super(dataService, sanitizer);

        // ---------- HIERARCHY OPTIONS ---------- \\

        this.listOptions.menu!.menuOptions = [
            {
                type: MenuOptionType.MenuItem
            },
            {
                type: MenuOptionType.MenuItem
            },
            {
                type: MenuOptionType.Divider
            },
            {
                type: MenuOptionType.MenuItem,
                shortcut: 'F2',
                optionFunction: this.edit
            },
            {
                type: MenuOptionType.Divider
            },
            {
                type: MenuOptionType.MenuItem,
                shortcut: 'Delete',
                optionFunction: this.delete
            }
        ]

        // ---------- SEARCH OPTIONS ---------- \\

        this.searchOptions.menu!.menuOptions[2] = {
            type: MenuOptionType.Divider
        }

        this.searchOptions.menu!.menuOptions[3] = {
            type: MenuOptionType.MenuItem,
            name: 'Go to Hierarchy',
            shortcut: 'Alt+H',
            optionFunction: this.goToHierarchy
        }
    }


    // ======================================================================( ON OPEN )====================================================================== \\

    onOpen() {
        super.onOpen();
        if (this.thisArray.length > 0) if (this.collapseHierarchyOnOpen) this.listComponent.listManager.collapseHierarchy();
    }



    // ==================================================================( ON ARROW CLICK )=================================================================== \\

    onArrowClick(hierarchyUpdate: HierarchyUpdate) {
        // If a parent item was expanded and its children has NOT been loaded yet
        if (hierarchyUpdate.arrowDown && !hierarchyUpdate.hasChildren) {

            // If the hierarchy item is a top level hierarchy item
            if (hierarchyUpdate.hierarchyGroupID == 0) {
                this.dataService.get<Array<HierarchyItem>>('api/' + this.childDataServicePath, this.getChildItemParameters(hierarchyUpdate))
                    .subscribe((children: Array<HierarchyItem>) => {
                        window.setTimeout(() => {
                            let num = this.listComponent.listManager.editedItem ? 2 : 1;
                            for (let i = children.length - 1; i >= 0; i--) {
                                this.thisArray.splice(hierarchyUpdate.index! + num, 0, this.getChildItem(children[i]));
                                if (this.getOtherChildItem(children[i], hierarchyUpdate)) this.otherArray.splice(hierarchyUpdate.index! + 1, 0, this.getOtherChildItem(children[i], hierarchyUpdate));
                            }
                            this.onChildrenLoad.next();
                        })
                    })
            }

            // But if a parent item was expanded and its children has ALREADY been loaded
        } else if (hierarchyUpdate.arrowDown && hierarchyUpdate.hasChildren) {
            // Sort any pending edited items
            this.sortPendingItems();
        }
    }



    // ===================================================================( TOGGLE SEARCH )=================================================================== \\

    toggleSearch() {
        super.toggleSearch();
        if (!this.searchMode) {
            window.setTimeout(() => {
                this.listComponent.listManager.collapseDisabled = this.listComponent.listManager.getIsCollapsed();
            })
        }
    }



    // ====================================================================( ADD PARENT )===================================================================== \\

    addParent() {
        this.listComponent.listManager.selectedItem = null!
        this.listComponent.add();
        this.addIconButtonTitle = 'Add';
        this.editIconButtonTitle = 'Rename';
        this.deleteIconButtonTitle = 'Delete';
    }



    // ======================================================================( COLLAPSE )===================================================================== \\

    collapse() {
        this.listComponent.collapse();
    }



    // ==================================================================( ON LIST UPDATE )=================================================================== \\

    onListUpdate(hierarchyUpdate: HierarchyUpdate) {
        super.onListUpdate(hierarchyUpdate);
        this._hierarchyUpdate = hierarchyUpdate;
        if (hierarchyUpdate.type == ListUpdateType.ArrowClicked) this.onArrowClick(hierarchyUpdate);
    }



    // ===============================================================( ON SEARCH LIST UPDATE )=============================================================== \\

    onSearchListUpdate(searchUpdate: MultiColumnListUpdate) {
        this._searchUpdate = searchUpdate;
        if (searchUpdate.type == ListUpdateType.Delete) {
            this.onSearchItemDelete(searchUpdate.deletedMultiColumnItems![0]);
            return;
        }
        if (searchUpdate.type == ListUpdateType.DeletePrompt) {
            this.onSearchDeletePrompt(searchUpdate.deletedMultiColumnItems![0]);
            return;
        }
        super.onSearchListUpdate(searchUpdate);
    }



    // =================================================================( ON SELECTED ITEM )================================================================== \\

    onSelectedItem(hierarchyUpdate: HierarchyUpdate) {
        if (hierarchyUpdate.selectedItems![0].hierarchyGroupID == 0) {
            super.onSelectedItem(hierarchyUpdate);
            this.addIconButtonTitle = 'Add ' + this.childType;
            this.listOptions.menu!.menuOptions[0].optionFunction = this.addParent;
            this.listOptions.menu!.menuOptions[1].hidden = false;
            this.listOptions.menu!.menuOptions[1].name = 'Add ' + this.childType;
            this.listOptions.menu!.menuOptions[1].optionFunction = this.add;
            this.listOptions.menu!.menuOptions[2].hidden = false;
            this.listOptions.menu!.menuOptions[3].name = 'Rename ' + this.itemType;
            this.listOptions.menu!.menuOptions[4].hidden = true;
            this.listOptions.menu!.menuOptions[5].name = 'Delete ' + this.itemType;
        }

        if (hierarchyUpdate.selectedItems![0].hierarchyGroupID == 1) {
            this.addIconButtonTitle = 'Add ' + this.childType;
            this.editIconButtonTitle = 'Rename ' + this.childType;
            this.deleteIconButtonTitle = 'Delete ' + this.childType;
            this.listOptions.deletePrompt!.title = 'Delete ' + this.childType;

            this.listOptions.menu!.menuOptions[0].name = 'Add ' + this.childType;
            this.listOptions.menu!.menuOptions[0].optionFunction = this.add;
            this.listOptions.menu!.menuOptions[1].hidden = true;
            this.listOptions.menu!.menuOptions[2].hidden = true;
            this.listOptions.menu!.menuOptions[3].name = 'Rename ' + this.childType;
            this.listOptions.menu!.menuOptions[4].hidden = true;
            this.listOptions.menu!.menuOptions[5].name = 'Delete ' + this.childType;
        }
    }



    // ==============================================================( ON SELECTED SEARCH ITEM )============================================================== \\

    onSelectedSearchItem(searchUpdate: MultiColumnListUpdate) {
        if (searchUpdate.selectedMultiColumnItems![0].values[1].name == this.parentSearchType) {
            super.onSelectedSearchItem(searchUpdate);
            this.searchOptions.menu!.menuOptions[2].name = 'Delete ' + this.itemType;
            this.searchOptions.menu!.menuOptions[3].name = 'Go to ' + this.itemType + ' in Hierarchy';
        }

        if (searchUpdate.selectedMultiColumnItems![0].values[1].name == this.childSearchType) {
            this.editIconButtonTitle = 'Rename ' + this.childType;
            this.deleteIconButtonTitle = 'Delete ' + this.childType;
            this.searchOptions.deletePrompt!.title = 'Delete ' + this.childType;
            this.searchOptions.menu!.menuOptions[0].name = 'Rename ' + this.childType;
            this.searchOptions.menu!.menuOptions[1].name = 'Delete ' + this.childType;
            this.searchOptions.menu!.menuOptions[3].name = 'Go to ' + this.childType + ' in Hierarchy';
        }
    }



    // ====================================================================( ON ITEM ADD )==================================================================== \\
    private hierarchyAddId: number = 2000;
    onItemAdd(hierarchyUpdate: HierarchyUpdate) {
        this.hierarchyAddId++;
        // Add parent hierarchy item
        if (hierarchyUpdate.hierarchyGroupID == 0) {
            super.onItemAdd(hierarchyUpdate);
        }

        // Add child hierarchy item
        if (hierarchyUpdate.hierarchyGroupID == 1) {
            const indexOfHierarchyItemParent = this.listComponent.listManager.getIndexOfHierarchyItemParent(this.thisArray[hierarchyUpdate.index!]);
            // ********* commited Data Service *********
            // this.dataService.post<number>('api/' + this.childDataServicePath, {
            //     id: this.thisArray[indexOfHierarchyItemParent].id,
            //     name: hierarchyUpdate.name
            // }).subscribe((id: number) => {
            this.thisArray[hierarchyUpdate.index!].id = this.hierarchyAddId//id;
            const addedOtherChildItem: HierarchyItem = this.addItem(this.otherArray, hierarchyUpdate.index!, this.thisArray[hierarchyUpdate.index!]);
            addedOtherChildItem.hidden = !this.otherArray[indexOfHierarchyItemParent].arrowDown;
            this.setSort(addedOtherChildItem);
            // })
        }
    }



    // ======================================================================( ADD ITEM )===================================================================== \\

    addItem(list: Array<HierarchyItem>, index: number, item: HierarchyItem): HierarchyItem {
        list.splice(index, 0, {
            id: item.id,
            name: item.name,
            hierarchyGroupID: item.hierarchyGroupID
        })
        return list[index];
    }



    // ===================================================================( ON ITEM EDIT )==================================================================== \\

    onItemEdit(hierarchyUpdate: HierarchyUpdate) {
        // Edit parent hierarchy item
        if (hierarchyUpdate.hierarchyGroupID == 0) {
            super.onItemEdit(hierarchyUpdate);
        }

        // Edit child hierarchy item
        if (hierarchyUpdate.hierarchyGroupID == 1) {
            // ********* commited Data Service *********
            // this.dataService.put('api/' + this.childDataServicePath, {
            //     id: hierarchyUpdate.id,
            //     name: hierarchyUpdate.name
            // }).subscribe();

            this.setSort(this.editItem(this.otherArray, hierarchyUpdate, 1));
            this.editItem(this.otherSearchList, hierarchyUpdate, this.childSearchType);
        }
    }



    // ================================================================( ON SEARCH ITEM EDIT )================================================================ \\

    onSearchItemEdit(searchUpdate: MultiColumnListUpdate) {
        // Edit parent search item
        if (searchUpdate.values![1].name == this.parentSearchType) {
            super.onSearchItemEdit(searchUpdate);
        }

        // Edit child search item
        if (searchUpdate.values![1].name == this.childSearchType) {
            // ********* commited Data Service *********
            // this.dataService.put('api/' + this.childDataServicePath, {
            //     id: searchUpdate.id,
            //     name: searchUpdate.values![0].name
            // }).subscribe();

            this.thisSortList.push(this.editItem(this.thisArray, searchUpdate, 1));
            this.setSort(this.editItem(this.otherArray, searchUpdate, 1));
            this.editItem(this.otherSearchList, searchUpdate, this.childSearchType);
        }

    }



    // =====================================================================( EDIT ITEM )===================================================================== \\

    editItem(list: Array<HierarchyItem>, update: ListUpdate, type?: number | string): HierarchyItem {
        const editedItem: HierarchyItem = typeof type == 'number' ? list.find(x => x.id == update.id && x.hierarchyGroupID == type)! : list.find(x => x.id == update.id && (x as MultiColumnItem).values[1].name == type)!;

        if (editedItem) {
            // Other hierarchy from this hierarchy
            if (update.name && typeof type == 'number') editedItem.name = update.name;
            // Other search from this hierarchy
            if (update.name && typeof type != 'number') (editedItem as MultiColumnItem).values[0].name = update.name;
            // Other search from this search
            if (!update.name && typeof type != 'number') (editedItem as MultiColumnItem).values[0].name = (update as MultiColumnListUpdate).values![0].name;
            // Other hierarchy from this search and this hierarchy from this search
            if (!update.name && typeof type == 'number') editedItem.name = (update as MultiColumnListUpdate).values![0].name;
        }

        return editedItem;
    }



    // ======================================================================( SET SORT )===================================================================== \\

    setSort(otherHierarchyItem: HierarchyItem) {
        // As long as the other hierarchy item is NOT null
        if (otherHierarchyItem) {
            // And as long as the other hierarchy list IS visible and the other hierarchy item is NOT hidden
            if (this.otherListComponent && !otherHierarchyItem.hidden) {

                // Then sort the other hierarchy list
                this.otherListComponent.listManager.sort(otherHierarchyItem);

                // But if the other hierarchy list is NOT visible or the other hierarchy item IS hidden
            } else {

                // As long as a list is using the hierarchy update service
                if (this.hierarchyUpdateService) {

                    // Make a list of all the items we edited in this hierarchy so that when we go back to the other hierarchy we can then sort those items accordingly
                    this.hierarchyUpdateService.otherSortList.push(otherHierarchyItem!);
                    this.hierarchyUpdateService.targetSortType = this.sortType == SortType.Form ? SortType.Product : SortType.Form;
                }
            }
        }
    }



    // ==================================================================( ON ITEM VERIFY )=================================================================== \\

    onItemVerify(hierarchyUpdate: HierarchyUpdate) {
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
                this.listComponent.commitAddEdit();

                // If a match was found
            } else {
                this.listOptions.duplicatePrompt!.title = 'Duplicate ' + this.itemType;
                this.listOptions.duplicatePrompt!.message = this.sanitizer.bypassSecurityTrustHtml('A ' + this.itemType + ' with the name <span style="color: #ffba00">\"' + hierarchyUpdate.name + '\"</span> already exists. Please choose a different name.');
                this.listComponent.openDuplicatePrompt();
            }
        }

        // If we're verifying a child item
        if (hierarchyUpdate.hierarchyGroupID == 1) {
            const childItem = this.thisArray.find(x => x.id == hierarchyUpdate.id && x.hierarchyGroupID == 1);
            const indexOfParentItem = this.listComponent.listManager.getIndexOfHierarchyItemParent(childItem!);

            // Loop through each child item of the parent item and check for a duplicate
            for (let i = indexOfParentItem + 1; i < this.thisArray.length; i++) {
                if (this.thisArray[i].hierarchyGroupID == 0) break;
                if (this.thisArray[i].name?.toLowerCase() == hierarchyUpdate.name?.toLowerCase()) {
                    matchFound = true;
                }
            }

            // If no match was found
            if (!matchFound) {
                this.listComponent.commitAddEdit();

                // If a match was found
            } else {
                this.listOptions.duplicatePrompt!.title = 'Duplicate ' + this.childType;
                this.listOptions.duplicatePrompt!.message = this.sanitizer.bypassSecurityTrustHtml('The ' + this.itemType + '<span style="color: #ffba00"> \"' + this.thisArray[indexOfParentItem].name + '\"</span> already contains a ' + this.childType + ' with the name <span style="color: #ffba00">\"' + hierarchyUpdate.name + '\"</span>. Please choose a different name.');
                this.listComponent.openDuplicatePrompt();
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
                    if (x.name?.toLowerCase() == searchUpdate.values![0].name.toLowerCase()) {
                        matchFound = true;
                    }
                }
            })

            // If no match was found
            if (!matchFound) {
                this.searchComponent.commitAddEdit();

                // If a match was found
            } else {
                this.searchOptions.duplicatePrompt!.title = 'Duplicate ' + this.itemType;
                this.searchOptions.duplicatePrompt!.message = this.sanitizer.bypassSecurityTrustHtml('A ' + this.itemType + ' with the name <span style="color: #ffba00">\"' + searchUpdate.values![0].name + '\"</span> already exists. Please choose a different name.');
                this.searchComponent.openDuplicatePrompt();
            }
        }

        // If we're verifying a child item
        if (searchUpdate.values![1].name == this.childSearchType) {

            // Query the database to check for a duplicate
            this.dataService.get<DuplicateItem>('api/' + this.childDataServicePath + '/CheckDuplicate', [{ key: 'childId', value: searchUpdate.id }, { key: 'childName', value: searchUpdate.values![0].name }])
                .subscribe((duplicateItem: DuplicateItem) => {

                    // If no match was found
                    if (duplicateItem == null) {
                        this.searchComponent.commitAddEdit();

                        // If a match was found
                    } else {
                        const parentItem = this.thisArray.find(x => x.id == duplicateItem.parentId && x.hierarchyGroupID == 0);
                        this.searchOptions.duplicatePrompt!.title = 'Duplicate ' + this.childType;
                        this.searchOptions.duplicatePrompt!.message = this.sanitizer.bypassSecurityTrustHtml('The ' + this.itemType + '<span style="color: #ffba00"> \"' + parentItem!.name + '\"</span> already contains a ' + this.childType + ' with the name <span style="color: #ffba00">\"' + searchUpdate.values![0].name + '\"</span>. Please choose a different name.');
                        this.searchComponent.openDuplicatePrompt();
                    }
                })
        }
    }



    // ===============================================================( DELETE PROMPT MESSAGE )=============================================================== \\

    deletePromptMessage(itemType: string, parentName: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(
            'The ' +
            itemType +
            ' <span style="color: #ffba00">\"' + parentName + '\"</span>' +
            ' and its contents will be permanently deleted.');
    }



    // ============================================================( DELETE PROMPT CHILD MESSAGE )============================================================ \\

    deletePromptChildMessage(childType: string, childName: string, itemType: string, parentName: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(
            'The ' +
            childType +
            ' <span style="color: #ffba00">\"' + childName + '\"</span>' +
            ' will be permanently deleted from the '
            + itemType +
            ' <span style="color: #ffba00">\"' + parentName + '\"</span>' +
            '.');
    }



    // =================================================================( ON DELETE PROMPT )================================================================== \\

    onDeletePrompt(deletedItem: HierarchyItem) {
        // If we're deleting a parent item
        if (deletedItem.hierarchyGroupID == 0) super.onDeletePrompt(deletedItem);

        // If we're deleting a child item
        if (deletedItem.hierarchyGroupID == 1) {
            const childItem = this.thisArray.find(x => x.id == deletedItem.id && x.hierarchyGroupID == 1);
            const indexOfParentItem = this.listComponent.listManager.getIndexOfHierarchyItemParent(childItem!);
            this.listOptions.deletePrompt!.message = this.deletePromptChildMessage(this.childType, deletedItem.name!, this.itemType, this.thisArray[indexOfParentItem].name!);
        }
    }



    // ==============================================================( ON SEARCH DELETE PROMPT )============================================================== \\

    onSearchDeletePrompt(deletedItem: MultiColumnItem) {
        // If we're deleting a parent item
        if (deletedItem.values[1].name == this.parentSearchType) {
            this.searchOptions.deletePrompt!.message = this.deletePromptMessage(this.itemType, deletedItem.values[0].name);
        }

        // If we're deleting a child item
        if (deletedItem.values[1].name == this.childSearchType) {

            // Prefill the prompt so if the prompt opens before we get the parent name, it won't be an empty prompt
            this.searchOptions.deletePrompt!.message = this.deletePromptChildMessage(this.childType, deletedItem.values[0].name, this.itemType, '');

            this.dataService.get<Item>('api/' + this.childDataServicePath + '/Parent', [{ key: 'childId', value: deletedItem.id }])
                .subscribe((parentItem: Item) => {
                    // If the parent name comes back before the propmt is opened
                    if (!this.searchComponent.listManager.prompt) {
                        this.searchOptions.deletePrompt!.message = this.deletePromptChildMessage(this.childType, deletedItem.values[0].name, this.itemType, parentItem.name!);

                        // But if the prompt opens first before the parent name comes back
                    } else {
                        this.searchComponent.listManager.prompt.message = this.deletePromptChildMessage(this.childType, deletedItem.values[0].name, this.itemType, parentItem.name!);
                    }
                })
        }
    }



    // ==================================================================( ON ITEM DELETE )=================================================================== \\

    onItemDelete(deletedItem: HierarchyItem) {
        // If we're deleting a parent item
        if (deletedItem.hierarchyGroupID == 0) super.onItemDelete(deletedItem);

        // If we're deleting a child item
        if (deletedItem.hierarchyGroupID == 1) {
            // ********* commited Data Service *********
            // this.dataService.delete('api/' + this.childDataServicePath, {
            //     id: deletedItem.id
            // }).subscribe();
            this.deleteItem(this.otherArray, deletedItem, 1);
            this.deleteItem(this.otherSearchList, deletedItem as MultiColumnItem, this.childSearchType);
        }

    }



    // ===============================================================( ON SEARCH ITEM DELETE )=============================================================== \\

    onSearchItemDelete(deletedItem: MultiColumnItem) {
        // If we're deleting a parent item
        if (deletedItem.values[1].name == this.parentSearchType) {
            super.onSearchItemDelete(deletedItem);
            this.deleteChildren(this.thisSearchList, deletedItem, this.thisArray);
        }


        // If we're deleting a child item
        if (deletedItem.values[1].name == this.childSearchType) {
            // ********* commited Data Service *********
            // this.dataService.delete('api/' + this.childDataServicePath, {
            //     id: deletedItem.id
            // }).subscribe();
            this.deleteItem(this.otherSearchList, deletedItem, this.childSearchType);
            this.deleteItem(this.thisArray, deletedItem, 1);
            this.deleteItem(this.otherArray, deletedItem, 1);
            this.deleteChildren(this.thisSearchList, deletedItem, this.thisArray);
        }
    }



    // ====================================================================( DELETE ITEM )==================================================================== \\

    deleteItem(list: Array<HierarchyItem>, deletedItem: HierarchyItem, type: number | string) {
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

                    // Check the hierarchy list for any children
                    if (hierarchyList) {
                        // Check to see if any of the children of the parent item is present in the hierarchy list. If so, delete those too
                        const hierarchyChildIndex = hierarchyList!.findIndex(y => y.id == x.id && y.name == x.name && y.hierarchyGroupID == 1);
                        if (hierarchyChildIndex != -1) hierarchyList.splice(hierarchyChildIndex, 1);
                    }
                })
            })
    }



    // ================================================================( SORT PENDING ITEMS )================================================================= \\

    sortPendingItems() {
        // If an item was edited in search mode
        if (this.thisSortList.length > 0) {
            // Then we need to sort those items once we return to hierarchy mode
            this.thisSortList.forEach(x => {
                // As long as the item that was added to the sort list is NOT null and it is NOT hidden
                if (x && !x.hidden) {
                    this.listComponent.listManager.sort(x);
                    const index = this.thisSortList.indexOf(x);
                    this.thisSortList.splice(index, 1);
                }
                // If the item that was added to the sort list is null
                if (!x) {
                    // No sense of having it in the list so remove it
                    const index = this.thisSortList.indexOf(x);
                    this.thisSortList.splice(index, 1);
                }
            })
        }

        // As long as a list is using the hierarchy update service
        if (this.hierarchyUpdateService) {
            // But if any items were added or edited from the other list whether it was done in search mode or hierarchy mode
            if (this.hierarchyUpdateService.otherSortList.length > 0 &&
                this.hierarchyUpdateService.targetSortType == this.sortType) {

                // Then we need to sort those items now in this hierarchy list
                this.hierarchyUpdateService.otherSortList.forEach(x => {
                    if (!x.hidden) {
                        this.listComponent.listManager.sort(x);
                        const index = this.hierarchyUpdateService.otherSortList.indexOf(x);
                        this.hierarchyUpdateService.otherSortList.splice(index, 1);
                    }
                })
            }
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
            this.listComponent.listManager.onArrowClick(parent);

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
        this.listComponent.listManager.onItemDown(item);
    }



    // ====================================================================( IS DISABLED )==================================================================== \\

    isDisabled(disabledUpdateProperty: keyof HierarchyUpdate | keyof MultiColumnListUpdate): boolean {
        // If we're in hierarchy mode
        if (!this.searchMode) {

            // As long as the update is not null
            if (this.listUpdate) {
                // Update it
                let hierarchyDisabledUpdateProperty = disabledUpdateProperty as keyof HierarchyUpdate;
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



    // ======================================================================( GET ITEM )====================================================================== \\

    getItem(x: ListItem) {
        return {
            id: x.id,
            name: x.name,
            hierarchyGroupID: 0,
            hidden: false,
            arrowDown: false
        }
    }


    // ===================================================================( GET CHILD ITEM )=================================================================== \\

    getChildItem(child: Item) {
        return {
            id: child.id,
            name: child.name,
            hierarchyGroupID: 1,
            hidden: false,
        }
    }



    // ===================================================================( GET OTHER ITEM )=================================================================== \\

    getOtherItem(x: ListItem) {
        return {
            id: x.id,
            name: x.name,
            hierarchyGroupID: 0,
            hidden: false,
            arrowDown: false,
        }
    }



    // ================================================================( GET OTHER CHILD ITEM )================================================================ \\

    getOtherChildItem(child: Item, hierarchyUpdate: HierarchyUpdate) {
        return {
            id: child.id,
            name: child.name,
            hierarchyGroupID: 1,
            hidden: !this.otherArray[hierarchyUpdate.index!].arrowDown
        }
    }


    // =============================================================( GET CHILD ITEM PARAMETERS )============================================================== \\

    getChildItemParameters(hierarchyUpdate: HierarchyUpdate): Array<KeyValue<any, any>> {
        return [{ key: 'parentId', value: hierarchyUpdate.id }];
    }



    // ===============================================================( GET SEARCH RESULT ITEM )=============================================================== \\

    getSearchResultItem(x: SearchResultItem) {
        return {
            id: x.id,
            name: null!,
            values: [{ name: x.name!, width: this.searchNameWidth, allowEdit: true }, { name: x.type!, width: this.searchTypeWidth }]
        }
    }
}