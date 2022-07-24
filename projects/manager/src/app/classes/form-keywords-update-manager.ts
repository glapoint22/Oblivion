import { DomSanitizer } from "@angular/platform-browser";
import { DataService } from "common";
import { KeywordsService } from "../services/keywords/keywords.service";
import { HierarchyItem } from "./hierarchy-item";
import { HierarchyUpdate } from "./hierarchy-update";
import { KeywordCheckboxItem } from "./keyword-checkbox-item";
import { HierarchyUpdateManager } from "./hierarchy-update-manager";
import { MultiColumnItem } from "./multi-column-item";
import { MultiColumnListUpdate } from "./multi-column-list-update";
import { ProductService } from "../services/product/product.service";
import { KeyValue } from "@angular/common";
import { Directive, ViewChild } from "@angular/core";
import { HierarchyComponent } from "../components/hierarchies/hierarchy/hierarchy.component";
import { MultiColumnListComponent } from "../components/lists/multi-column-list/multi-column-list.component";
import { CaseType, ListUpdateType } from "./enums";
import { SearchResultItem } from "./search-result-item";

@Directive()
export class FormKeywordsUpdateManager extends HierarchyUpdateManager {
    // Decorators
    @ViewChild('hierarchyComponent') listComponent!: HierarchyComponent;
    @ViewChild('searchComponent') searchComponent!: MultiColumnListComponent;


    // ====================================================================( NG ON INIT )===================================================================== \\

    ngOnInit() {
        super.ngOnInit()
        this.itemType = 'Keyword Group';
        this.childType = 'Keyword';
        this.dataServicePath = 'AvailableKeywords/Groups';
        this.childDataServicePath = 'AvailableKeywords';
        this.parentSearchType = 'Group';
        this.childSearchType = 'Keyword';
        this.searchNameWidth = '233px';
        this.searchTypeWidth = '68px';
        // this.hierarchyUpdateService = this.keywordsService;
        // this.thisArray = this.keywordsService.formArray;
        // this.otherArray = this.keywordsService.productArray;
        // this.thisSearchList = this.keywordsService.formSearchList;
        // this.otherSearchList = this.keywordsService.productSearchList;
        this.searchInputName = 'keywordsFormSearchInput';
    }



    // ==================================================================( ON LIST UPDATE )=================================================================== \\

    onListUpdate(hierarchyUpdate: HierarchyUpdate) {
        super.onListUpdate(hierarchyUpdate);
        if (hierarchyUpdate.type == ListUpdateType.CaseTypeUpdate) this.thisArray[hierarchyUpdate.index!].case = hierarchyUpdate.hierarchyGroupID == 0 ? CaseType.CapitalizedCase : CaseType.LowerCase;
    }



    // ==================================================================( ON ARROW CLICK )=================================================================== \\

    onArrowClick(hierarchyUpdate: HierarchyUpdate) {
        super.onArrowClick(hierarchyUpdate);

        // // If the parent has the disabled look
        // if (this.otherArray[hierarchyUpdate.index!].opacity != null) {
        //     // And its children hasn't been loaded yet
        //     if (hierarchyUpdate.arrowDown && !hierarchyUpdate.hasChildren) {

        //         // Wait for the children to load
        //         let onChildrenLoadListener = this.onChildrenLoad.subscribe(() => {
        //             onChildrenLoadListener.unsubscribe();

        //             // Then give its children the disabled look too
        //             for (let i = hierarchyUpdate.index! + 1; i < this.otherArray.length; i++) {
        //                 if (this.otherArray[i].hierarchyGroupID! <= hierarchyUpdate.hierarchyGroupID!) break;
        //                 this.otherArray[i].opacity = 0.4;
        //             }
        //         });
        //     }
        // }
    }



    // ===================================================================( ON ITEM EDIT )==================================================================== \\

    onItemEdit(hierarchyUpdate: HierarchyUpdate) {
        super.onItemEdit(hierarchyUpdate);

        // this.sort(this.editItem(this.keywordsService.selectedKeywordsArray, hierarchyUpdate, hierarchyUpdate.hierarchyGroupID) as KeywordCheckboxItem, this.keywordsService.selectedKeywordsArray);
        // this.editItem(this.keywordsService.selectedKeywordsSearchList, hierarchyUpdate, hierarchyUpdate.hierarchyGroupID == 0 ? this.parentSearchType : this.childSearchType);
    }


