import { KeyValue } from "@angular/common";
import { Directive, ViewChild } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { DataService } from "common";
import { HierarchyComponent } from "../components/hierarchies/hierarchy/hierarchy.component";
import { MultiColumnListComponent } from "../components/lists/multi-column-list/multi-column-list.component";
import { KeywordsService } from "../services/keywords/keywords.service";
import { ProductService } from "../services/product/product.service";
import { MenuOptionType, SortType } from "./enums";
import { HierarchyItem } from "./hierarchy-item";
import { HierarchyUpdate } from "./hierarchy-update";
import { KeywordCheckboxItem } from "./keyword-checkbox-item";
import { KeywordSearchResultItem } from "./keyword-search-result-item";
import { FormKeywordsUpdateManager } from "./form-keywords-update-manager";
import { ListItem } from "./list-item";
import { MultiColumnItem } from "./multi-column-item";
import { MultiColumnListUpdate } from "./multi-column-list-update";

@Directive()
export class AvailableKeywordsUpdateManager extends FormKeywordsUpdateManager {
    public addToSelectedKeywordsButtonDisabled!: boolean;
    @ViewChild('availableHierarchyComponent') listComponent!: HierarchyComponent;
    @ViewChild('availableSearchComponent') searchComponent!: MultiColumnListComponent;


    ngOnInit() {
        this.searchNameWidth = '296px';
        this.searchInputName = 'availableKeywordsSearchInput';
        this.sortType = SortType.Product;
        this.thisArray = this.keywordsService.productArray;
        this.otherArray = this.keywordsService.formArray;
        this.thisSearchList = this.keywordsService.productSearchList;
        this.otherSearchList = this.keywordsService.formSearchList;
        this.keywordsService.availableSearchList = this.thisSearchList;
        this.listOptions.menu!.menuOptions[6] = { type: MenuOptionType.Divider };
        this.listOptions.menu!.menuOptions[7] = {
            type: MenuOptionType.MenuItem,
            name: 'Add to Selected Keywords',
            shortcut: 'Alt+A',
            optionFunction: this.addToSelectedKeywords
        };
        this.searchOptions.menu!.menuOptions[4] = { type: MenuOptionType.Divider };
        this.searchOptions.menu!.menuOptions[5] = {
            type: MenuOptionType.MenuItem,
            name: 'Add to Selected Keywords',
            shortcut: 'Alt+A',
            optionFunction: this.addToSelectedKeywords
        };
    }


    ngAfterViewInit() {
        this.keywordsService.productHierarchyComponent = this.listComponent;
    }



    ngAfterViewChecked() {
        this.otherListComponent = this.keywordsService.formHierarchyComponent;
    }



    // ======================================================================( ON OPEN )====================================================================== \\

    onOpen() {
        this.addToSelectedKeywordsButtonDisabled = true;
        super.onOpen();
    }



    // ==================================================================( ON ARROW CLICK )=================================================================== \\

    onArrowClick(hierarchyUpdate: HierarchyUpdate) {
        super.onArrowClick(hierarchyUpdate);

        // If the parent has the disabled look
        if (this.thisArray[hierarchyUpdate.index!].opacity != null) {
            // And its children hasn't been loaded yet
            if (hierarchyUpdate.arrowDown && !hierarchyUpdate.hasChildren) {

                // Wait for the children to load
                let onChildrenLoadListener = this.onChildrenLoad.subscribe(() => {
                    onChildrenLoadListener.unsubscribe();

                    // Then give its children the disabled look too
                    for (let i = hierarchyUpdate.index! + 1; i < this.thisArray.length; i++) {
                        if (this.thisArray[i].hierarchyGroupID! <= hierarchyUpdate.hierarchyGroupID!) break;
                        this.thisArray[i].opacity = 0.4;
                    }
                });
            }
        }
    }



    // =================================================================( ON SELECTED ITEM )================================================================== \\

    onSelectedItem(hierarchyUpdate: HierarchyUpdate) {
        super.onSelectedItem(hierarchyUpdate);
        this.addToSelectedKeywordsButtonDisabled = hierarchyUpdate.selectedItems![0].opacity != null ? true : false;
        this.listOptions.menu!.menuOptions[4].hidden = true;
        this.listOptions.menu!.menuOptions[7].isDisabled = hierarchyUpdate.selectedItems![0].opacity != null ? true : false;
    }



