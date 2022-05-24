import { DomSanitizer } from "@angular/platform-browser";
import { DataService } from "common";
import { KeywordsService } from "../services/keywords/keywords.service";
import { ProductService } from "../services/product/product.service";
import { MenuOptionType, SortType } from "./enums";
import { HierarchyUpdate } from "./hierarchy-update";
import { KeywordCheckboxItem } from "./keyword-checkbox-item";
import { KeywordSearchResultItem } from "./keyword-search-result-item";
import { KeywordsFormManager } from "./keywords-form-manager";
import { MultiColumnListUpdate } from "./multi-column-list-update";

export class AvailableKeywordsManager extends KeywordsFormManager {


    // ====================================================================( CONSTRUCTOR )==================================================================== \\

    constructor(dataService: DataService, sanitizer: DomSanitizer, keywordsService: KeywordsService, private productService: ProductService) {
        super(dataService, sanitizer, keywordsService);
        this.searchNameWidth = '296px';
        this.sortType = SortType.Product;
        this.thisArray = this.keywordsService.productArray;
        this.otherArray = this.keywordsService.formArray;
        this.hierarchyOptions.menu!.menuOptions[4] = { type: MenuOptionType.Divider };
        this.hierarchyOptions.menu!.menuOptions[5] = { 
            type: MenuOptionType.MenuItem,
            name: 'Add to Selected Keywords',
            shortcut: 'Alt+A',
            optionFunction: this.keywordsService.addToSelectedKeywords
        };
        this.searchOptions.menu!.menuOptions[3] = { type: MenuOptionType.Divider };
        this.searchOptions.menu!.menuOptions[4] = { 
            type: MenuOptionType.MenuItem,
            name: 'Add to Selected Keywords',
            shortcut: 'Alt+A',
            optionFunction: this.keywordsService.addToSelectedKeywords
        };
    }



    // ======================================================================( ON OPEN )====================================================================== \\

    onOpen() {
        this.keywordsService.addToSelectedKeywordsButtonDisabled = true;
        if (this.thisArray.length == 0) {
            this.addIconButtonTitle = 'Add ' + this.parentType;
            this.dataService.get<Array<KeywordCheckboxItem>>('api/' + this.parentDataServicePath, [{ key: 'productId', value: this.productService.product.id }])
                .subscribe((thisArray: Array<KeywordCheckboxItem>) => {
                    thisArray.forEach(x => {
                        this.thisArray.push({
                            id: x.id,
                            name: x.name,
                            hierarchyGroupID: 0,
                            hidden: false,
                            arrowDown: false,
                            opacity: x.forProduct ? 0.4 : null!
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
            this.sortPendingHierarchyItems();
        } else {
            super.onOpen();
        }
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



    // ============================================================( ON SELECTED HIERARCHY ITEM )============================================================= \\

    onSelectedHierarchyItem(hierarchyUpdate: HierarchyUpdate) {
        super.onSelectedHierarchyItem(hierarchyUpdate);
        this.keywordsService.addToSelectedKeywordsButtonDisabled = hierarchyUpdate.selectedItems![0].opacity != null ? true : false;
        this.hierarchyOptions.menu!.menuOptions[5].isDisabled = hierarchyUpdate.selectedItems![0].opacity != null ? true : false;
    }



    // ==============================================================( ON SELECTED SEARCH ITEM )============================================================== \\

    onSelectedSearchItem(searchUpdate: MultiColumnListUpdate) {
        super.onSelectedSearchItem(searchUpdate);
        this.keywordsService.addToSelectedKeywordsButtonDisabled = this.searchList[searchUpdate.selectedMultiColumnItems![0].index!].opacity != null ? true : false;
        this.searchOptions.menu!.menuOptions[4].isDisabled = this.searchList[searchUpdate.selectedMultiColumnItems![0].index!].opacity != null ? true : false;
    }



    // ===========================================================( ON UNSELECTED HIERARCHY ITEM )============================================================ \\

    onUnselectedHierarchyItem() {
        super.onUnselectedHierarchyItem();
        this.keywordsService.addToSelectedKeywordsButtonDisabled = true;
    }



    // =============================================================( ON UNSELECTED SEARCH ITEM )============================================================= \\

    onUnselectedSearchItem() {
        super.onUnselectedSearchItem();
        this.keywordsService.addToSelectedKeywordsButtonDisabled = true;
    }



    // ================================================================( GET SEARCH RESULTS )================================================================= \\

    getSearchResults(value: string) {
        this.searchList.splice(0, this.searchList.length);

        this.dataService.get<Array<KeywordSearchResultItem>>('api/' + this.parentDataServicePath + '/Search', [{ key: 'productId', value: this.productService.product.id }, { key: 'searchWords', value: value }])
            .subscribe((searchResults: Array<KeywordSearchResultItem>) => {

                // As long as search results were returned
                if (searchResults) {
                    searchResults.forEach(x => {
                        this.searchList.push({

                            id: x.id!,
                            values: [{ name: x.name!, width: this.searchNameWidth, allowEdit: true }, { name: x.type!, width: this.searchTypeWidth }],
                            opacity: x.forProduct ? 0.4 : null!
                        })
                    })
                }
            });
    }
}