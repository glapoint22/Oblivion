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
import { HierarchyUpdateManager } from "./hierarchy-update-manager";

export class SelectedKeywordsManager extends KeywordsFormManager {
    // Private
    private addDisabled!: boolean;
    private editDisabled!: boolean;
    private deleteDisabled!: boolean;

    // Public
    public thisArray: Array<KeywordCheckboxItem> = new Array<KeywordCheckboxItem>();
    public thisSearchList: Array<KeywordCheckboxMultiColumnItem> = new Array<KeywordCheckboxMultiColumnItem>();


    // ====================================================================( CONSTRUCTOR )==================================================================== \\

    constructor(dataService: DataService, sanitizer: DomSanitizer, keywordsService: KeywordsService, productService: ProductService) {
        super(dataService, sanitizer, keywordsService, productService);
        this.searchNameWidth = '296px';
        this.sortType = SortType.Product;
        this.dataServicePath = 'SelectedKeywords/Groups';
        this.childDataServicePath = 'SelectedKeywords';
        this.childType = 'Custom Keyword';
        this.keywordsService.selectedKeywordsArray = this.thisArray;
        this.keywordsService.selectedKeywordsSearchList = this.thisSearchList;
    }


    // ======================================================================( ON OPEN )====================================================================== \\

    onOpen() {
        this.itemType = 'Custom Keyword Group';
        super.onOpen();
    }



    // ==================================================================( ON ARROW CLICK )=================================================================== \\