    // ================================================================( ON SEARCH ITEM EDIT )================================================================ \\

    onSearchItemEdit(searchUpdate: MultiColumnListUpdate) {
        super.onSearchItemEdit(searchUpdate);


        // this.sort(this.editItem(this.keywordsService.selectedKeywordsArray, searchUpdate, searchUpdate.values![1].name == this.parentSearchType ? 0 : 1) as KeywordCheckboxItem, this.keywordsService.selectedKeywordsArray);
        // this.editItem(this.keywordsService.selectedKeywordsSearchList, searchUpdate, searchUpdate.values![1].name);
    }



    // ==================================================================( ON ITEM DELETE )=================================================================== \\

    onItemDelete(deletedItem: HierarchyItem) {
        super.onItemDelete(deletedItem);

        // this.deleteItem(this.keywordsService.selectedKeywordsArray, deletedItem, deletedItem.hierarchyGroupID!);
        // this.deleteItem(this.keywordsService.selectedKeywordsSearchList, deletedItem as MultiColumnItem, deletedItem.hierarchyGroupID == 0 ? this.parentSearchType : this.childSearchType);
    }



    // ===============================================================( ON SEARCH ITEM DELETE )=============================================================== \\

    onSearchItemDelete(deletedItem: MultiColumnItem) {
        super.onSearchItemDelete(deletedItem);

        // this.deleteItem(this.keywordsService.selectedKeywordsSearchList, deletedItem, deletedItem.values[1].name);
        // this.deleteItem(this.keywordsService.selectedKeywordsArray, deletedItem, deletedItem.values[1].name == this.parentSearchType ? 0 : 1);
    }



    // ======================================================================( GET ITEM )====================================================================== \\

    getItem(x: HierarchyItem) {
        return {
            id: x.id,
            name: x.name,
            hierarchyGroupID: 0,
            hidden: false,
            arrowDown: false,
            case: CaseType.CapitalizedCase
        }
    }



    // ===================================================================( GET CHILD ITEM )=================================================================== \\

    getChildItem(child: HierarchyItem) {
        return {
            id: child.id,
            name: child.name,
            hierarchyGroupID: 1,
            hidden: false,
            case: CaseType.LowerCase
        }
    }



    // // ===================================================================( GET OTHER ITEM )=================================================================== \\

    // getOtherItem(x: KeywordCheckboxItem) {
    //     return {
    //         id: x.id,
    //         name: x.name,
    //         hierarchyGroupID: 0,
    //         hidden: false,
    //         arrowDown: false,
    //         opacity: x.forProduct ? 0.4 : null!
    //     }
    // }



    // ================================================================( GET ITEM PARAMETERS )================================================================= \\

    getItemParameters(): Array<KeyValue<any, any>> {
        return [{ key: 'productId', value: this.productService.product.id }];
    }



    // ============================================================( GET DELETED ITEM PARAMETERS )============================================================ \\

    getDeletedItemParameters(deletedItem: HierarchyItem) {
        let keywordGroupId = null;

        if(deletedItem.hierarchyGroupID == 1) {
            const parentIndex = this.getIndexOfHierarchyItemParent(this.thisArray[deletedItem.index!], this.thisArray);
            keywordGroupId = this.thisArray[parentIndex].id;
        }
        return {
            id: deletedItem.id,
            keywordGroupId: keywordGroupId
        }
    }



    // ===============================================================( GET SEARCH RESULT ITEM )=============================================================== \\

    getSearchResultItem(x: SearchResultItem) {
        let caseType: CaseType = x.type == 'Group' ? CaseType.CapitalizedCase : CaseType.LowerCase;

        return {
            id: x.id,
            name: null!,
            values: [{ name: x.name!, width: this.searchNameWidth, allowEdit: true }, { name: x.type!, width: this.searchTypeWidth }],
            case: caseType
        }
    }
}