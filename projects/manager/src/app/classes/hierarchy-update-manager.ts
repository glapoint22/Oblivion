import { SafeHtml } from "@angular/platform-browser";
import { Subject } from "rxjs";
import { HierarchyComponent } from "../components/hierarchies/hierarchy/hierarchy.component";
import { MultiColumnListComponent } from "../components/lists/multi-column-list/multi-column-list.component";
import { DuplicateItem } from "./duplicate-item";
import { ListUpdateType, MenuOptionType } from "./enums";
import { HierarchyItem } from "./hierarchy-item";
import { HierarchyUpdate } from "./hierarchy-update";
import { Item } from "./item";
import { ListUpdate } from "./list-update";
import { MultiColumnItem } from "./multi-column-item";
import { MultiColumnListUpdate } from "./multi-column-list-update";
import { ListUpdateManager } from "./list-update-manager";
import { SearchResultItem } from "./search-result-item";
import { KeyValue } from "@angular/common";
import { Directive } from "@angular/core";

@Directive()
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
    public thisArray: Array<HierarchyItem> = new Array<HierarchyItem>();
    public otherArray: Array<HierarchyItem> = new Array<HierarchyItem>();
    public listComponent!: HierarchyComponent;
    public collapseHierarchyOnOpen: boolean = true;
    public thisSearchArray: Array<MultiColumnItem> = new Array<MultiColumnItem>();
    public otherSearchArray: Array<MultiColumnItem> = new Array<MultiColumnItem>();
    public searchComponent!: MultiColumnListComponent;
    public onChildrenLoad: Subject<void> = new Subject<void>();
    public get listUpdate(): HierarchyUpdate { return this._hierarchyUpdate; }
    public get searchUpdate(): MultiColumnListUpdate { return this._searchUpdate; }
    public set listUpdate(listUpdate: HierarchyUpdate) { this.onListUpdate(listUpdate); }
    public set searchUpdate(searchUpdate: MultiColumnListUpdate) { this.onSearchListUpdate(searchUpdate); }


    // ====================================================================( NG ON INIT )===================================================================== \\

    ngOnInit() {
        super.ngOnInit();

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
                            }
                            this.onChildrenLoad.next();
                        })
                    })
            }
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
        this.addIconButtonTitle = 'Add';
        this.editIconButtonTitle = 'Rename';
        this.deleteIconButtonTitle = 'Delete';
        this.listComponent.add();
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
            this.onSearchItemDelete(searchUpdate.deletedItems![0] as MultiColumnItem);
            return;
        }
        if (searchUpdate.type == ListUpdateType.DeletePrompt) {
            this.onSearchDeletePrompt(searchUpdate.deletedItems![0] as MultiColumnItem);
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
        if ((searchUpdate.selectedItems![0] as MultiColumnItem).values[1].name == this.parentSearchType) {
            super.onSelectedSearchItem(searchUpdate);
            this.searchOptions.menu!.menuOptions[2].name = 'Delete ' + this.itemType;
            this.searchOptions.menu!.menuOptions[3].name = 'Go to ' + this.itemType + ' in Hierarchy';
        }

        if ((searchUpdate.selectedItems![0] as MultiColumnItem).values[1].name == this.childSearchType) {
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
            const indexOfHierarchyItemParent = this.getIndexOfHierarchyItemParent(this.thisArray[hierarchyUpdate.index!], this.thisArray);

            // ********* Commented Out Data Service *********
            // this.dataService.post<number>('api/' + this.childDataServicePath, {
            //     id: this.thisArray[indexOfHierarchyItemParent].id,
            //     name: hierarchyUpdate.name
            // }).subscribe((id: number) => {
                this.thisArray[hierarchyUpdate.index!].id = this.hierarchyAddId//id;
                this.updateOtherItems(hierarchyUpdate);
            // }
        }
    }



    // ==================================================================( ADD OTHER ITEM )=================================================================== \\

    addOtherItem(array: Array<HierarchyItem>, index: number, hierarchyItem: HierarchyItem) {
        if (hierarchyItem.hierarchyGroupID == 0) {
            array.splice(index, 0, {
                id: hierarchyItem.id,
                name: hierarchyItem.name,
                hierarchyGroupID: 0
            })

        } else {
            const indexOfThisParent = this.getIndexOfHierarchyItemParent(hierarchyItem, this.thisArray);
            const indexOfOtherParent = array.findIndex(x => x.id == this.thisArray[indexOfThisParent].id && x.name == this.thisArray[indexOfThisParent].name && x.hierarchyGroupID == 0);
            const indexDiff = index - indexOfThisParent; // The difference between this array's new item index and this array's parent index

            if (this.hasChildren(array[indexOfOtherParent], array)) {
                array.splice(indexOfOtherParent + indexDiff, 0, this.getAddedOtherChildItem(array, hierarchyItem, indexOfOtherParent));
            }
        }
    }



    // ===================================================================( ON ITEM EDIT )==================================================================== \\
    
    onItemEdit(hierarchyUpdate: HierarchyUpdate) {
        // Edit parent hierarchy item
        if (hierarchyUpdate.hierarchyGroupID == 0) {
            super.onItemEdit(hierarchyUpdate);
        }

        // Edit child hierarchy item
        if (hierarchyUpdate.hierarchyGroupID == 1) {
            // ********* Commented Out Data Service *********
            // this.dataService.put('api/' + this.childDataServicePath, {
            //     id: hierarchyUpdate.id,
            //     name: hierarchyUpdate.name
            // }).subscribe();
            this.updateOtherItems(hierarchyUpdate);
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
            // ********* Commented Out Data Service *********
            // this.dataService.put('api/' + this.childDataServicePath, {
            //     id: searchUpdate.id,
            //     name: searchUpdate.values![0].name
            // }).subscribe();
            this.updateOtherItems(searchUpdate);
        }

    }



    // ==================================================================( EDIT OTHER ITEM )================================================================== \\

    editOtherItem(array: Array<HierarchyItem>, update: ListUpdate, type?: number | string) {
        const editedItem: HierarchyItem = typeof type == 'number' ? array.find(x => x.id == update.id && x.hierarchyGroupID == type)! : array.find(x => x.id == update.id && (x as MultiColumnItem).values[1].name == type)!;

        if (editedItem) {
            // Other hierarchy from this hierarchy
            if (update.name && typeof type == 'number') {
                editedItem.name = update.name;
                this.sort(editedItem, array);
            }

            // Other search from this hierarchy
            if (update.name && typeof type != 'number') {
                (editedItem as MultiColumnItem).values[0].name = update.name;
            }

            // Other search from this search
            if (!update.name && typeof type != 'number') {
                (editedItem as MultiColumnItem).values[0].name = (update as MultiColumnListUpdate).values![0].name;
            }

            // Other hierarchy from this search and this hierarchy from this search
            if (!update.name && typeof type == 'number') {
                editedItem.name = (update as MultiColumnListUpdate).values![0].name;
                this.sort(editedItem, array);
            }
        }
    }



    // =================================================================( UPDATE OTHER ITEMS )================================================================ \\

    updateOtherItems(update: ListUpdate) {
        // Form
        if (this.otherArray) {

            if (update.type == ListUpdateType.Add) {
                if (this.otherArray.length > 0) this.addOtherItem(this.otherArray, update.index!, this.thisArray[update.index!]);
            }


            if (update.type == ListUpdateType.Edit) {
                if ((update as HierarchyUpdate).hierarchyGroupID != null) {
                    this.editOtherItem(this.otherArray, update, (update as HierarchyUpdate).hierarchyGroupID);
                    this.editOtherItem(this.otherSearchArray, update, ((update as HierarchyUpdate).hierarchyGroupID == 0 ? this.parentSearchType : this.childSearchType));
                }
                if ((update as MultiColumnListUpdate).values) {
                    this.editOtherItem(this.otherSearchArray, update, (update as MultiColumnListUpdate).values![1].name);
                    this.editOtherItem(this.thisArray, update, ((update as MultiColumnListUpdate).values![1].name == this.parentSearchType ? 0 : 1));
                    this.editOtherItem(this.otherArray, update, ((update as MultiColumnListUpdate).values![1].name == this.parentSearchType ? 0 : 1));
                }
            }
        }

        // Products
        if (this.otherProductArray) {
            this.productService.productComponents.forEach(x => {

                if (this.productService.productComponents.indexOf(x) != this.productIndex) {

                    if (update.type == ListUpdateType.Add) {
                        if ((x[this.otherProductArray] as Array<HierarchyItem>).length > 0) this.addOtherItem(x[this.otherProductArray] as Array<HierarchyItem>, update.index!, this.thisArray[update.index!]);
                    }

                    if (update.type == ListUpdateType.Edit) {
                        if ((x[this.otherProductArray] as Array<HierarchyItem>).length > 0 && (update as HierarchyUpdate).hierarchyGroupID != null) this.editOtherItem(x[this.otherProductArray] as Array<HierarchyItem>, update, (update as HierarchyUpdate).hierarchyGroupID);
                        if ((x[this.otherProductSearchArray] as Array<MultiColumnItem>).length > 0) {
                            if ((update as HierarchyUpdate).hierarchyGroupID != null) this.editOtherItem(x[this.otherProductSearchArray] as Array<MultiColumnItem>, update, ((update as HierarchyUpdate).hierarchyGroupID == 0 ? this.parentSearchType : this.childSearchType));
                            if ((update as MultiColumnListUpdate).values) this.editOtherItem(x[this.otherProductSearchArray] as Array<MultiColumnItem>, update, (update as MultiColumnListUpdate).values![1].name);
                        }
                    }
                }
                if (update.type == ListUpdateType.Edit && (x[this.otherProductArray] as Array<HierarchyItem>).length > 0 && (update as MultiColumnListUpdate).values) this.editOtherItem(x[this.otherProductArray] as Array<HierarchyItem>, update, ((update as MultiColumnListUpdate).values![1].name == this.parentSearchType ? 0 : 1));
            })
        }
    }



    // ========================================================================( SORT )======================================================================= \\

    sort(hierarchyItem: HierarchyItem, array: Array<HierarchyItem>) {
        let parentHierarchyIndex: number = -1;
        let tempArray: Array<HierarchyItem> = new Array<HierarchyItem>();
        let newHierarchyGroup: Array<HierarchyItem> = new Array<HierarchyItem>();

        // If the selected hierarchy item belongs to the top level group
        if (hierarchyItem.hierarchyGroupID == 0) {
            // Copy all the hierarchy items from that group to the temp array
            tempArray = (array as Array<HierarchyItem>).filter(x => x.hierarchyGroupID == 0);

            // If the selected hierarchy item belongs to any other group
        } else {

            // First get the parent of the selected hierarchy item
            parentHierarchyIndex = this.getIndexOfHierarchyItemParent(hierarchyItem, array);

            // Then copy all the children belonging to that hierarchy parent to the temp array
            for (let i = parentHierarchyIndex + 1; i < array.length; i++) {
                if (array[i].hierarchyGroupID == array[parentHierarchyIndex].hierarchyGroupID) break;
                if (array[i].hierarchyGroupID == array[parentHierarchyIndex].hierarchyGroupID! + 1) {
                    tempArray.push(array[i] as HierarchyItem)
                }
            }
        }

        // Sort the temp array
        tempArray.sort((a, b) => (a.name! > b.name!) ? 1 : -1);

        // Loop through all the hierarchy items in the temp array
        tempArray.forEach(x => {
            // Get the index of that same hierarchy item from the source list
            let index = array.findIndex(y => y.id == x.id && y.name == x.name && y.hierarchyGroupID == x.hierarchyGroupID);

            // Copy the hierarchy item and all its children
            for (let i = index; i < array.length; i++) {
                if (i != index && array[i].hierarchyGroupID! <= array[index].hierarchyGroupID!) break;

                // And add them to the new hierarchy group
                newHierarchyGroup.push(array[i] as HierarchyItem);
            }
        })

        // Remove the old hierarchy group from the source
        array.splice(parentHierarchyIndex + 1, newHierarchyGroup.length);
        // Add the new hierarchy group to the source
        array.splice(parentHierarchyIndex + 1, 0, ...newHierarchyGroup);
    }



    // ========================================================( GET INDEX OF HIERARCHY ITEM PARENT )========================================================= \\

    getIndexOfHierarchyItemParent(hierarchyItem: HierarchyItem, array: Array<HierarchyItem>): number {
        let parentHierarchyIndex!: number;
        const hierarchyItemIndex = array.indexOf(hierarchyItem);

        for (let i = hierarchyItemIndex; i >= 0; i--) {
            if (array[i].hierarchyGroupID! < array[hierarchyItemIndex].hierarchyGroupID!) {
                parentHierarchyIndex = i;
                break;
            }
        }
        return parentHierarchyIndex;
    }



    // ===================================================================( HAS CHILDREN )==================================================================== \\

    hasChildren(hierarchyItem: HierarchyItem, array: Array<HierarchyItem>): boolean {
        const index = array.indexOf(hierarchyItem);

        if (index == array.length - 1) return false;

        if (array[index! + 1].hierarchyGroupID! > array[index!].hierarchyGroupID!) {
            return true;
        } else {
            return false;
        }
    }



    // ==========================================================( DUPLICATE PROMPT CHILD MESSAGE )=========================================================== \\

    duplicatePromptChildMessage(childType: string, childName: string, itemType: string, parentName: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(
            'The ' +
            itemType +
            '<span style="color: #ffba00"> \"' + parentName + '\"</span>' +
            ' already contains a ' +
            childType +
            ' with the name' +
            ' <span style="color: #ffba00">\"' + childName + '\"</span>.' +
            ' Please choose a different name.');
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

                // If the list is NOT Editable
                if (!this.listComponent.listManager.editable) {
                    this.listComponent.commitAdd(hierarchyUpdate.id!, hierarchyUpdate.name!);

                    // But if the list IS editable
                } else {
                    this.listComponent.commitAddEdit();
                }

                // If a match was found
            } else {
                this.listOptions.duplicatePrompt!.title = 'Duplicate ' + this.itemType;
                this.listOptions.duplicatePrompt!.message = this.duplicatePromptMessage(this.listComponent, this.itemType, hierarchyUpdate.name!);
                this.listComponent.openDuplicatePrompt();
            }
        }

        // If we're verifying a child item
        if (hierarchyUpdate.hierarchyGroupID == 1) {
            const childItem = this.thisArray.find(x => x.id == hierarchyUpdate.id && x.hierarchyGroupID == 1);
            const indexOfParentItem = this.getIndexOfHierarchyItemParent(childItem!, this.thisArray);

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
                this.listOptions.duplicatePrompt!.message = this.duplicatePromptChildMessage(this.childType, hierarchyUpdate.name!, this.itemType, this.thisArray[indexOfParentItem].name!);
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
                this.searchOptions.duplicatePrompt!.message = this.duplicatePromptMessage(this.searchComponent, this.itemType, searchUpdate.values![0].name);
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
                        this.searchOptions.duplicatePrompt!.message = this.duplicatePromptChildMessage(this.childType, searchUpdate.values![0].name, this.itemType, parentItem!.name!);
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
            const indexOfParentItem = this.getIndexOfHierarchyItemParent(childItem!, this.thisArray);
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
            // ********* Commented Out Data Service *********
            // this.dataService.delete('api/' + this.childDataServicePath, this.getDeletedItemParameters(deletedItem)).subscribe();


            // this.deleteItem(this.otherArray, deletedItem, 1);
            // this.deleteItem(this.otherSearchArray, deletedItem as MultiColumnItem, this.childSearchType);
        }

    }



    // ===============================================================( ON SEARCH ITEM DELETE )=============================================================== \\

    onSearchItemDelete(deletedItem: MultiColumnItem) {
        // If we're deleting a parent item
        if (deletedItem.values[1].name == this.parentSearchType) {
            super.onSearchItemDelete(deletedItem);
            this.deleteChildren(this.thisSearchArray, deletedItem, this.thisArray);
        }


        // If we're deleting a child item
        if (deletedItem.values[1].name == this.childSearchType) {
            // ********* Commented Out Data Service *********
            // this.dataService.delete('api/' + this.childDataServicePath, this.getDeletedItemParameters(deletedItem)).subscribe();


            // this.deleteItem(this.otherSearchArray, deletedItem, this.childSearchType);
            this.deleteItem(this.thisArray, deletedItem, 1);
            // this.deleteItem(this.otherArray, deletedItem, 1);
            this.deleteChildren(this.thisSearchArray, deletedItem, this.thisArray);
        }
    }



    // ====================================================================( DELETE ITEM )==================================================================== \\

    deleteItem(list: Array<HierarchyItem>, deletedItem: HierarchyItem, type: number | string) {
        // Find the index of the item in the list
        const index = typeof type == 'number' ? list.findIndex(x => x.id == deletedItem.id && x.hierarchyGroupID == type) : list.findIndex(x => x.id == deletedItem.id && (x as MultiColumnItem).values[1].name == type);

        // If the index is found, delete the item of that index
        if (index != -1) list.splice(index, 1);

        // If we're deleting a parent item from a search list, then check to see if any of its children is also included in the search list. If so, delete them too
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
                this.selectItem(parentSearchItem.id!, 0);
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
                        this.goToParent(parent.id!, child.id!, this.selectItem, [child.id, 1], this.selectItem, [child.id, 1]);
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
        } else if (this.searchMode && this.thisSearchArray.length > 0) {

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

    getItem(x: HierarchyItem) {
        return {
            id: x.id,
            name: x.name,
            hierarchyGroupID: 0,
            hidden: false,
            arrowDown: false
        }
    }



    // ===================================================================( GET CHILD ITEM )=================================================================== \\

    getChildItem(child: HierarchyItem) {
        return {
            id: child.id,
            name: child.name,
            hierarchyGroupID: 1,
            hidden: false
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



    // =============================================================( GET ADDED OTHER CHILD ITEM )============================================================= \\

    getAddedOtherChildItem(array: Array<HierarchyItem>, hierarchyItem: HierarchyItem, indexOfOtherParent: number) {
        return {
            id: hierarchyItem.id,
            name: hierarchyItem.name,
            hierarchyGroupID: hierarchyItem.hierarchyGroupID,
            hidden: !array[indexOfOtherParent].arrowDown
        }
    }
}