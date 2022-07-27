import { SafeHtml } from "@angular/platform-browser";
import { CheckboxListUpdate } from "./checkbox-list-update";
import { CheckboxMultiColumnListUpdate } from "./checkbox-multi-column-list-update";
import { CaseType, ListUpdateType, MenuOptionType } from "./enums";
import { HierarchyUpdate } from "./hierarchy-update";
import { MultiColumnListUpdate } from "./multi-column-list-update";
import { KeywordCheckboxSearchResultItem } from "./keyword-checkbox-search-result-item";
import { FormKeywordsUpdateManager } from "./form-keywords-update-manager";
import { KeywordCheckboxItem } from "./keyword-checkbox-item";
import { KeywordCheckboxMultiColumnItem } from "./keyword-checkbox-multi-column-item";
import { HierarchyUpdateManager } from "./hierarchy-update-manager";
import { KeyValue } from "@angular/common";
import { HierarchyItem } from "./hierarchy-item";
import { Directive, ViewChild } from "@angular/core";
import { HierarchyComponent } from "../components/hierarchies/hierarchy/hierarchy.component";
import { CheckboxMultiColumnListComponent } from "../components/lists/checkbox-multi-column-list/checkbox-multi-column-list.component";
import { MultiColumnItem } from "./multi-column-item";

@Directive()
export class SelectedKeywordsUpdateManager extends FormKeywordsUpdateManager {
    // Private
    private addDisabled!: boolean;
    private editDisabled!: boolean;
    private deleteDisabled!: boolean;

    // Public
    public thisArray: Array<KeywordCheckboxItem> = new Array<KeywordCheckboxItem>();
    public thisSearchArray: Array<KeywordCheckboxMultiColumnItem> = new Array<KeywordCheckboxMultiColumnItem>();

    // Decorators
    @ViewChild('selectedHierarchyComponent') listComponent!: HierarchyComponent;
    @ViewChild('selectedSearchComponent') searchComponent!: CheckboxMultiColumnListComponent;


    // ====================================================================( NG ON INIT )===================================================================== \\

    ngOnInit() {
        super.ngOnInit();
        this.itemType = 'Custom Keyword Group';
        this.searchNameWidth = '296px';
        this.dataServicePath = 'SelectedKeywords/Groups';
        this.childDataServicePath = 'SelectedKeywords';
        this.childType = 'Custom Keyword';
        // this.keywordsService.selectedKeywordsArray = this.thisArray;
        // this.keywordsService.selectedKeywordsSearchList = this.thisSearchArray;
        this.searchInputName = 'selectedKeywordsSearchInput';
        this.parentSearchType = 'Group';
        this.childSearchType = 'Keyword';
        this.searchTypeWidth = '68px';
    }



    // ==================================================================( ON ARROW CLICK )=================================================================== \\

    onArrowClick(hierarchyUpdate: HierarchyUpdate) {
        HierarchyUpdateManager.prototype.onArrowClick.call(this, hierarchyUpdate);
    }



    // =======================================================================( ADD )========================================================================= \\

    add() {
        super.add();
        const newKeyword = this.thisArray.find(x => x.id == -1);
        newKeyword!.color = '#ffba00';
        if (newKeyword?.hierarchyGroupID == 1) {
            newKeyword!.checked = true;
        }
    }



    // ====================================================================( ADD PARENT )===================================================================== \\

    addParent() {
        super.addParent();
        this.deleteDisabled = true;
        const newKeyword = this.thisArray.find(x => x.id == -1);
        newKeyword!.color = '#ffba00';
    }



    // ==================================================================( ON LIST UPDATE )=================================================================== \\

    onListUpdate(hierarchyUpdate: CheckboxListUpdate) {
        super.onListUpdate(hierarchyUpdate);
        if (hierarchyUpdate.type == ListUpdateType.CheckboxChange) this.onItemCheckboxChange(hierarchyUpdate);
    }



    // ===============================================================( ON SEARCH LIST UPDATE )=============================================================== \\

    onSearchListUpdate(searchUpdate: CheckboxMultiColumnListUpdate) {
        super.onSearchListUpdate(searchUpdate);
        if (searchUpdate.type == ListUpdateType.CheckboxChange) this.onSearchItemCheckboxChange(searchUpdate);
        if (searchUpdate.type == ListUpdateType.DoubleClick) this.onSearchItemDoubleClick();
    }