    // ==============================================================( ON SELECTED SEARCH ITEM )============================================================== \\

    onSelectedSearchItem(searchUpdate: MultiColumnListUpdate) {
        super.onSelectedSearchItem(searchUpdate);
        this.addToSelectedKeywordsButtonDisabled = this.thisSearchList[searchUpdate.selectedMultiColumnItems![0].index!].opacity != null ? true : false;
        this.searchOptions.menu!.menuOptions[5].isDisabled = this.thisSearchList[searchUpdate.selectedMultiColumnItems![0].index!].opacity != null ? true : false;
    }



    // ================================================================( ON UNSELECTED ITEM )================================================================= \\

    onUnselectedItem() {
        super.onUnselectedItem();
        this.addToSelectedKeywordsButtonDisabled = true;
    }



    // =============================================================( ON UNSELECTED SEARCH ITEM )============================================================= \\

    onUnselectedSearchItem() {
        super.onUnselectedSearchItem();
        this.addToSelectedKeywordsButtonDisabled = true;
    }



    // ===================================================================( ON ITEM EDIT )==================================================================== \\

    onItemEdit(hierarchyUpdate: HierarchyUpdate) {
        this.setSelectedKeywordsSort(this.editItem(this.keywordsService.selectedKeywordsArray, hierarchyUpdate, hierarchyUpdate.hierarchyGroupID) as KeywordCheckboxItem);
        this.editItem(this.keywordsService.selectedKeywordsSearchList, hierarchyUpdate, hierarchyUpdate.hierarchyGroupID == 0 ? this.parentSearchType : this.childSearchType);
        this.setSort(this.editItem(this.otherArray, hierarchyUpdate, hierarchyUpdate.hierarchyGroupID) as KeywordCheckboxItem);
    }



    // ================================================================( ON SEARCH ITEM EDIT )================================================================ \\

    onSearchItemEdit(searchUpdate: MultiColumnListUpdate) {
        this.thisSortList.push(this.editItem(this.thisArray, searchUpdate, searchUpdate.values![1].name == this.parentSearchType ? 0 : 1));
        this.setSelectedKeywordsSort(this.editItem(this.keywordsService.selectedKeywordsArray, searchUpdate, searchUpdate.values![1].name == this.parentSearchType ? 0 : 1) as KeywordCheckboxItem);
        this.editItem(this.keywordsService.selectedKeywordsSearchList, searchUpdate, searchUpdate.values![1].name);
    }



    // =============================================================( ON SELECTED KEYWORDS SORT )============================================================= \\

    setSelectedKeywordsSort(selectedHierarchyItem: KeywordCheckboxItem) {
        if (selectedHierarchyItem) {
            // As long as the other hierarchy sort group is NOT hidden
            if (!selectedHierarchyItem.hidden && this.keywordsService.selectedHierarchyComponent) {

                // Then sort the other hierarchy list
                this.keywordsService.selectedHierarchyComponent.listManager.sort(selectedHierarchyItem);

                // But if the other hierarchy sort group is NOT visible
            } else {

                // Make a list of all the items we edited in this hierarchy so that when we go back to the other hierarchy we can then sort those items accordingly
                this.keywordsService.sortList.push(selectedHierarchyItem);
            }
        }
    }



    // ==================================================================( ON ITEM DELETE )=================================================================== \\

    onItemDelete(deletedItem: HierarchyItem) {
        super.onItemDelete(deletedItem);
        this.deleteItem(this.keywordsService.selectedKeywordsArray, deletedItem, deletedItem.hierarchyGroupID!);
        this.deleteItem(this.keywordsService.selectedKeywordsSearchList, deletedItem as MultiColumnItem, deletedItem.hierarchyGroupID == 0 ? this.parentSearchType : this.childSearchType);
    }



    // ===============================================================( ON SEARCH ITEM DELETE )=============================================================== \\

    onSearchItemDelete(deletedItem: MultiColumnItem) {
        super.onSearchItemDelete(deletedItem);
        this.deleteItem(this.keywordsService.selectedKeywordsSearchList, deletedItem, deletedItem.values[1].name);
        this.deleteItem(this.keywordsService.selectedKeywordsArray, deletedItem, deletedItem.values[1].name == this.parentSearchType ? 0 : 1);
    }



    // =============================================================( ADD TO SELECTED KEYWORDS )============================================================== \\