    onArrowClick(hierarchyUpdate: HierarchyUpdate) {
        HierarchyUpdateManager.prototype.onArrowClick.call(this, hierarchyUpdate);
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
                    this.listComponent.listManager.sort(x);
                });
                this.keywordsService.sortList = [];
            })

        }
    }



    // =======================================================================( ADD )========================================================================= \\

    add() {
        this.listComponent.listManager.editable = true;
        // If an item is selected and that item is a custom keyword group
        if (this.listComponent.listManager.selectedItem != null && this.listComponent.listManager.selectedItem.hierarchyGroupID == 0) {
            // Check to see if that custom keyword group has had its children loaded yet
            if (!this.listComponent.listManager.hasChildren(this.listComponent.listManager.selectedItem)) {
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
        this.editIconButtonTitle = 'Edit';
        this.deleteIconButtonTitle = 'Delete';
        this.thisArray.forEach(x => x.forProduct ? x.color = '#6e5000' : null);
        const newKeyword = this.thisArray.find(x => x.id == -1);
        newKeyword!.color = '#ffba00';
        if (newKeyword?.hierarchyGroupID == 1) {
            newKeyword!.checked = true;
        }
    }



    // ====================================================================( ADD PARENT )===================================================================== \\

    addParent() {
        this.listComponent.listManager.editable = true;
        super.addParent();
        this.deleteDisabled = true;
        this.addIconButtonTitle = 'Add';
        this.editIconButtonTitle = 'Edit';
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
            this.listComponent.edit();
            this.thisArray.forEach(x => x.forProduct && x != this.listComponent.listManager.editedItem ? x.color = '#6e5000' : null);
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

    onListUpdate(hierarchyUpdate: CheckboxListUpdate) {
        super.onListUpdate(hierarchyUpdate);
        if (hierarchyUpdate.type == ListUpdateType.CheckboxChange) this.onItemCheckboxChange(hierarchyUpdate);
        if (hierarchyUpdate.type == ListUpdateType.DoubleClick) this.onItemDoubleClick();
    }



    // =================================================================( ON SEARCH UPDATE )================================================================== \\

    onSearchListUpdate(searchUpdate: CheckboxMultiColumnListUpdate) {
        super.onSearchListUpdate(searchUpdate);
        if (searchUpdate.type == ListUpdateType.CheckboxChange) this.onSearchItemCheckboxChange(searchUpdate);
        if (searchUpdate.type == ListUpdateType.DoubleClick) this.onSearchItemDoubleClick();
    }



    // ============================================================( ON SELECTED HIERARCHY ITEM )============================================================= \\

    onSelectedItem(hierarchyUpdate: CheckboxListUpdate) {
        if (hierarchyUpdate.selectedItems![0].hierarchyGroupID == 0) {

            // If we're NOT selecting a custom keyword group
            if (!this.thisArray[hierarchyUpdate.selectedItems![0].index!].forProduct) {
                this.itemType = 'Keyword Group';
                this.addDisabled = true;
                this.editDisabled = true;
                this.deleteDisabled = false;
                this.addIconButtonTitle = 'Add';
                this.editIconButtonTitle = 'Rename';
                this.deleteIconButtonTitle = 'Remove ' + this.itemType;
                this.listComponent.listManager.editable = false;
                this.listOptions.deletePrompt!.title = 'Remove ' + this.itemType;
                this.listOptions.deletePrompt!.primaryButton!.name = 'Remove';
                this.buildMenu(hierarchyUpdate);

                // If we ARE selecting a custom keyword group
            } else {
                this.itemType = 'Custom Keyword Group';
                this.listComponent.listManager.editable = true;
                this.addIconButtonTitle = 'Add ' + this.childType;
                this.editIconButtonTitle = 'Rename ' + this.itemType;
                this.deleteIconButtonTitle = 'Delete ' + this.itemType;
                this.listOptions.deletePrompt!.title = 'Delete ' + this.itemType;
                this.listOptions.deletePrompt!.primaryButton!.name = 'Delete';
                this.buildMenu(hierarchyUpdate);

                // If the custom keyword was selected after it was in edit mode
                if (this.listComponent.listManager.editedItem != null) {
                    this.thisArray.forEach(x => x.forProduct ? x.color = '#ffba00' : null);
                }
            }
        }

        if (hierarchyUpdate.selectedItems![0].hierarchyGroupID == 1) {
            this.itemType = 'Custom Keyword Group';

            // If we're NOT selecting a custom keyword (a selection can NOT be made so we stay in custom mode)
            if (!this.thisArray[hierarchyUpdate.selectedItems![0].index!].forProduct) {
                this.listOptions.menu = null!;
                this.editIconButtonTitle = 'Rename';
                this.deleteIconButtonTitle = 'Delete';
                this.addIconButtonTitle = 'Add ' + this.itemType;
                this.listComponent.listManager.editable = false;
                this.listComponent.listManager.selectedItem.selected = false;
                this.listComponent.listManager.selectedItem.selectType = null!;
                this.listComponent.listManager.selectedItem = null!;

                // If we ARE selecting a custom keyword
            } else {

                this.listComponent.listManager.editable = true;
                this.addIconButtonTitle = 'Add ' + this.childType;
                this.editIconButtonTitle = 'Rename ' + this.childType;
                this.deleteIconButtonTitle = 'Delete ' + this.childType;
                this.listOptions.deletePrompt!.title = 'Delete ' + this.childType;
                this.listOptions.deletePrompt!.primaryButton!.name = 'Delete';
                this.buildMenu(hierarchyUpdate);

                // If the custom keyword was selected after it was in edit mode
                if (this.listComponent.listManager.editedItem != null) {
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
                this.itemType = 'Keyword Group';
                this.editDisabled = true;
                this.deleteDisabled = false;
                this.editIconButtonTitle = 'Rename';
                this.deleteIconButtonTitle = 'Remove ' + this.itemType;
                searchUpdate.selectedMultiColumnItems![0].values[0].allowEdit = false;
                this.searchOptions.deletePrompt!.title = 'Remove ' + this.itemType;
                this.searchOptions.deletePrompt!.primaryButton!.name = 'Remove';
                this.searchOptions.menu!.menuOptions[0].hidden = true;
                this.searchOptions.menu!.menuOptions[1].hidden = false;
                this.searchOptions.menu!.menuOptions[2].hidden = false;
                this.searchOptions.menu!.menuOptions[1].name = 'Remove ' + this.itemType;
                this.searchOptions.menu!.menuOptions[3].name = 'Go to ' + this.itemType + ' in Hierarchy';

                // If we ARE selecting a custom keyword group
            } else {

                this.itemType = 'Custom Keyword Group';
                searchUpdate.selectedMultiColumnItems![0].values[0].allowEdit = true;
                this.editIconButtonTitle = 'Rename ' + this.itemType;
                this.deleteIconButtonTitle = 'Delete ' + this.itemType;
                this.searchOptions.deletePrompt!.title = 'Delete ' + this.itemType;
                this.searchOptions.deletePrompt!.primaryButton!.name = 'Delete';
                this.searchOptions.menu!.menuOptions[0].hidden = false;
                this.searchOptions.menu!.menuOptions[1].hidden = false;
                this.searchOptions.menu!.menuOptions[2].hidden = false;
                this.searchOptions.menu!.menuOptions[0].name = 'Rename ' + this.itemType;
                this.searchOptions.menu!.menuOptions[1].name = 'Delete ' + this.itemType;
                this.searchOptions.menu!.menuOptions[3].name = 'Go to ' + this.itemType + ' in Hierarchy';

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
                this.itemType = 'Keyword Group';
                this.editDisabled = true;
                this.deleteDisabled = true;
                this.editIconButtonTitle = 'Rename';
                this.deleteIconButtonTitle = 'Delete';
                searchUpdate.selectedMultiColumnItems![0].values[0].allowEdit = false;
                this.searchOptions.menu!.menuOptions[0].hidden = true;
                this.searchOptions.menu!.menuOptions[1].hidden = true;
                this.searchOptions.menu!.menuOptions[2].hidden = true;
                this.searchOptions.menu!.menuOptions[3].name = 'Go to ' + this.childType + ' in Hierarchy';

                // If we ARE selecting a custom keyword
            } else {

                this.childType = 'Custom Keyword';
                this.itemType = 'Custom Keyword Group';
                searchUpdate.selectedMultiColumnItems![0].values[0].allowEdit = true;
                this.editIconButtonTitle = 'Rename ' + this.childType;
                this.deleteIconButtonTitle = 'Delete ' + this.childType;
                this.searchOptions.deletePrompt!.title = 'Delete ' + this.childType;
                this.searchOptions.deletePrompt!.primaryButton!.name = 'Delete';
                this.searchOptions.menu!.menuOptions[0].hidden = false;
                this.searchOptions.menu!.menuOptions[1].hidden = false;
                this.searchOptions.menu!.menuOptions[2].hidden = false;
                this.searchOptions.menu!.menuOptions[0].name = 'Rename ' + this.childType;
                this.searchOptions.menu!.menuOptions[1].name = 'Delete ' + this.childType;
                this.searchOptions.menu!.menuOptions[3].name = 'Go to ' + this.childType + ' in Hierarchy';

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

    onItemDoubleClick() {
        // As long as we're double clicking on a custom item
        if (this.listComponent.listManager.editedItem != null) {
            this.addIconButtonTitle = 'Add';
            this.editIconButtonTitle = 'Rename';
            this.deleteIconButtonTitle = 'Delete';
            this.thisArray.forEach(x => x.forProduct && x != this.listComponent.listManager.editedItem ? x.color = '#6e5000' : null);
        }
    }



    // ============================================================( ON SEARCH ITEM DOUBLE CLICK )============================================================ \\

    onSearchItemDoubleClick() {
        if (this.itemType == 'Custom Keyword Group') {
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

    onItemCheckboxChange(hierarchyUpdate: CheckboxListUpdate) {
        // ********* commited Data Service *********
        // this.dataService.put('api/' + this.childDataServicePath + '/Update', {
        //     productId: this.productService.product.id,
        //     id: hierarchyUpdate.id,
        //     checked: hierarchyUpdate.checked
        // }).subscribe();
    }



    // =============================================================( ON SEARCH CHECKBOX CHANGE )============================================================= \\

    onSearchItemCheckboxChange(checkboxMultiColumnListUpdate: CheckboxMultiColumnListUpdate) {
        // ********* commited Data Service *********
        // this.dataService.put('api/' + this.childDataServicePath + '/Update', {
        //     productId: this.productService.product.id,
        //     id: checkboxMultiColumnListUpdate.id,
        //     checked: checkboxMultiColumnListUpdate.checked
        // }).subscribe();

        // Check to see if the search item that had the checkbox change is visible in the hierarchy
        const hierarchyItem = this.thisArray.find(x => x.id == checkboxMultiColumnListUpdate.id && x.hierarchyGroupID == 1);
        // If it is, make the change to its checkbox as well
        if (hierarchyItem) hierarchyItem.checked = checkboxMultiColumnListUpdate.checked;
    }



    // ===========================================================( ON UNSELECTED HIERARCHY ITEM )============================================================ \\

    onUnselectedItem() {
        this.itemType = 'Custom Keyword Group';
        this.addIconButtonTitle = 'Add ' + this.itemType;
        this.editIconButtonTitle = 'Rename';
        this.deleteIconButtonTitle = 'Delete';
        // When an item was going to be added but was cancelled
        this.thisArray.forEach(x => x.forProduct ? x.color = '#ffba00' : null);
    }



    // =============================================================( ON UNSELECTED SEARCH ITEM )============================================================= \\

    onUnselectedSearchItem() {
        this.itemType = 'Custom Keyword Group';
        this.editIconButtonTitle = 'Rename';
        this.deleteIconButtonTitle = 'Delete';
    }



    // ===============================================================( ON HIERARCHY ITEM ADD )=============================================================== \\
    private selectedKeywordsAdd: number = 4000;
    onItemAdd(hierarchyUpdate: HierarchyUpdate) {
        this.selectedKeywordsAdd++;
        // Add parent hierarchy item
        if (hierarchyUpdate.hierarchyGroupID == 0) {
            // ********* commited Data Service *********
            // this.dataService.post<number>('api/' + this.dataServicePath, {
            //     id: this.productService.product.id,
            //     name: hierarchyUpdate.name
            // }).subscribe((id: number) => {
            this.thisArray[hierarchyUpdate.index!].id = this.selectedKeywordsAdd//id;
            this.thisArray[hierarchyUpdate.index!].forProduct = true;
            // });
        }

        // Add child hierarchy item
        if (hierarchyUpdate.hierarchyGroupID == 1) {
            const indexOfHierarchyItemParent = this.listComponent.listManager.getIndexOfHierarchyItemParent(this.thisArray[hierarchyUpdate.index!]);
            // ********* commited Data Service *********
            // this.dataService.post<number>('api/' + this.childDataServicePath, {
            //     id: this.thisArray[indexOfHierarchyItemParent].id,
            //     name: hierarchyUpdate.name
            // }).subscribe((id: number) => {
            this.thisArray[hierarchyUpdate.index!].id = this.selectedKeywordsAdd//id;
            this.thisArray[hierarchyUpdate.index!].forProduct = true;
            // })
        }
        this.thisArray.forEach(x => x.forProduct ? x.color = '#ffba00' : null);
    }



    // =============================================================( ON HIERARCHY ITEM VERIFY )============================================================== \\

    onItemVerify(hierarchyUpdate: HierarchyUpdate) {
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
                this.listOptions.duplicatePrompt!.title = 'Duplicate Custom Keyword Group';
                this.listOptions.duplicatePrompt!.message = this.sanitizer.bypassSecurityTrustHtml('A Custom Keyword Group with the name <span style="color: #ffba00">\"' + hierarchyUpdate.name + '\"</span> already exists. Please choose a different name.');
                this.listComponent.openDuplicatePrompt();
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
                    this.listOptions.duplicatePrompt!.title = 'Duplicate Keyword Group';
                    this.listOptions.duplicatePrompt!.message = this.sanitizer.bypassSecurityTrustHtml('A Keyword Group with the name <span style="color: #ffba00">\"' + hierarchyUpdate.name + '\"</span> already exists. Please choose a different name.');
                    this.listComponent.openDuplicatePrompt();
                }
            }

            // If no match was found
            if (!matchFound) {
                this.listComponent.commitAddEdit();
            }
        }

        // If we're verifying a child item
        if (hierarchyUpdate.hierarchyGroupID == 1) {
            super.onItemVerify(hierarchyUpdate);
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

    deletePromptMessage(itemType: string, parentName: string): SafeHtml {

        if (itemType == 'Keyword Group') {
            return this.sanitizer.bypassSecurityTrustHtml(
                'The ' +
                itemType +
                ' <span style="color: #ffba00">\"' + parentName + '\"</span>' +
                ' and its contents will be removed.');
        } else {
            return this.sanitizer.bypassSecurityTrustHtml(
                'The ' +
                itemType +
                ' <span style="color: #ffba00">\"' + parentName + '\"</span>' +
                ' and its contents will be permanently deleted.');
        }
    }



    // =============================================================( ON HIERARCHY ITEM DELETE )============================================================== \\

    onItemDelete(deletedItem: KeywordCheckboxItem) {
        // If we're deleting a parent item
        if (deletedItem.hierarchyGroupID == 0) {

            if (this.itemType == 'Keyword Group') {
                // ********* commited Data Service *********
                // this.dataService.put('api/' + this.dataServicePath + '/Remove', {
                //     productId: this.productService.product.id,
                //     id: deletedItem.id
                // }).subscribe();


                // Get the index of the parent in the available hierarchy list that's the same as the parent that's being removed in this hierarchy list
                const removedItemIndex = this.otherArray.findIndex(x => x.id == deletedItem.id && x.name == deletedItem.name && x.hierarchyGroupID == 0);
                if (removedItemIndex) {
                    // Un-dim the parent in the available list that has that index
                    this.otherArray[removedItemIndex].opacity = null!;
                    // Un-dim it's children too (if available)
                    for (let i = removedItemIndex + 1; i < this.otherArray.length; i++) {
                        if (this.otherArray[i].hierarchyGroupID! <= deletedItem.hierarchyGroupID!) break;
                        this.otherArray[i].opacity = null!;
                    }
                }

                // Check to see if the removed keyword group is present in the available search list
                const searchItem = this.keywordsService.availableSearchList.find(y => y.id == deletedItem.id && y.values[0].name == deletedItem.name && y.values[1].name == 'Group');
                // If it is, then un-dim it
                if (searchItem) searchItem!.opacity = null!;

                // Also, check to see if any of the children of the removed keyword group is present in the available search list and un-dim them if found
                this.dataService.get<Array<KeywordCheckboxItem>>('api/AvailableKeywords', [{ key: 'parentId', value: deletedItem.id }])
                    .subscribe((children: Array<KeywordCheckboxItem>) => {
                        children.forEach(x => {
                            const searchItem = this.keywordsService.availableSearchList.find(y => y.id == x.id && y.values[0].name == x.name && y.values[1].name == 'Keyword');
                            if (searchItem) searchItem.opacity = null!;
                        })
                    })


            } else {
                // ********* commited Data Service *********
                // this.dataService.delete('api/' + this.dataServicePath, {
                //     id: deletedItem.id
                // }).subscribe();
            }
        }

        // If we're deleting a child item
        if (deletedItem.hierarchyGroupID == 1) {
            // ********* commited Data Service *********
            // this.dataService.delete('api/' + this.childDataServicePath, {
            //     id: deletedItem.id
            // }).subscribe();
        }
    }



    // ===============================================================( ON SEARCH ITEM DELETE )=============================================================== \\

    onSearchItemDelete(deletedItem: KeywordCheckboxMultiColumnItem) {

        // If we're deleting a parent item
        if (deletedItem.values[1].name == this.parentSearchType) {
            // ********* commited Data Service *********
            // this.dataService.delete('api/' + this.dataServicePath, {
            //     id: deletedItem.id
            // }).subscribe();


            // Remove the selected keyword group from the hierarchy list
            const deletedItemIndex = this.thisArray.findIndex(x => x.id == deletedItem.id && x.name == deletedItem.values[0].name && x.hierarchyGroupID == 0);
            if (deletedItemIndex) this.thisArray.splice(deletedItemIndex, 1);

            if (this.itemType == 'Keyword Group') {

                // If the available list is in hierarchy mode, get the index of the parent in the available hierarchy list that's the same as the parent that's being removed in this list
                const removedItemIndex = this.otherArray.findIndex(x => x.id == deletedItem.id && x.name == deletedItem.values[0].name && x.hierarchyGroupID == 0);

                if (removedItemIndex) {
                    // Un-dim the parent in the available list that has that index
                    this.otherArray[removedItemIndex].opacity = null!;

                    // Also, un-dim it's children too (if available)
                    for (let i = removedItemIndex + 1; i < this.otherArray.length; i++) {
                        if (this.otherArray[i].hierarchyGroupID! <= this.otherArray[removedItemIndex].hierarchyGroupID!) break;
                        this.otherArray[i].opacity = null!;
                    }
                }

                // But if the available list is in search mode, check to see if the removed keyword group is present in the available search list
                const searchItem = this.keywordsService.availableSearchList.find(y => y.id == deletedItem.id && y.values[0].name == deletedItem.values[0].name && y.values[1].name == 'Group');
                // If it is, then un-dim it
                if (searchItem) searchItem!.opacity = null!;
            }

            // Grab all the children belonging to the keyword group that's being removed  
            this.dataService.get<Array<KeywordCheckboxItem>>('api/AvailableKeywords', [{ key: 'parentId', value: deletedItem.id }])
                .subscribe((children: Array<KeywordCheckboxItem>) => {

                    children.forEach(x => {

                        // Check to see if any of the children of the removed keyword group is present in the available search list and un-dim them if any
                        const availableSearchItem = this.keywordsService.availableSearchList.find(y => y.id == x.id && y.values[0].name == x.name && y.values[1].name == 'Keyword');
                        if (availableSearchItem) availableSearchItem.opacity = null!;

                        // Plus, while we have the children of the keyword group that's being removed, remove those children from this selected keywords search list as well
                        const searchItemIndex = this.thisSearchList.findIndex(y => y.id == x.id && y.values[0].name == x.name && y.values[1].name == 'Keyword');
                        if (searchItemIndex != -1) this.thisSearchList.splice(searchItemIndex, 1);

                        // And also, check to see if these children are present in this selected keywords hierarchy list and remove them if they are
                        const hierarchyItemIndex = this.thisArray.findIndex(y => y.id == x.id && y.name == x.name && y.hierarchyGroupID == 1);
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

        this.dataService.get<Array<KeywordCheckboxSearchResultItem>>('api/' + this.dataServicePath + '/Search', [{ key: 'productId', value: this.productService.product.id }, { key: 'searchWords', value: value }])
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

    sortPendingItems() {
        // Selected keywords has its own sort pending function
    }



    // ====================================================================( IS DISABLED )==================================================================== \\

    isDisabled(disabledUpdateProperty: keyof HierarchyUpdate | keyof MultiColumnListUpdate): boolean {

        // If we're in hierarchy mode
        if (!this.searchMode) {

            // As long as the hierarchy update is not null
            if (this.listUpdate) {

                // NOT custom
                if (this.itemType == 'Keyword Group') {
                    if (disabledUpdateProperty == 'addDisabled') {
                        return this.addDisabled;

                    } else if (disabledUpdateProperty == 'editDisabled') {
                        return this.editDisabled;

                    } else if (disabledUpdateProperty == 'deleteDisabled') {
                        return this.deleteDisabled;
                    } else {
                        let hierarchyDisabledUpdateProperty = disabledUpdateProperty as keyof HierarchyUpdate;
                        return this.listUpdate[hierarchyDisabledUpdateProperty] as boolean;
                    }

                    // Custom
                } else {
                    let hierarchyDisabledUpdateProperty = disabledUpdateProperty as keyof HierarchyUpdate;
                    return this.listUpdate[hierarchyDisabledUpdateProperty] as boolean;
                }
            }

            // If we're in search mode
        } else if (this.searchMode && this.thisSearchList.length > 0) {

            // As long as the search update is not null
            if (this.searchUpdate) {

                // NOT custom
                if (this.itemType == 'Keyword Group') {

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
        this.listOptions.menu = {
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
                this.listOptions.menu!.menuOptions[0].hidden = false;
                this.listOptions.menu!.menuOptions[1].hidden = true;
                this.listOptions.menu!.menuOptions[2].hidden = true;
                this.listOptions.menu!.menuOptions[3].hidden = true;
                this.listOptions.menu!.menuOptions[4].hidden = false;
                this.listOptions.menu!.menuOptions[5].hidden = false;
                this.listOptions.menu!.menuOptions[0].name = 'Add Custom ' + this.itemType;
                this.listOptions.menu!.menuOptions[5].name = 'Remove ' + this.itemType;

                // If a custom keyword group WAS selected
            } else {

                this.listOptions.menu!.menuOptions[1].hidden = false;
                this.listOptions.menu!.menuOptions[2].hidden = false;
                this.listOptions.menu!.menuOptions[3].hidden = false;
                this.listOptions.menu!.menuOptions[4].hidden = false;
                this.listOptions.menu!.menuOptions[5].hidden = false;
                this.listOptions.menu!.menuOptions[1].optionFunction = this.add;
                this.listOptions.menu!.menuOptions[0].name = 'Add ' + this.itemType;
                this.listOptions.menu!.menuOptions[1].name = 'Add ' + this.childType;
                this.listOptions.menu!.menuOptions[3].name = 'Rename ' + this.itemType;
                this.listOptions.menu!.menuOptions[5].name = 'Delete ' + this.itemType;
            }
            this.listOptions.menu!.menuOptions[0].hidden = false;
            this.listOptions.menu!.menuOptions[0].optionFunction = this.addParent;
        }

        if (hierarchyUpdate.selectedItems![0].hierarchyGroupID == 1) {
            this.listOptions.menu!.menuOptions[0].hidden = false;
            this.listOptions.menu!.menuOptions[1].hidden = true;
            this.listOptions.menu!.menuOptions[2].hidden = true;
            this.listOptions.menu!.menuOptions[3].hidden = false;
            this.listOptions.menu!.menuOptions[4].hidden = true;
            this.listOptions.menu!.menuOptions[5].hidden = false;
            this.listOptions.menu!.menuOptions[0].optionFunction = this.add;
            this.listOptions.menu!.menuOptions[0].name = 'Add ' + this.childType;
            this.listOptions.menu!.menuOptions[3].name = 'Rename ' + this.childType;
            this.listOptions.menu!.menuOptions[5].name = 'Delete ' + this.childType;
        }
    }



    getItem(x: KeywordCheckboxItem) {
        return {
            id: x.id,
            name: x.name,
            hierarchyGroupID: 0,
            hidden: false,
            arrowDown: false,
            forProduct: x.forProduct,
            color: x.forProduct ? '#ffba00' : null!
        }
    }




    getOtherItem(x: KeywordCheckboxItem) {
        return null!
    }




    getChildItem(child: KeywordCheckboxItem) {
        return {
            id: child.id,
            name: child.name,
            hierarchyGroupID: 1,
            hidden: false,
            checked: child.checked,
            forProduct: child.forProduct,
            color: child.forProduct ? '#ffba00' : null!
        }
    }



    getChildItems(hierarchyUpdate: HierarchyUpdate) {
        this.dataService.get<Array<KeywordCheckboxItem>>('api/' + this.childDataServicePath, [{ key: 'parentId', value: hierarchyUpdate.id }, { key: 'productId', value: this.productService.product.id }])
            .subscribe((children: Array<KeywordCheckboxItem>) => {
                window.setTimeout(() => {
                    let num = this.listComponent.listManager.editedItem ? 2 : 1;
                    for (let i = children.length - 1; i >= 0; i--) {
                        (this.thisArray as KeywordCheckboxItem[]).splice(hierarchyUpdate.index! + num, 0, this.getChildItem(children[i]));
                    }
                    this.onChildrenLoad.next();
                })
            })
    }




}