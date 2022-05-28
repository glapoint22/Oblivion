import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { DataService } from "common";
import { KeywordsService } from "../services/keywords/keywords.service";
import { ProductService } from "../services/product/product.service";
import { CheckboxListUpdate } from "./checkbox-list-update";
import { CheckboxMultiColumnListUpdate } from "./checkbox-multi-column-list-update";
import { ListUpdateType, MenuOptionType, SortType } from "./enums";
import { HierarchyUpdate } from "./hierarchy-update";
import { MultiColumnListUpdate } from "./multi-column-list-update";
import { KeywordCheckboxSearchResultItem } from "./keyword-checkbox-search-result-item";
import { KeywordsFormManager } from "./keywords-form-manager";
import { KeywordCheckboxItem } from "./keyword-checkbox-item";
import { KeywordCheckboxMultiColumnItem } from "./keyword-checkbox-multi-column-item";

export class SelectedKeywordsManager extends KeywordsFormManager {
    // Private
    private addDisabled!: boolean;
    private editDisabled!: boolean;
    private deleteDisabled!: boolean;

    // Public
    public thisArray: Array<KeywordCheckboxItem> = new Array<KeywordCheckboxItem>();
    public thisSearchList: Array<KeywordCheckboxMultiColumnItem> = new Array<KeywordCheckboxMultiColumnItem>();


    // ====================================================================( CONSTRUCTOR )==================================================================== \\

    constructor(dataService: DataService, sanitizer: DomSanitizer, keywordsService: KeywordsService, private productService: ProductService) {
        super(dataService, sanitizer, keywordsService);
        this.searchNameWidth = '296px';
        this.sortType = SortType.Product;
        this.parentDataServicePath = 'SelectedKeywords/Groups';
        this.childDataServicePath = 'SelectedKeywords';
        this.childType = 'Custom Keyword';
        this.keywordsService.selectedKeywordsArray = this.thisArray;
        this.keywordsService.selectedKeywordsSearchList = this.thisSearchList;
    }


    // ======================================================================( ON OPEN )====================================================================== \\