    addToSelectedKeywords() {
        this.addToSelectedKeywordsButtonDisabled = true;
        const keywordGroup: KeywordCheckboxItem = new KeywordCheckboxItem();


        if (this.listComponent) {
            this.addHierarchyItemToSelectedKeywords(keywordGroup);

        } else {
            this.addSearchItemToSelectedKeywords(keywordGroup);
        }


        this.keywordsService.selectedKeywordsArray.push(keywordGroup);

        if (this.keywordsService.selectedHierarchyComponent) {
            this.keywordsService.selectedHierarchyComponent.listManager.sort(keywordGroup);
        } else {
            // If any keyword items have been added from the available list to the selected list while the selected list was in search mode
            this.keywordsService.sortList.push(keywordGroup);
        }
    }



    // ======================================================( ADD HIERARCHY ITEM TO SELECTED KEYWORDS )====================================================== \\

    addHierarchyItemToSelectedKeywords(keywordGroup: KeywordCheckboxItem) {
        // If a keyword group is selected
        if (this.listComponent.listManager.selectedItem.hierarchyGroupID == 0) {
            keywordGroup.id = this.listComponent.listManager.selectedItem.id;
            keywordGroup.name = this.listComponent.listManager.selectedItem.name;
            keywordGroup.hierarchyGroupID = 0;
            keywordGroup.forProduct = false;

            // Add the disabled look to the keyword group in the available list
            this.listComponent.listManager.selectedItem.opacity = 0.4;

            // Add the disabled look to it's children too (if available)
            const index = this.thisArray.indexOf(this.listComponent.listManager.selectedItem);
            for (let i = index + 1; i < this.thisArray.length; i++) {
                if (this.thisArray[i].hierarchyGroupID! <= this.listComponent.listManager.selectedItem.hierarchyGroupID!) break;
                this.thisArray[i].opacity = 0.4;
            }
            // ********* commited Data Service *********
            // this.dataService.post('api/SelectedKeywords/Groups/Add', {
            //   productId: this.productService.product.id,
            //   id: keywordGroup.id
            // }).subscribe();

            // If a keyword is selected
        } else {
            const parentIndex = this.listComponent.listManager.getIndexOfHierarchyItemParent(this.listComponent.listManager.selectedItem);
            const parent = this.thisArray[parentIndex];
            const childId = this.listComponent.listManager.selectedItem.id;
            keywordGroup.id = parent.id;
            keywordGroup.name = parent.name;
            keywordGroup.hierarchyGroupID = 0;
            keywordGroup.forProduct = false;

            // Add the disabled look to the keyword group and its children in the available list
            parent.opacity = 0.4;
            for (let i = parentIndex + 1; i < this.thisArray.length; i++) {
                if (this.thisArray[i].hierarchyGroupID! <= parent.hierarchyGroupID!) break;
                this.thisArray[i].opacity = 0.4;
            }
            // ********* commited Data Service *********
            // this.dataService.post('api/SelectedKeywords/Groups/AddKeyword', {
            //   productId: this.productService.product.id,
            //   keywordGroupId: keywordGroup.id,
            //   KeywordId: childId
            // }).subscribe();
        }
    }



    // =======================================================( ADD SEARCH ITEM TO SELECTED KEYWORDS )======================================================== \\

