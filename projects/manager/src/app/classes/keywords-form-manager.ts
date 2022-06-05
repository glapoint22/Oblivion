import { DomSanitizer } from "@angular/platform-browser";
import { DataService } from "common";
import { KeywordsService } from "../services/keywords/keywords.service";
import { SortType } from "./enums";
import { HierarchyItem } from "./hierarchy-item";
import { HierarchyUpdate } from "./hierarchy-update";
import { KeywordCheckboxItem } from "./keyword-checkbox-item";
import { HierarchyUpdateManager } from "./hierarchy-update-manager";
import { MultiColumnItem } from "./multi-column-item";
import { MultiColumnListUpdate } from "./multi-column-list-update";
import { ProductService } from "../services/product/product.service";
import { ListItem } from "./list-item";
import { KeyValue } from "@angular/common";

export class KeywordsFormManager extends HierarchyUpdateManager {


    // ====================================================================( CONSTRUCTOR )==================================================================== \\

    constructor(dataService: DataService, sanitizer: DomSanitizer, public keywordsService: KeywordsService, public productService: ProductService) {
        super(dataService, sanitizer);
        this.sortType = SortType.Form;
        this.itemType = 'Keyword Group';
        this.childType = 'Keyword';
        this.dataServicePath = 'AvailableKeywords/Groups';
        this.childDataServicePath = 'AvailableKeywords';
        this.parentSearchType = 'Group';
        this.childSearchType = 'Keyword';
        this.searchNameWidth = '233px';
        this.searchTypeWidth = '68px';
        this.hierarchyUpdateService = this.keywordsService;
        this.thisArray = this.keywordsService.formArray;
        this.otherArray = this.keywordsService.productArray;
        this.thisSearchList = this.keywordsService.formSearchList;
        this.otherSearchList = this.keywordsService.productSearchList;
    }



    // ==================================================================( ON ARROW CLICK )=================================================================== \\

    onArrowClick(hierarchyUpdate: HierarchyUpdate) {
        super.onArrowClick(hierarchyUpdate);

        // If the parent has the disabled look
        if (this.otherArray[hierarchyUpdate.index!].opacity != null) {
            // And its children hasn't been loaded yet
            if (hierarchyUpdate.arrowDown && !hierarchyUpdate.hasChildren) {

                // Wait for the children to load
                let onChildrenLoadListener = this.onChildrenLoad.subscribe(() => {
                    onChildrenLoadListener.unsubscribe();

                    // Then give its children the disabled look too
                    for (let i = hierarchyUpdate.index! + 1; i < this.otherArray.length; i++) {
                        if (this.otherArray[i].hierarchyGroupID! <= hierarchyUpdate.hierarchyGroupID!) break;
                        this.otherArray[i].opacity = 0.4;
                    }
                });
            }
        }
    }



    // ===================================================================( ON ITEM EDIT )==================================================================== \\

    onItemEdit(hierarchyUpdate: HierarchyUpdate) {
        super.onItemEdit(hierarchyUpdate);
        this.setSort(this.editItem(this.keywordsService.selectedKeywordsArray, hierarchyUpdate, hierarchyUpdate.hierarchyGroupID) as KeywordCheckboxItem);
        this.editItem(this.keywordsService.selectedKeywordsSearchList, hierarchyUpdate, hierarchyUpdate.hierarchyGroupID == 0 ? this.parentSearchType : this.childSearchType);

    }


    // ================================================================( ON SEARCH ITEM EDIT )================================================================ \\

    onSearchItemEdit(searchUpdate: MultiColumnListUpdate) {
        super.onSearchItemEdit(searchUpdate);
        this.thisSortList.push(this.editItem(this.thisArray, searchUpdate, searchUpdate.values![1].name == this.parentSearchType ? 0 : 1));
        this.setSort(this.editItem(this.keywordsService.selectedKeywordsArray, searchUpdate, searchUpdate.values![1].name == this.parentSearchType ? 0 : 1) as KeywordCheckboxItem);
        this.editItem(this.keywordsService.selectedKeywordsSearchList, searchUpdate, searchUpdate.values![1].name);
    }



    // ======================================================================( SET SORT )===================================================================== \\

    setSort(selectedHierarchyItem: KeywordCheckboxItem) {
        super.setSort(selectedHierarchyItem);

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


    
    // ===================================================================( GET OTHER ITEM )=================================================================== \\

    getOtherItem(x: ListItem) {
        return {
            id: x.id,
            name: x.name,
            hierarchyGroupID: 0,
            hidden: false,
            arrowDown: false,
            opacity: (x as KeywordCheckboxItem).forProduct ? 0.4 : null!
        }
    }



    // ================================================================( GET ITEM PARAMETERS )================================================================= \\

    getItemParameters(): Array<KeyValue<any, any>> {
        return [{ key: 'productId', value: this.productService.product.id }];
    }
}