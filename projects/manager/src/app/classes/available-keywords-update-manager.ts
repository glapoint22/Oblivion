import { KeyValue } from "@angular/common";
import { Directive, Input, ViewChild } from "@angular/core";
import { HierarchyComponent } from "../components/hierarchies/hierarchy/hierarchy.component";
import { MultiColumnListComponent } from "../components/lists/multi-column-list/multi-column-list.component";
import { CaseType, MenuOptionType } from "./enums";
import { HierarchyUpdate } from "./hierarchy-update";
import { KeywordCheckboxItem } from "./keyword-checkbox-item";
import { KeywordSearchResultItem } from "./keyword-search-result-item";
import { FormKeywordsUpdateManager } from "./form-keywords-update-manager";
import { MultiColumnItem } from "./multi-column-item";
import { MultiColumnListUpdate } from "./multi-column-list-update";

@Directive()
export class AvailableKeywordsUpdateManager extends FormKeywordsUpdateManager {
    // Public
    public addToSelectedKeywordsButtonDisabled!: boolean;

    // Decorators
    @Input() productId!: number;
    @Input() productIndex!: number;
    @ViewChild('availableHierarchyComponent') listComponent!: HierarchyComponent;
    @ViewChild('availableSearchComponent') searchComponent!: MultiColumnListComponent;


    // ====================================================================( NG ON INIT )===================================================================== \\

    ngOnInit() {
        super.ngOnInit();
        this.otherArray = this.productService.formKeywordArray;
        this.otherSearchArray = this.productService.formKeywordSearchArray;
        this.searchInputName = 'availableKeywordsSearchInput' + this.productId;
        this.thisArray = this.productService.productComponents[this.productIndex].availableKeywordArray;
        this.thisSearchArray = this.productService.productComponents[this.productIndex].availableKeywordSearchArray;

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
        this.addToSelectedKeywordsButtonDisabled = this.thisSearchArray[searchUpdate.selectedItems![0].index!].opacity != null ? true : false;
        this.searchOptions.menu!.menuOptions[5].isDisabled = this.thisSearchArray[searchUpdate.selectedItems![0].index!].opacity != null ? true : false;
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



    // ====================================================================( ON ITEM ADD )==================================================================== \\
    
    onItemAdd(hierarchyUpdate: HierarchyUpdate) {
        super.onItemAdd(hierarchyUpdate);

        if(hierarchyUpdate.hierarchyGroupID == 1) {
            const parentIndex = this.getIndexOfHierarchyItemParent(this.thisArray[hierarchyUpdate.index!], this.thisArray);
            this.thisArray[hierarchyUpdate.index!].opacity = this.thisArray[parentIndex].opacity;
        }
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


        this.productService.productComponents[this.productIndex].selectedKeywordArray.push(keywordGroup);
        this.sort(keywordGroup, this.productService.productComponents[this.productIndex].selectedKeywordArray);
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
            // ********* Commented Out Data Service *********
            // this.dataService.post('api/SelectedKeywords/Groups/Add', {
            //   productId: this.productId,
            //   id: keywordGroup.id
            // }).subscribe();

            // If a keyword is selected
        } else {
            const parentIndex = this.getIndexOfHierarchyItemParent(this.listComponent.listManager.selectedItem, this.thisArray);
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
            // ********* Commented Out Data Service *********
            // this.dataService.post('api/SelectedKeywords/Groups/AddKeyword', {
            //   productId: this.productId,
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
                        const searchItem = this.thisSearchArray.find(y => y.id == x.id && y.values[1].name == 'Keyword');
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
            // ********* Commented Out Data Service *********
            // this.dataService.post('api/SelectedKeywords/Groups/Add', {
            //     productId: this.productId,
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
                                const searchItem = this.thisSearchArray.find(y => y.id == x.id && y.values[1].name == 'Keyword');
                                if (searchItem) searchItem.opacity = 0.4;
                            })
                        })

                    // Also, if the parent of the selected keyword is in the search list, set the disabled look to it
                    const selectedKeywordParent = this.thisSearchArray.find(x => x.id == keywordGroup.id && x.values[1].name == 'Group');
                    if (selectedKeywordParent) selectedKeywordParent.opacity = 0.4;


                    // Now set the disabled look to the same parent of the selected keyword in the hierarchy list
                    const keywordGroupIndex = this.thisArray.findIndex(x => x.id == keywordGroup.id && x.hierarchyGroupID == 0);
                    this.thisArray[keywordGroupIndex].opacity = 0.4;

                    // And set the disabled look to it's children too (if available)
                    for (let i = keywordGroupIndex + 1; i < this.thisArray.length; i++) {
                        if (this.thisArray[i].hierarchyGroupID! <= 0) break;
                        this.thisArray[i].opacity = 0.4;
                    }

                    // ********* Commented Out Data Service *********
                    // this.dataService.post('api/SelectedKeywords/Groups/AddKeyword', {
                    //     productId: this.productId,
                    //     keywordGroupId: keywordGroup.id,
                    //     KeywordId: this.searchComponent.listManager.selectedItem.id
                    // }).subscribe();
                })
        }
    }



    // ======================================================================( GET ITEM )====================================================================== \\

    getItem(x: KeywordCheckboxItem) {
        return {
            id: x.id,
            name: x.name,
            hierarchyGroupID: 0,
            hidden: false,
            arrowDown: false,
            opacity: x.forProduct ? 0.4 : null!,
            case: CaseType.CapitalizedCase
        }
    }



    // ================================================================( GET ITEM PARAMETERS )================================================================= \\

    getItemParameters(): Array<KeyValue<any, any>> {
        return [{ key: 'productId', value: this.productId }];
    }



    // ===============================================================( GET SEARCH RESULT ITEM )============================================================== \\

    getSearchResultItem(x: KeywordSearchResultItem) {
        let caseType: CaseType = x.type == 'Group' ? CaseType.CapitalizedCase : CaseType.LowerCase;

        return {
            id: x.id!,
            name: null!,
            values: [{ name: x.name!, width: this.searchNameWidth, allowEdit: true }, { name: x.type!, width: this.searchTypeWidth }],
            opacity: x.forProduct ? 0.4 : null!,
            case: caseType
        }
    }



    // ===========================================================( GET SEARCH RESULTS PARAMETERS )=========================================================== \\

    getSearchResultsParameters(searchWords: string): Array<KeyValue<any, any>> {
        return [{ key: 'productId', value: this.productId }, { key: 'searchWords', value: searchWords }];
    }
}