    addSearchItemToSelectedKeywords(keywordGroup: KeywordCheckboxItem) {
        // If a keyword group is selected
        if ((this.searchComponent.listManager.selectedItem as MultiColumnItem).values[1].name == 'Group') {
            keywordGroup.id = this.searchComponent.listManager.selectedItem.id;
            keywordGroup.name = (this.searchComponent.listManager.selectedItem as MultiColumnItem).values[0].name;
            keywordGroup.hierarchyGroupID = 0;
            keywordGroup.forProduct = false;

            // Set the disabled look to the selected keyword group in the search list
            this.searchComponent.listManager.selectedItem.opacity = 0.4;

            // Then if any children of the selected keyword group are in the search list, set the disabled look to them too
            this.dataService.get<Array<KeywordCheckboxItem>>('api/' + this.childDataServicePath, [{ key: 'parentId', value: keywordGroup.id }])
                .subscribe((children: Array<KeywordCheckboxItem>) => {
                    children.forEach(x => {
                        const searchItem = this.thisSearchList.find(y => y.id == x.id && y.values[1].name == 'Keyword');
                        if (searchItem) searchItem.opacity = 0.4;
                    })
                })

            // Also, set the disabled look to the same keyword group in the hierarchy list too
            const keywordGroupIndex = this.thisArray.findIndex(x => x.id == keywordGroup.id && x.hierarchyGroupID == 0);
            this.thisArray[keywordGroupIndex].opacity = 0.4;

            // And set the disabled look to it's children too (if available)
            for (let i = keywordGroupIndex + 1; i < this.thisArray.length; i++) {
                if (this.thisArray[i].hierarchyGroupID! <= 0) break;
                this.thisArray[i].opacity = 0.4;
            }
            // ********* commited Data Service *********
            // this.dataService.post('api/SelectedKeywords/Groups/Add', {
            //     productId: this.productService.product.id,
            //     id: keywordGroup.id
            // }).subscribe();


            // If a keyword is selected 
        } else {

            // Get the parent of the selected keyword
            this.dataService.get<KeywordCheckboxItem>('api/' + this.childDataServicePath + '/Parent', [{ key: 'childId', value: this.searchComponent.listManager.selectedItem.id }])
                .subscribe((keywordParent: KeywordCheckboxItem) => {
                    const parentIndex = this.thisArray.findIndex(x => x.id == keywordParent.id && x.hierarchyGroupID == 0);
                    const parent = this.thisArray[parentIndex];
                    keywordGroup.id = parent.id;
                    keywordGroup.name = parent.name;
                    keywordGroup.hierarchyGroupID = 0;
                    keywordGroup.forProduct = false;

                    // Set the disabled look to the selected keyword in the search list
                    this.searchComponent.listManager.selectedItem.opacity = 0.4;

                    // Then if any siblings of the selected keyword are in the search list, set the disabled look to them too
                    this.dataService.get<Array<KeywordCheckboxItem>>('api/' + this.childDataServicePath, [{ key: 'parentId', value: keywordGroup.id }])
                        .subscribe((children: Array<KeywordCheckboxItem>) => {
                            children.forEach(x => {
                                const searchItem = this.thisSearchList.find(y => y.id == x.id && y.values[1].name == 'Keyword');
                                if (searchItem) searchItem.opacity = 0.4;
                            })
                        })

                    // Also, if the parent of the selected keyword is in the search list, set the disabled look to it
                    const selectedKeywordParent = this.thisSearchList.find(x => x.id == keywordGroup.id && x.values[1].name == 'Group');
                    if (selectedKeywordParent) selectedKeywordParent.opacity = 0.4;


                    // Now set the disabled look to the same parent of the selected keyword in the hierarchy list
                    const keywordGroupIndex = this.thisArray.findIndex(x => x.id == keywordGroup.id && x.hierarchyGroupID == 0);
                    this.thisArray[keywordGroupIndex].opacity = 0.4;

                    // And set the disabled look to it's children too (if available)
                    for (let i = keywordGroupIndex + 1; i < this.thisArray.length; i++) {
                        if (this.thisArray[i].hierarchyGroupID! <= 0) break;
                        this.thisArray[i].opacity = 0.4;
                    }

                    // ********* commited Data Service *********
                    // this.dataService.post('api/SelectedKeywords/Groups/AddKeyword', {
                    //     productId: this.productService.product.id,
                    //     keywordGroupId: keywordGroup.id,
                    //     KeywordId: this.searchComponent.listManager.selectedItem.id
                    // }).subscribe();
                })
        }
    }



    // ======================================================================( GET ITEM )====================================================================== \\

    getItem(x: ListItem) {
        return {
            id: x.id,
            name: x.name,
            hierarchyGroupID: 0,
            hidden: false,
            arrowDown: false,
            opacity: (x as KeywordCheckboxItem).forProduct ? 0.4 : null!
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
            opacity: null!
        }
    }



    // ===============================================================( GET SEARCH RESULT ITEM )============================================================== \\

    getSearchResultItem(x: KeywordSearchResultItem) {
        return {
            id: x.id!,
            name: null!,
            values: [{ name: x.name!, width: this.searchNameWidth, allowEdit: true }, { name: x.type!, width: this.searchTypeWidth }],
            opacity: x.forProduct ? 0.4 : null!
        }
    }



    // ===========================================================( GET SEARCH RESULTS PARAMETERS )=========================================================== \\

    getSearchResultsParameters(searchWords: string): Array<KeyValue<any, any>> {
        return [{ key: 'productId', value: this.productService.product.id }, { key: 'searchWords', value: searchWords }];
    }
}