    // =================================================================( ON SELECTED ITEM )================================================================== \\

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
                this.listOptions.deletePrompt!.title = 'Remove ' + this.itemType;
                this.listOptions.deletePrompt!.primaryButton!.name = 'Remove';
                this.listOptions.menu!.menuOptions[0].hidden = false;
                this.listOptions.menu!.menuOptions[1].hidden = true;
                this.listOptions.menu!.menuOptions[2].hidden = true;
                this.listOptions.menu!.menuOptions[3].hidden = true;
                this.listOptions.menu!.menuOptions[4].hidden = false;
                this.listOptions.menu!.menuOptions[5].hidden = false;
                this.listOptions.menu!.menuOptions[0].name = 'Add Custom ' + this.itemType;
                this.listOptions.menu!.menuOptions[5].name = 'Remove ' + this.itemType;

                // If we ARE selecting a custom keyword group
            } else {
                this.itemType = 'Custom Keyword Group';
                this.addIconButtonTitle = 'Add ' + this.childType;
                this.editIconButtonTitle = 'Rename ' + this.itemType;
                this.deleteIconButtonTitle = 'Delete ' + this.itemType;
                this.listOptions.deletePrompt!.title = 'Delete ' + this.itemType;
                this.listOptions.deletePrompt!.primaryButton!.name = 'Delete';
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
            this.itemType = 'Custom Keyword Group';

            // If we're NOT selecting a custom keyword (a selection can NOT be made so we stay in custom mode)
            if (!this.thisArray[hierarchyUpdate.selectedItems![0].index!].forProduct) {
                this.editIconButtonTitle = 'Rename';
                this.deleteIconButtonTitle = 'Delete';
                this.addIconButtonTitle = 'Add ' + this.itemType;

                // If we ARE selecting a custom keyword
            } else {

                this.addIconButtonTitle = 'Add ' + this.childType;
                this.editIconButtonTitle = 'Rename ' + this.childType;
                this.deleteIconButtonTitle = 'Delete ' + this.childType;
                this.listOptions.deletePrompt!.title = 'Delete ' + this.childType;
                this.listOptions.deletePrompt!.primaryButton!.name = 'Delete';
            }
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



    // ==============================================================( ON SELECTED SEARCH ITEM )============================================================== \\

    onSelectedSearchItem(searchUpdate: MultiColumnListUpdate) {
        if ((searchUpdate.selectedItems![0] as MultiColumnItem).values[1].name == this.parentSearchType) {

            // If we're NOT selecting a custom keyword group
            if (!this.thisSearchArray[searchUpdate.selectedItems![0].index!].forProduct) {
                this.itemType = 'Keyword Group';
                this.editDisabled = true;
                this.deleteDisabled = false;
                this.editIconButtonTitle = 'Rename';
                this.deleteIconButtonTitle = 'Remove ' + this.itemType;
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
            }
        }

        if ((searchUpdate.selectedItems![0] as MultiColumnItem).values[1].name == this.childSearchType) {

            // If we're NOT selecting a custom keyword
            if (!this.thisSearchArray[searchUpdate.selectedItems![0].index!].forProduct) {
                this.childType = 'Keyword';
                this.itemType = 'Keyword Group';
                this.editDisabled = true;
                this.deleteDisabled = true;
                this.editIconButtonTitle = 'Rename';
                this.deleteIconButtonTitle = 'Delete';
                this.searchOptions.menu!.menuOptions[0].hidden = true;
                this.searchOptions.menu!.menuOptions[1].hidden = true;
                this.searchOptions.menu!.menuOptions[2].hidden = true;
                this.searchOptions.menu!.menuOptions[3].name = 'Go to ' + this.childType + ' in Hierarchy';

                // If we ARE selecting a custom keyword
            } else {

                this.childType = 'Custom Keyword';
                this.itemType = 'Custom Keyword Group';
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
            }
        }
    }



    // ============================================================( ON SEARCH ITEM DOUBLE CLICK )============================================================ \\

    onSearchItemDoubleClick() {
        if (this.itemType == 'Custom Keyword Group') {
            this.editIconButtonTitle = 'Rename';
            this.deleteIconButtonTitle = 'Delete';
        }
    }



    // ==============================================================( ON ITEM CHECKBOX CHANGE )============================================================== \\

    onItemCheckboxChange(hierarchyUpdate: CheckboxListUpdate) {
        // ********* Commented Out Data Service *********
        // this.dataService.put('api/' + this.childDataServicePath + '/Update', {
        //     productId: this.productId,
        //     id: hierarchyUpdate.id,
        //     checked: hierarchyUpdate.checked
        // }).subscribe();
    }



    // ==========================================================( ON SEARCH ITEM CHECKBOX CHANGE )=========================================================== \\

    onSearchItemCheckboxChange(checkboxMultiColumnListUpdate: CheckboxMultiColumnListUpdate) {
        // ********* Commented Out Data Service *********
        // this.dataService.put('api/' + this.childDataServicePath + '/Update', {
        //     productId: this.productId,
        //     id: checkboxMultiColumnListUpdate.id,
        //     checked: checkboxMultiColumnListUpdate.checked
        // }).subscribe();

        // Check to see if the search item that had the checkbox change is visible in the hierarchy
        const hierarchyItem = this.thisArray.find(x => x.id == checkboxMultiColumnListUpdate.id && x.hierarchyGroupID == 1);
        // If it is, make the change to its checkbox as well
        if (hierarchyItem) hierarchyItem.checked = checkboxMultiColumnListUpdate.checked;
    }



    // ================================================================( ON UNSELECTED ITEM )================================================================= \\

    onUnselectedItem() {
        this.itemType = 'Custom Keyword Group';
        this.addIconButtonTitle = 'Add ' + this.itemType;
        this.editIconButtonTitle = 'Rename';
        this.deleteIconButtonTitle = 'Delete';
    }



    // =============================================================( ON UNSELECTED SEARCH ITEM )============================================================= \\

    onUnselectedSearchItem() {
        this.itemType = 'Custom Keyword Group';
        this.editIconButtonTitle = 'Rename';
        this.deleteIconButtonTitle = 'Delete';
    }



    // ====================================================================( ON ITEM ADD )==================================================================== \\

    private selectedKeywordsAdd: number = 4000;
    onItemAdd(hierarchyUpdate: HierarchyUpdate) {
        this.selectedKeywordsAdd++;
        // Add parent hierarchy item
        if (hierarchyUpdate.hierarchyGroupID == 0) {
            // ********* Commented Out Data Service *********
            // this.dataService.post<number>('api/' + this.dataServicePath, {
            //     id: this.productId,
            //     name: hierarchyUpdate.name
            // }).subscribe((id: number) => {
            this.thisArray[hierarchyUpdate.index!].id = this.selectedKeywordsAdd//id;
            this.thisArray[hierarchyUpdate.index!].forProduct = true;
            // });
        }

        // Add child hierarchy item
        if (hierarchyUpdate.hierarchyGroupID == 1) {
            const indexOfHierarchyItemParent = this.getIndexOfHierarchyItemParent(this.thisArray[hierarchyUpdate.index!], this.thisArray);
            // ********* Commented Out Data Service *********
            // this.dataService.post<number>('api/' + this.childDataServicePath, {
            //     id: this.thisArray[indexOfHierarchyItemParent].id,
            //     name: hierarchyUpdate.name
            // }).subscribe((id: number) => {
            this.thisArray[hierarchyUpdate.index!].id = this.selectedKeywordsAdd//id;
            this.thisArray[hierarchyUpdate.index!].forProduct = true;
            // })
        }
    }



    // ==================================================================( ON ITEM VERIFY )=================================================================== \\

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
                // this.otherArray.forEach(x => {
                //     if (x.hierarchyGroupID == 0) {
                //         if (x.name?.toLowerCase() == hierarchyUpdate.name?.toLowerCase()) {
                //             matchFound = true;
                //         }
                //     }
                // })

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
                // this.otherArray.forEach(x => {
                //     if (x.hierarchyGroupID == 0) {
                //         if (x.name?.toLowerCase() == searchUpdate.name?.toLowerCase()) {
                //             matchFound = true;
                //         }
                //     }
                // })

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



    // ===============================================================( DELETE PROMPT MESSAGE )=============================================================== \\

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



    // ==================================================================( ON ITEM DELETE )=================================================================== \\

    onItemDelete(deletedItem: KeywordCheckboxItem) {
        // If we're deleting a parent item
        if (deletedItem.hierarchyGroupID == 0) {

            if (this.itemType == 'Keyword Group') {
                // ********* Commented Out Data Service *********
                // this.dataService.put('api/' + this.dataServicePath + '/Remove', {
                //     productId: this.productId,
                //     id: deletedItem.id
                // }).subscribe();


                // Get the index of the parent in the available hierarchy list that's the same as the parent that's being removed in this hierarchy list
                // const removedItemIndex = this.otherArray.findIndex(x => x.id == deletedItem.id && x.name == deletedItem.name && x.hierarchyGroupID == 0);
                // if (removedItemIndex) {
                //     // Un-dim the parent in the available list that has that index
                //     this.otherArray[removedItemIndex].opacity = null!;
                //     // Un-dim it's children too (if available)
                //     for (let i = removedItemIndex + 1; i < this.otherArray.length; i++) {
                //         if (this.otherArray[i].hierarchyGroupID! <= deletedItem.hierarchyGroupID!) break;
                //         this.otherArray[i].opacity = null!;
                //     }
                // }

                

                // // Check to see if the removed keyword group is present in the available search list
                // const searchItem = this.keywordsService.availableSearchList.find(y => y.id == deletedItem.id && y.values[0].name == deletedItem.name && y.values[1].name == 'Group');
                // // If it is, then un-dim it
                // if (searchItem) searchItem!.opacity = null!;



                // Also, check to see if any of the children of the removed keyword group is present in the available search list and un-dim them if found
                this.dataService.get<Array<KeywordCheckboxItem>>('api/AvailableKeywords', [{ key: 'parentId', value: deletedItem.id }])
                    .subscribe((children: Array<KeywordCheckboxItem>) => {
                        children.forEach(x => {


                            // const searchItem = this.keywordsService.availableSearchList.find(y => y.id == x.id && y.values[0].name == x.name && y.values[1].name == 'Keyword');
                            // if (searchItem) searchItem.opacity = null!;


                        })
                    })


            } else {
                // ********* Commented Out Data Service *********
                // this.dataService.delete('api/' + this.dataServicePath, this.getDeletedItemParameters(deletedItem)).subscribe();
            }
        }

        // If we're deleting a child item
        if (deletedItem.hierarchyGroupID == 1) {
            // ********* Commented Out Data Service *********
            // this.dataService.delete('api/' + this.childDataServicePath, this.getDeletedItemParameters(deletedItem)).subscribe();
        }
    }



    // ===============================================================( ON SEARCH ITEM DELETE )=============================================================== \\

    onSearchItemDelete(deletedItem: KeywordCheckboxMultiColumnItem) {

        // If we're deleting a parent item
        if (deletedItem.values[1].name == this.parentSearchType) {
            // ********* Commented Out Data Service *********
            // this.dataService.delete('api/' + this.dataServicePath, this.getDeletedItemParameters(deletedItem)).subscribe();


            // Remove the selected keyword group from the hierarchy list
            const deletedItemIndex = this.thisArray.findIndex(x => x.id == deletedItem.id && x.name == deletedItem.values[0].name && x.hierarchyGroupID == 0);
            if (deletedItemIndex) this.thisArray.splice(deletedItemIndex, 1);

            if (this.itemType == 'Keyword Group') {

                // // If the available list is in hierarchy mode, get the index of the parent in the available hierarchy list that's the same as the parent that's being removed in this list
                // const removedItemIndex = this.otherArray.findIndex(x => x.id == deletedItem.id && x.name == deletedItem.values[0].name && x.hierarchyGroupID == 0);

                // if (removedItemIndex) {
                //     // Un-dim the parent in the available list that has that index
                //     this.otherArray[removedItemIndex].opacity = null!;

                //     // Also, un-dim it's children too (if available)
                //     for (let i = removedItemIndex + 1; i < this.otherArray.length; i++) {
                //         if (this.otherArray[i].hierarchyGroupID! <= this.otherArray[removedItemIndex].hierarchyGroupID!) break;
                //         this.otherArray[i].opacity = null!;
                //     }
                // }




                // // But if the available list is in search mode, check to see if the removed keyword group is present in the available search list
                // const searchItem = this.keywordsService.availableSearchList.find(y => y.id == deletedItem.id && y.values[0].name == deletedItem.values[0].name && y.values[1].name == 'Group');
                // // If it is, then un-dim it
                // if (searchItem) searchItem!.opacity = null!;



            }

            // Grab all the children belonging to the keyword group that's being removed  
            this.dataService.get<Array<KeywordCheckboxItem>>('api/AvailableKeywords', [{ key: 'parentId', value: deletedItem.id }])
                .subscribe((children: Array<KeywordCheckboxItem>) => {

                    children.forEach(x => {

                        
                        // // Check to see if any of the children of the removed keyword group is present in the available search list and un-dim them if any
                        // const availableSearchItem = this.keywordsService.availableSearchList.find(y => y.id == x.id && y.values[0].name == x.name && y.values[1].name == 'Keyword');
                        // if (availableSearchItem) availableSearchItem.opacity = null!;


                        // Plus, while we have the children of the keyword group that's being removed, remove those children from this selected keywords search list as well
                        const searchItemIndex = this.thisSearchArray.findIndex(y => y.id == x.id && y.values[0].name == x.name && y.values[1].name == 'Keyword');
                        if (searchItemIndex != -1) this.thisSearchArray.splice(searchItemIndex, 1);

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
        } else if (this.searchMode && this.thisSearchArray.length > 0) {

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



    // ======================================================================( GET ITEM )====================================================================== \\

    getItem(x: KeywordCheckboxItem) {
        return {
            id: x.id,
            name: x.name,
            hierarchyGroupID: 0,
            hidden: false,
            arrowDown: false,
            forProduct: x.forProduct,
            color: x.forProduct ? '#ffba00' : null!,
            editable: x.forProduct ? true : false,
            case: CaseType.CapitalizedCase
        }
    }



    // // ===================================================================( GET OTHER ITEM )=================================================================== \\

    // getOtherItem(x: KeywordCheckboxItem) {
    //     return null!
    // }



    // ===================================================================( GET CHILD ITEM )=================================================================== \\

    getChildItem(child: KeywordCheckboxItem) {
        return {
            id: child.id,
            name: child.name,
            hierarchyGroupID: 1,
            hidden: false,
            checked: child.checked,
            forProduct: child.forProduct,
            color: child.forProduct ? '#ffba00' : null!,
            selectable: child.forProduct ? true : false,
            case: CaseType.LowerCase
        }
    }



    // // ================================================================( GET OTHER CHILD ITEM )================================================================ \\

    // getOtherChildItem(child: HierarchyItem, hierarchyUpdate: HierarchyUpdate) {
    //     return null!;
    // }



    // =============================================================( GET CHILD ITEM PARAMETERS )============================================================== \\

    getChildItemParameters(hierarchyUpdate: HierarchyUpdate): Array<KeyValue<any, any>> {
        return [{ key: 'productId', value: this.productId }, { key: 'parentId', value: hierarchyUpdate.id }];
    }



    // ===============================================================( GET SEARCH RESULT ITEM )============================================================== \\

    getSearchResultItem(x: KeywordCheckboxSearchResultItem) {
        let caseType: CaseType = x.type == 'Group' ? CaseType.CapitalizedCase : CaseType.LowerCase;

        return {
            id: x.id!,
            name: null!,
            values: [{ name: x.name!, width: this.searchNameWidth, allowEdit: true, color: x.forProduct ? '#ffba00' : null! }, { name: x.type!, width: this.searchTypeWidth, color: x.forProduct ? '#ffba00' : null! }],
            checked: x.checked,
            forProduct: x.forProduct,
            editable: x.forProduct ? true : false,
            case: caseType
        }
    }



    // ===========================================================( GET SEARCH RESULTS PARAMETERS )=========================================================== \\

    getSearchResultsParameters(searchWords: string): Array<KeyValue<any, any>> {
        return [{ key: 'productId', value: this.productId }, { key: 'searchWords', value: searchWords }];
    }
}