    onOpen() {
        this.parentType = 'Custom Keyword Group';
        this.addIconButtonTitle = 'Add ' + this.parentType;
        this.addDisabled = true;
        this.editDisabled = true;
        this.deleteDisabled = true;
        if (this.thisArray.length == 0) {
            this.dataService.get<Array<KeywordCheckboxItem>>('api/' + this.parentDataServicePath, [{ key: 'productId', value: this.productService.product.id }])
                .subscribe((thisArray: Array<KeywordCheckboxItem>) => {
                    thisArray.forEach(x => {
                        this.thisArray.push({
                            id: x.id,
                            name: x.name,
                            hierarchyGroupID: 0,
                            hidden: false,
                            arrowDown: false,
                            forProduct: x.forProduct,
                            color: x.forProduct ? '#ffba00' : null!
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
    }



    // ==================================================================( ON ARROW CLICK )=================================================================== \\

    onArrowClick(hierarchyUpdate: HierarchyUpdate) {
        // If a parent item was expanded and its children hasn't been loaded yet
        if (hierarchyUpdate.arrowDown && !hierarchyUpdate.hasChildren) {

            // If the hierarchy item is a top level hierarchy item
            if (hierarchyUpdate.hierarchyGroupID == 0) {

                this.dataService.get<Array<KeywordCheckboxItem>>('api/' + this.childDataServicePath, [{ key: 'parentId', value: hierarchyUpdate.id }, { key: 'productId', value: this.productService.product.id }])
                    .subscribe((children: Array<KeywordCheckboxItem>) => {
                        let num = this.hierarchyComponent.listManager.editedItem ? 2 : 1;

                        for (let i = children.length - 1; i >= 0; i--) {

                            // This Array
                            (this.thisArray as KeywordCheckboxItem[]).splice(hierarchyUpdate.index! + num, 0,
                                {
                                    id: children[i].id,
                                    name: children[i].name,
                                    hierarchyGroupID: 1,
                                    hidden: false,
                                    checked: children[i].checked,
                                    forProduct: children[i].forProduct,
                                    color: children[i].forProduct ? '#ffba00' : null!
                                }
                            )
                        }
                        this.onChildrenLoad.next();
                    })
            }
        }
    }



    // ===================================================================( TOGGLE SEARCH )=================================================================== \\

    toggleSearch() {
        super.toggleSearch();

        // If we're toggling back to hierarchy mode
        if (!this.searchMode) {
            window.setTimeout(() => {
                // If any keyword items have been added from the available list to the selected list while the selected list was in search mode
                this.keywordsService.sortList.forEach(x => {

                    // Sort the selected list
                    this.hierarchyComponent.listManager.sort(x);
                });
                this.keywordsService.sortList = [];
            })

        }
    }



    // =======================================================================( ADD )========================================================================= \\

    add() {
        this.hierarchyComponent.listManager.editable = true;
        // If an item is selected and that item is a custom keyword group
        if (this.hierarchyComponent.listManager.selectedItem != null && this.hierarchyComponent.listManager.selectedItem.hierarchyGroupID == 0) {
            // Check to see if that custom keyword group has had its children loaded yet
            if (!this.hierarchyComponent.listManager.hasChildren(this.hierarchyComponent.listManager.selectedItem)) {
                // If not, wait for its children to load
                let onChildrenLoadListener = this.onChildrenLoad.subscribe(() => {
                    onChildrenLoadListener.unsubscribe();
                    // Once the children have loaded, dim all the custom items
                    this.thisArray.forEach(x => x.forProduct ? x.color = '#6e5000' : null);
                });
            }
        }

        super.add();
        this.addIconButtonTitle = 'Add';
        this.thisArray.forEach(x => x.forProduct ? x.color = '#6e5000' : null);
        const newKeyword = this.thisArray.find(x => x.id == -1);
        newKeyword!.color = '#ffba00';
        if (newKeyword?.hierarchyGroupID == 1) {
            newKeyword!.checked = true;
        }
    }



    // ====================================================================( ADD PARENT )===================================================================== \\

    addParent() {
        this.hierarchyComponent.listManager.editable = true;
        super.addParent();
        this.deleteDisabled = true;
        this.deleteIconButtonTitle = 'Delete';
        this.thisArray.forEach(x => x.forProduct ? x.color = '#6e5000' : null);
        const newKeyword = this.thisArray.find(x => x.id == -1);
        newKeyword!.color = '#ffba00';
    }



    // =======================================================================( EDIT )======================================================================== \\

    edit() {
        if (!this.searchMode) {
            this.addIconButtonTitle = 'Add';
            this.editIconButtonTitle = 'Rename';
            this.deleteIconButtonTitle = 'Delete';
            this.hierarchyComponent.edit();
            this.thisArray.forEach(x => x.forProduct && x != this.hierarchyComponent.listManager.editedItem ? x.color = '#6e5000' : null);
        } else {

            if (this.thisSearchList.length > 0) {
                this.editIconButtonTitle = 'Rename';
                this.deleteIconButtonTitle = 'Delete';
                this.searchComponent.edit();
                this.thisSearchList.forEach(x => {
                    x.forProduct && x != this.searchComponent.listManager.editedItem ? x.values[0].color = '#6e5000' : null;
                    x.forProduct && x != this.searchComponent.listManager.editedItem ? x.values[1].color = '#6e5000' : null;
                    x.forProduct && x == this.searchComponent.listManager.editedItem ? x.values[1].color = '#6e5000' : null;
                });
            }
        }
    }



    // ================================================================( ON HIERARCHY UPDATE )================================================================ \\

    onHierarchyUpdate(hierarchyUpdate: CheckboxListUpdate) {
        super.onHierarchyUpdate(hierarchyUpdate);
        if (hierarchyUpdate.type == ListUpdateType.CheckboxChange) this.onHierarchyItemCheckboxChange(hierarchyUpdate);
        if (hierarchyUpdate.type == ListUpdateType.DoubleClick) this.onHierarchyItemDoubleClick();
    }



    // =================================================================( ON SEARCH UPDATE )================================================================== \\

    onSearchUpdate(searchUpdate: CheckboxMultiColumnListUpdate) {
        super.onSearchUpdate(searchUpdate);
        if (searchUpdate.type == ListUpdateType.CheckboxChange) this.onSearchCheckboxChange(searchUpdate);
        if (searchUpdate.type == ListUpdateType.DoubleClick) this.onSearchItemDoubleClick();
    }



    // ============================================================( ON SELECTED HIERARCHY ITEM )============================================================= \\

    onSelectedHierarchyItem(hierarchyUpdate: CheckboxListUpdate) {
        if (hierarchyUpdate.selectedItems![0].hierarchyGroupID == 0) {

            // If we're NOT selecting a custom keyword group
            if (!this.thisArray[hierarchyUpdate.selectedItems![0].index!].forProduct) {
                this.parentType = 'Keyword Group';
                this.addDisabled = true;
                this.editDisabled = true;
                this.deleteDisabled = false;
                this.addIconButtonTitle = 'Add';
                this.editIconButtonTitle = 'Rename';
                this.deleteIconButtonTitle = 'Remove ' + this.parentType;
                this.hierarchyComponent.listManager.editable = false;
                this.hierarchyOptions.deletePrompt!.title = 'Remove ' + this.parentType;
                this.hierarchyOptions.deletePrompt!.primaryButton!.name = 'Remove';
                this.buildMenu(hierarchyUpdate);

                // If we ARE selecting a custom keyword group
            } else {
                this.parentType = 'Custom Keyword Group';
                this.hierarchyComponent.listManager.editable = true;
                this.addIconButtonTitle = 'Add ' + this.childType;
                this.editIconButtonTitle = 'Rename ' + this.parentType;
                this.deleteIconButtonTitle = 'Delete ' + this.parentType;
                this.hierarchyOptions.deletePrompt!.title = 'Delete ' + this.parentType;
                this.hierarchyOptions.deletePrompt!.primaryButton!.name = 'Delete';
                this.buildMenu(hierarchyUpdate);

                // If the custom keyword was selected after it was in edit mode
                if (this.hierarchyComponent.listManager.editedItem != null) {
                    this.thisArray.forEach(x => x.forProduct ? x.color = '#ffba00' : null);
                }
            }
        }

        if (hierarchyUpdate.selectedItems![0].hierarchyGroupID == 1) {
            this.parentType = 'Custom Keyword Group';

            // If we're NOT selecting a custom keyword (a selection can NOT be made so we stay in custom mode)
            if (!this.thisArray[hierarchyUpdate.selectedItems![0].index!].forProduct) {
                this.hierarchyOptions.menu = null!;
                this.editIconButtonTitle = 'Rename';
                this.deleteIconButtonTitle = 'Delete';
                this.addIconButtonTitle = 'Add ' + this.parentType;
                this.hierarchyComponent.listManager.editable = false;
                this.hierarchyComponent.listManager.selectedItem.selected = false;
                this.hierarchyComponent.listManager.selectedItem.selectType = null!;
                this.hierarchyComponent.listManager.selectedItem = null!;

                // If we ARE selecting a custom keyword
            } else {

                this.hierarchyComponent.listManager.editable = true;
                this.addIconButtonTitle = 'Add ' + this.childType;
                this.editIconButtonTitle = 'Rename ' + this.childType;
                this.deleteIconButtonTitle = 'Delete ' + this.childType;
                this.hierarchyOptions.deletePrompt!.title = 'Delete ' + this.childType;
                this.hierarchyOptions.deletePrompt!.primaryButton!.name = 'Delete';
                this.buildMenu(hierarchyUpdate);

                // If the custom keyword was selected after it was in edit mode
                if (this.hierarchyComponent.listManager.editedItem != null) {
                    this.thisArray.forEach(x => x.forProduct ? x.color = '#ffba00' : null);
                }
            }
        }
    }



    // ==============================================================( ON SELECTED SEARCH ITEM )============================================================== \\

    onSelectedSearchItem(searchUpdate: MultiColumnListUpdate) {

        if (searchUpdate.selectedMultiColumnItems![0].values[1].name == this.parentSearchType) {

            // If we're NOT selecting a custom keyword group
            if (!this.thisSearchList[searchUpdate.selectedMultiColumnItems![0].index!].forProduct) {
                this.parentType = 'Keyword Group';
                this.editDisabled = true;
                this.deleteDisabled = false;
                this.editIconButtonTitle = 'Rename';
                this.deleteIconButtonTitle = 'Remove ' + this.parentType;
                searchUpdate.selectedMultiColumnItems![0].values[0].allowEdit = false;
                this.searchOptions.deletePrompt!.title = 'Remove ' + this.parentType;
                this.searchOptions.deletePrompt!.primaryButton!.name = 'Remove';
                this.searchOptions.menu!.menuOptions[0].hidden = true;
                this.searchOptions.menu!.menuOptions[1].hidden = true;
                this.searchOptions.menu!.menuOptions[2].hidden = false;
                this.searchOptions.menu!.menuOptions[3].hidden = false;
                this.searchOptions.menu!.menuOptions[2].name = 'Remove ' + this.parentType;
                this.searchOptions.menu!.menuOptions[4].name = 'Go to ' + this.parentType + ' in Hierarchy';

                // If we ARE selecting a custom keyword group
            } else {

                this.parentType = 'Custom Keyword Group';
                searchUpdate.selectedMultiColumnItems![0].values[0].allowEdit = true;
                this.editIconButtonTitle = 'Rename ' + this.parentType;
                this.deleteIconButtonTitle = 'Delete ' + this.parentType;
                this.searchOptions.deletePrompt!.title = 'Delete ' + this.parentType;
                this.searchOptions.deletePrompt!.primaryButton!.name = 'Delete';
                this.searchOptions.menu!.menuOptions[0].hidden = false;
                this.searchOptions.menu!.menuOptions[1].hidden = false;
                this.searchOptions.menu!.menuOptions[2].hidden = false;
                this.searchOptions.menu!.menuOptions[3].hidden = false;
                this.searchOptions.menu!.menuOptions[0].name = 'Rename ' + this.parentType;
                this.searchOptions.menu!.menuOptions[2].name = 'Delete ' + this.parentType;
                this.searchOptions.menu!.menuOptions[4].name = 'Go to ' + this.parentType + ' in Hierarchy';

                // If the custom keyword was selected after it was in edit mode
                if (this.searchComponent.listManager.editedItem != null) {
                    this.thisSearchList.forEach(x => {
                        x.forProduct ? x.values[0].color = '#ffba00' : null;
                        x.forProduct ? x.values[1].color = '#ffba00' : null;
                    });
                }
            }
        }

        if (searchUpdate.selectedMultiColumnItems![0].values[1].name == this.childSearchType) {

            // If we're NOT selecting a custom keyword
            if (!this.thisSearchList[searchUpdate.selectedMultiColumnItems![0].index!].forProduct) {
                this.childType = 'Keyword';
                this.parentType = 'Keyword Group';
                this.editDisabled = true;
                this.deleteDisabled = true;
                this.editIconButtonTitle = 'Rename';
                this.deleteIconButtonTitle = 'Delete';
                searchUpdate.selectedMultiColumnItems![0].values[0].allowEdit = false;
                this.searchOptions.menu!.menuOptions[0].hidden = true;
                this.searchOptions.menu!.menuOptions[1].hidden = true;
                this.searchOptions.menu!.menuOptions[2].hidden = true;
                this.searchOptions.menu!.menuOptions[3].hidden = true;
                this.searchOptions.menu!.menuOptions[4].name = 'Go to ' + this.childType + ' in Hierarchy';

                // If we ARE selecting a custom keyword
            } else {

                this.childType = 'Custom Keyword';
                this.parentType = 'Custom Keyword Group';
                searchUpdate.selectedMultiColumnItems![0].values[0].allowEdit = true;
                this.editIconButtonTitle = 'Rename ' + this.childType;
                this.deleteIconButtonTitle = 'Delete ' + this.childType;
                this.searchOptions.deletePrompt!.title = 'Delete ' + this.childType;
                this.searchOptions.deletePrompt!.primaryButton!.name = 'Delete';
                this.searchOptions.menu!.menuOptions[0].hidden = false;
                this.searchOptions.menu!.menuOptions[1].hidden = false;
                this.searchOptions.menu!.menuOptions[2].hidden = false;
                this.searchOptions.menu!.menuOptions[3].hidden = false;
                this.searchOptions.menu!.menuOptions[4].hidden = false;
                this.searchOptions.menu!.menuOptions[0].name = 'Rename ' + this.childType;
                this.searchOptions.menu!.menuOptions[2].name = 'Delete ' + this.childType;
                this.searchOptions.menu!.menuOptions[4].name = 'Go to ' + this.childType + ' in Hierarchy';

                // If the custom keyword was selected after it was in edit mode
                if (this.searchComponent.listManager.editedItem != null) {
                    this.thisSearchList.forEach(x => {
                        x.forProduct ? x.values[0].color = '#ffba00' : null;
                        x.forProduct ? x.values[1].color = '#ffba00' : null;
                    });
                }
            }
        }
    }



    // ==========================================================( ON HIERARCHY ITEM DOUBLE CLICK )=========================================================== \\

    onHierarchyItemDoubleClick() {
        // As long as we're double clicking on a custom item
        if (this.hierarchyComponent.listManager.editedItem != null) {
            this.addIconButtonTitle = 'Add';
            this.editIconButtonTitle = 'Rename';
            this.deleteIconButtonTitle = 'Delete';
            this.thisArray.forEach(x => x.forProduct && x != this.hierarchyComponent.listManager.editedItem ? x.color = '#6e5000' : null);
        }
    }



    // ============================================================( ON SEARCH ITEM DOUBLE CLICK )============================================================ \\

    onSearchItemDoubleClick() {
        if (this.parentType == 'Custom Keyword Group') {
            this.editIconButtonTitle = 'Rename';
            this.deleteIconButtonTitle = 'Delete';
            this.thisSearchList.forEach(x => {
                x.forProduct && x != this.searchComponent.listManager.editedItem ? x.values[0].color = '#6e5000' : null;
                x.forProduct && x != this.searchComponent.listManager.editedItem ? x.values[1].color = '#6e5000' : null;
                x.forProduct && x == this.searchComponent.listManager.editedItem ? x.values[1].color = '#6e5000' : null;
            });
        }
    }



    // =========================================================( ON HIERARCHY ITEM CHECKBOX CHANGE )========================================================= \\

    onHierarchyItemCheckboxChange(hierarchyUpdate: CheckboxListUpdate) {
        this.dataService.put('api/' + this.childDataServicePath + '/Update', {
            productId: this.productService.product.id,
            id: hierarchyUpdate.id,
            checked: hierarchyUpdate.checked
        }).subscribe();
    }



    // =============================================================( ON SEARCH CHECKBOX CHANGE )============================================================= \\

    onSearchCheckboxChange(checkboxMultiColumnListUpdate: CheckboxMultiColumnListUpdate) {
        this.dataService.put('api/' + this.childDataServicePath + '/Update', {
            productId: this.productService.product.id,
            id: checkboxMultiColumnListUpdate.id,
            checked: checkboxMultiColumnListUpdate.checked
        }).subscribe();

        // Check to see if the search item that had the checkbox change is visible in the hierarchy
        const hierarchyItem = this.thisArray.find(x => x.id == checkboxMultiColumnListUpdate.id && x.hierarchyGroupID == 1);
        // If it is, make the change to its checkbox as well
        if (hierarchyItem) hierarchyItem.checked = checkboxMultiColumnListUpdate.checked;
    }



    // ===========================================================( ON UNSELECTED HIERARCHY ITEM )============================================================ \\

    onUnselectedHierarchyItem() {
        this.parentType = 'Custom Keyword Group';
        this.addIconButtonTitle = 'Add ' + this.parentType;
        this.editIconButtonTitle = 'Rename';
        this.deleteIconButtonTitle = 'Delete';
        // When an item was going to be added but was cancelled
        this.thisArray.forEach(x => x.forProduct ? x.color = '#ffba00' : null);
    }



    // =============================================================( ON UNSELECTED SEARCH ITEM )============================================================= \\

    onUnselectedSearchItem() {
        this.parentType = 'Custom Keyword Group';
        this.editIconButtonTitle = 'Rename';
        this.deleteIconButtonTitle = 'Delete';
    }



    // ===============================================================( ON HIERARCHY ITEM ADD )=============================================================== \\

    onHierarchyItemAdd(hierarchyUpdate: HierarchyUpdate) {
        // Add parent hierarchy item
        if (hierarchyUpdate.hierarchyGroupID == 0) {
            this.dataService.post<number>('api/' + this.parentDataServicePath, {
                id: this.productService.product.id,
                name: hierarchyUpdate.name
            }).subscribe((id: number) => {
                this.thisArray[hierarchyUpdate.index!].id = id;
                this.thisArray[hierarchyUpdate.index!].forProduct = true;
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
                this.thisArray[hierarchyUpdate.index!].forProduct = true;
            })
        }
        this.thisArray.forEach(x => x.forProduct ? x.color = '#ffba00' : null);
    }



    // =============================================================( ON HIERARCHY ITEM VERIFY )============================================================== \\

    onHierarchyItemVerify(hierarchyUpdate: HierarchyUpdate) {
        let matchFound: boolean = false;

        // If we're verifying a parent item
        if (hierarchyUpdate.hierarchyGroupID == 0) {
            // Loop through each parent custom item and check for a duplicate
            this.thisArray.forEach(x => {
                if (x.hierarchyGroupID == 0 && x.forProduct) {
                    if (x.name?.toLowerCase() == hierarchyUpdate.name?.toLowerCase()) {
                        matchFound = true;
                    }
                }
            })

            if (matchFound) {
                this.hierarchyOptions.duplicatePrompt!.title = 'Duplicate Custom Keyword Group';
                this.hierarchyOptions.duplicatePrompt!.message = this.sanitizer.bypassSecurityTrustHtml('A Custom Keyword Group with the name <span style="color: #ffba00">\"' + hierarchyUpdate.name + '\"</span> already exists. Please choose a different name.');
                this.hierarchyComponent.openDuplicatePrompt();
            } else {

                // Loop through each parent item and check for a duplicate
                this.otherArray.forEach(x => {
                    if (x.hierarchyGroupID == 0) {
                        if (x.name?.toLowerCase() == hierarchyUpdate.name?.toLowerCase()) {
                            matchFound = true;
                        }
                    }
                })

                if (matchFound) {
                    this.hierarchyOptions.duplicatePrompt!.title = 'Duplicate Keyword Group';
                    this.hierarchyOptions.duplicatePrompt!.message = this.sanitizer.bypassSecurityTrustHtml('A Keyword Group with the name <span style="color: #ffba00">\"' + hierarchyUpdate.name + '\"</span> already exists. Please choose a different name.');
                    this.hierarchyComponent.openDuplicatePrompt();
                }
            }

            // If no match was found
            if (!matchFound) {
                this.hierarchyComponent.commitAddEdit();
            }
        }

        // If we're verifying a child item
        if (hierarchyUpdate.hierarchyGroupID == 1) {
            super.onHierarchyItemVerify(hierarchyUpdate);
        }
    }



    // ===============================================================( ON SEARCH ITEM VERIFY )=============================================================== \\

    onSearchItemVerify(searchUpdate: MultiColumnListUpdate) {
        let matchFound: boolean = false;

        // If we're verifying a parent item
        if (searchUpdate.values![1].name == this.parentSearchType) {
            // Loop through each parent custom item and check for a duplicate
            this.thisArray.forEach(x => {
                if (x.hierarchyGroupID == 0 && x.forProduct) {
                    if (x.name?.toLowerCase() == searchUpdate.name?.toLowerCase()) {
                        matchFound = true;
                    }
                }
            })

            if (matchFound) {
                this.searchOptions.duplicatePrompt!.title = 'Duplicate Custom Keyword Group';
                this.searchOptions.duplicatePrompt!.message = this.sanitizer.bypassSecurityTrustHtml('A Custom Keyword Group with the name <span style="color: #ffba00">\"' + searchUpdate.name + '\"</span> already exists. Please choose a different name.');
                this.searchComponent.openDuplicatePrompt();
            } else {

                // Loop through each parent item and check for a duplicate
                this.otherArray.forEach(x => {
                    if (x.hierarchyGroupID == 0) {
                        if (x.name?.toLowerCase() == searchUpdate.name?.toLowerCase()) {
                            matchFound = true;
                        }
                    }
                })

                if (matchFound) {
                    this.searchOptions.duplicatePrompt!.title = 'Duplicate Keyword Group';
                    this.searchOptions.duplicatePrompt!.message = this.sanitizer.bypassSecurityTrustHtml('A Keyword Group with the name <span style="color: #ffba00">\"' + searchUpdate.name + '\"</span> already exists. Please choose a different name.');
                    this.searchComponent.openDuplicatePrompt();
                }
            }


            // If no match was found
            if (!matchFound) {
                this.searchComponent.commitAddEdit();
            }
        }

        // If we're verifying a child item
        if (searchUpdate.values![1].name == this.childSearchType) {
            super.onSearchItemVerify(searchUpdate);
        }
    }



    // ===========================================================( DELETE PROMPT PARENT MESSAGE )============================================================ \\

    deletePromptParentMessage(parentType: string, parentName: string): SafeHtml {

        if (parentType == 'Keyword Group') {
            return this.sanitizer.bypassSecurityTrustHtml(
                'The ' +
                parentType +
                ' <span style="color: #ffba00">\"' + parentName + '\"</span>' +
                ' and its contents will be removed.');
        } else {
            return this.sanitizer.bypassSecurityTrustHtml(
                'The ' +
                parentType +
                ' <span style="color: #ffba00">\"' + parentName + '\"</span>' +
                ' and its contents will be permanently deleted.');
        }
    }



    // =============================================================( ON HIERARCHY ITEM DELETE )============================================================== \\

    onHierarchyItemDelete(deletedItem: KeywordCheckboxItem) {
        // If we're deleting a parent item
        if (deletedItem.hierarchyGroupID == 0) {

            if (this.parentType == 'Keyword Group') {
                this.dataService.put('api/' + this.parentDataServicePath + '/Remove', {
                    productId: this.productService.product.id,
                    id: deletedItem.id
                }).subscribe();

                // If we're in hierarchy mode, get the index of the parent in the available hierarchy list that's the same as the parent that's being removed in this hierarchy list
                const removedItemIndex = this.otherArray.findIndex(x => x.id == deletedItem.id && x.hierarchyGroupID == 0);
                // Un-dim the parent in the available list that has that index
                this.otherArray[removedItemIndex].opacity = null!;
                // Un-dim it's children too (if available)
                for (let i = removedItemIndex + 1; i < this.otherArray.length; i++) {
                    if (this.otherArray[i].hierarchyGroupID! <= deletedItem.hierarchyGroupID!) break;
                    this.otherArray[i].opacity = null!;
                }


                // If we're in search mode, check to see if the removed keyword group is present in the available search list
                const searchItem = this.keywordsService.availableSearchList.find(y => y.id == deletedItem.id && y.values[1].name == 'Group');
                // If it is, then un-dim it
                if (searchItem) searchItem!.opacity = null!;

                // Also, check to see if any of the children of the removed keyword group is present in the available search list and un-dim them if found
                this.dataService.get<Array<KeywordCheckboxItem>>('api/AvailableKeywords', [{ key: 'parentId', value: deletedItem.id }])
                    .subscribe((children: Array<KeywordCheckboxItem>) => {
                        children.forEach(x => {
                            const searchItem = this.keywordsService.availableSearchList.find(y => y.id == x.id && y.values[1].name == 'Keyword');
                            if (searchItem) searchItem.opacity = null!;
                        })
                    })


            } else {
                this.dataService.delete('api/' + this.parentDataServicePath, {
                    id: deletedItem.id
                }).subscribe();
            }
        }

        // If we're deleting a child item
        if (deletedItem.hierarchyGroupID == 1) {
            this.dataService.delete('api/' + this.childDataServicePath, {
                id: deletedItem.id
            }).subscribe();
        }
    }



    // ===============================================================( ON SEARCH ITEM DELETE )=============================================================== \\

    onSearchItemDelete(deletedItem: KeywordCheckboxMultiColumnItem) {

        // If we're deleting a parent item
        if (deletedItem.values[1].name == this.parentSearchType) {
            this.dataService.delete('api/' + this.parentDataServicePath, {
                id: deletedItem.id
            }).subscribe();

            // Remove the selected keyword group from the hierarchy list
            const deletedItemIndex = this.thisArray.findIndex(x => x.id == deletedItem.id && x.hierarchyGroupID == 0);
            this.thisArray.splice(deletedItemIndex, 1);

            // If the available list is in hierarchy mode, get the index of the parent in the available hierarchy list that's the same as the parent that's being removed in this list
            const removedItemIndex = this.otherArray.findIndex(x => x.id == deletedItem.id && x.hierarchyGroupID == 0);
            // Un-dim the parent in the available list that has that index
            this.otherArray[removedItemIndex].opacity = null!;

            // Also, un-dim it's children too (if available)
            for (let i = removedItemIndex + 1; i < this.otherArray.length; i++) {
                if (this.otherArray[i].hierarchyGroupID! <= this.otherArray[removedItemIndex].hierarchyGroupID!) break;
                this.otherArray[i].opacity = null!;
            }


            // But if the available list is in search mode, check to see if the removed keyword group is present in the available search list
            const searchItem = this.keywordsService.availableSearchList.find(y => y.id == deletedItem.id && y.values[1].name == 'Group');
            // If it is, then un-dim it
            if (searchItem) searchItem!.opacity = null!;

            // Grab all the children belonging to the keyword group that's being removed  
            this.dataService.get<Array<KeywordCheckboxItem>>('api/AvailableKeywords', [{ key: 'parentId', value: deletedItem.id }])
                .subscribe((children: Array<KeywordCheckboxItem>) => {
                    children.forEach(x => {
                        // Check to see if any of the children of the removed keyword group is present in the available search list and un-dim them if any
                        const availableSearchItem = this.keywordsService.availableSearchList.find(y => y.id == x.id && y.values[1].name == 'Keyword');
                        if (availableSearchItem) availableSearchItem.opacity = null!;

                        // Plus, while we have the children of the keyword group that's being removed, remove those children from this selected keywords search list as well
                        const searchItemIndex = this.thisSearchList.findIndex(y => y.id == x.id && y.values[1].name == 'Keyword');
                        if (searchItemIndex != -1) this.thisSearchList.splice(searchItemIndex, 1);


                        // And also, check to see if these children are present in this selected keywords hierarchy list and remove them if they are
                        const hierarchyItemIndex = this.thisArray.findIndex(y => y.id == x.id && y.hierarchyGroupID == 1);
                        if (hierarchyItemIndex != -1) this.thisArray.splice(hierarchyItemIndex, 1);
                    })
                })
        }


        // If we're deleting a child item
        if (deletedItem.values[1].name == this.childSearchType) {
            super.onSearchItemDelete(deletedItem);
        }
    }



    // ================================================================( GET SEARCH RESULTS )================================================================= \\

    getSearchResults(value: string) {
        this.thisSearchList.splice(0, this.thisSearchList.length);

        this.dataService.get<Array<KeywordCheckboxSearchResultItem>>('api/' + this.parentDataServicePath + '/Search', [{ key: 'productId', value: this.productService.product.id }, { key: 'searchWords', value: value }])
            .subscribe((searchResults: Array<KeywordCheckboxSearchResultItem>) => {

                // As long as search results were returned
                if (searchResults) {
                    searchResults.forEach(x => {
                        this.thisSearchList.push({

                            id: x.id!,
                            values: [{ name: x.name!, width: this.searchNameWidth, allowEdit: true, color: x.forProduct ? '#ffba00' : null! }, { name: x.type!, width: this.searchTypeWidth, color: x.forProduct ? '#ffba00' : null! }],
                            checked: x.checked,
                            forProduct: x.forProduct
                        })
                    })
                }
            });
    }



    // ===========================================================( SORT PENDING HIERARCHY ITEMS )============================================================ \\

    sortPendingHierarchyItems() {
        // Selected keywords has its own sort pending function
    }



    // ====================================================================( IS DISABLED )==================================================================== \\

    isDisabled(disabledUpdateProperty: keyof HierarchyUpdate | keyof MultiColumnListUpdate): boolean {

        // If we're in hierarchy mode
        if (!this.searchMode) {

            // As long as the hierarchy update is not null
            if (this.hierarchyUpdate) {

                // NOT custom
                if (this.parentType == 'Keyword Group') {
                    if (disabledUpdateProperty == 'addDisabled') {
                        return this.addDisabled;

                    } else if (disabledUpdateProperty == 'editDisabled') {
                        return this.editDisabled;

                    } else if (disabledUpdateProperty == 'deleteDisabled') {
                        return this.deleteDisabled;
                    } else {
                        let hierarchyDisabledUpdateProperty = disabledUpdateProperty as keyof HierarchyUpdate;
                        return this.hierarchyUpdate[hierarchyDisabledUpdateProperty] as boolean;
                    }

                    // Custom
                } else {
                    let hierarchyDisabledUpdateProperty = disabledUpdateProperty as keyof HierarchyUpdate;
                    return this.hierarchyUpdate[hierarchyDisabledUpdateProperty] as boolean;
                }
            }

            // If we're in search mode
        } else if (this.searchMode && this.thisSearchList.length > 0) {

            // As long as the search update is not null
            if (this.searchUpdate) {

                // NOT custom
                if (this.parentType == 'Keyword Group') {

                    if (disabledUpdateProperty == 'editDisabled') {
                        return this.editDisabled;

                    } else if (disabledUpdateProperty == 'deleteDisabled') {
                        return this.deleteDisabled;
                    } else {
                        let searchDisabledUpdateProperty = disabledUpdateProperty as keyof MultiColumnListUpdate;
                        return this.searchUpdate[searchDisabledUpdateProperty] as boolean;
                    }


                    // Custom
                } else {

                    let searchDisabledUpdateProperty = disabledUpdateProperty as keyof MultiColumnListUpdate;
                    return this.searchUpdate[searchDisabledUpdateProperty] as boolean;
                }
            }
        }
        // Otherwise, set as disabled
        return true;
    }



    // ====================================================================( BUILD MENU )===================================================================== \\

    buildMenu(hierarchyUpdate: CheckboxListUpdate) {
        this.hierarchyOptions.menu = {
            parentObj: this,
            menuOptions: [
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
        }

        if (hierarchyUpdate.selectedItems![0].hierarchyGroupID == 0) {

            // If a custom keyword group was NOT selected
            if (!this.thisArray[hierarchyUpdate.selectedItems![0].index!].forProduct) {
                this.hierarchyOptions.menu!.menuOptions[0].hidden = false;
                this.hierarchyOptions.menu!.menuOptions[1].hidden = true;
                this.hierarchyOptions.menu!.menuOptions[2].hidden = true;
                this.hierarchyOptions.menu!.menuOptions[3].hidden = true;
                this.hierarchyOptions.menu!.menuOptions[5].hidden = false;
                this.hierarchyOptions.menu!.menuOptions[0].name = 'Add Custom ' + this.parentType;
                this.hierarchyOptions.menu!.menuOptions[5].name = 'Remove ' + this.parentType;

                // If a custom keyword group WAS selected
            } else {

                this.hierarchyOptions.menu!.menuOptions[1].hidden = false;
                this.hierarchyOptions.menu!.menuOptions[2].hidden = false;
                this.hierarchyOptions.menu!.menuOptions[3].hidden = false;
                this.hierarchyOptions.menu!.menuOptions[5].hidden = false;
                this.hierarchyOptions.menu!.menuOptions[1].optionFunction = this.add;
                this.hierarchyOptions.menu!.menuOptions[0].name = 'Add ' + this.parentType;
                this.hierarchyOptions.menu!.menuOptions[1].name = 'Add ' + this.childType;
                this.hierarchyOptions.menu!.menuOptions[3].name = 'Rename ' + this.parentType;
                this.hierarchyOptions.menu!.menuOptions[5].name = 'Delete ' + this.parentType;
            }
            this.hierarchyOptions.menu!.menuOptions[0].hidden = false;
            this.hierarchyOptions.menu!.menuOptions[0].optionFunction = this.addParent;
        }

        if (hierarchyUpdate.selectedItems![0].hierarchyGroupID == 1) {
            this.hierarchyOptions.menu!.menuOptions[0].hidden = false;
            this.hierarchyOptions.menu!.menuOptions[1].hidden = true;
            this.hierarchyOptions.menu!.menuOptions[2].hidden = false;
            this.hierarchyOptions.menu!.menuOptions[3].hidden = false;
            this.hierarchyOptions.menu!.menuOptions[5].hidden = false;
            this.hierarchyOptions.menu!.menuOptions[0].optionFunction = this.add;
            this.hierarchyOptions.menu!.menuOptions[0].name = 'Add ' + this.childType;
            this.hierarchyOptions.menu!.menuOptions[3].name = 'Rename ' + this.childType;
            this.hierarchyOptions.menu!.menuOptions[5].name = 'Delete ' + this.childType;
        }
    }
}