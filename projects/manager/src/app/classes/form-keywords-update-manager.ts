import { HierarchyItem } from "./hierarchy-item";
import { HierarchyUpdate } from "./hierarchy-update";
import { HierarchyUpdateManager } from "./hierarchy-update-manager";
import { MultiColumnItem } from "./multi-column-item";
import { MultiColumnListUpdate } from "./multi-column-list-update";
import { Directive, ViewChild } from "@angular/core";
import { HierarchyComponent } from "../components/hierarchies/hierarchy/hierarchy.component";
import { MultiColumnListComponent } from "../components/lists/multi-column-list/multi-column-list.component";
import { CaseType, ListUpdateType } from "./enums";
import { SearchResultItem } from "./search-result-item";
import { ListUpdate } from "./list-update";
import { ProductPropertiesComponent } from "../components/product-properties/product-properties.component";

@Directive()
export class FormKeywordsUpdateManager extends HierarchyUpdateManager {
    public secondOtherProductArray: keyof ProductPropertiesComponent = 'selectedKeywordArray';
    public secondOtherProductSearchArray: keyof ProductPropertiesComponent = 'selectedKeywordSearchArray';


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
        this.searchInputName = 'keywordsFormSearchInput';

        this.otherProductArray = 'availableKeywordArray';
        this.otherProductSearchArray = 'availableKeywordSearchArray';
        this.thisArray = this.productService.formKeywordArray;
        this.thisSearchArray = this.productService.formKeywordSearchArray;
    }



    // ==================================================================( ON LIST UPDATE )=================================================================== \\

    onListUpdate(hierarchyUpdate: HierarchyUpdate) {
        super.onListUpdate(hierarchyUpdate);
        if (hierarchyUpdate.type == ListUpdateType.CaseTypeUpdate) this.thisArray[hierarchyUpdate.index!].case = hierarchyUpdate.hierarchyGroupID == 0 ? CaseType.CapitalizedCase : CaseType.LowerCase;
    }



    // =================================================================( UPDATE OTHER ITEMS )================================================================ \\

    updateOtherItems(update: ListUpdate) {
        super.updateOtherItems(update);

        // Products
        this.productService.productComponents.forEach(x => {

            if (update.type == ListUpdateType.Add) {
                if ((x[this.secondOtherProductArray] as Array<HierarchyItem>).length > 0) this.addOtherItem(x[this.secondOtherProductArray] as Array<HierarchyItem>, update.index!, this.thisArray[update.index!]);
            }

            if (update.type == ListUpdateType.Edit) {
                if ((x[this.secondOtherProductArray] as Array<HierarchyItem>).length > 0 && (update as HierarchyUpdate).hierarchyGroupID != null) this.editOtherItem(x[this.secondOtherProductArray] as Array<HierarchyItem>, update, (update as HierarchyUpdate).hierarchyGroupID);
                if ((x[this.secondOtherProductSearchArray] as Array<MultiColumnItem>).length > 0) {
                    if ((update as HierarchyUpdate).hierarchyGroupID != null) this.editOtherItem(x[this.secondOtherProductSearchArray] as Array<MultiColumnItem>, update, ((update as HierarchyUpdate).hierarchyGroupID == 0 ? this.parentSearchType : this.childSearchType));
                    if ((update as MultiColumnListUpdate).values) this.editOtherItem(x[this.secondOtherProductSearchArray] as Array<MultiColumnItem>, update, (update as MultiColumnListUpdate).values![1].name);
                }
                if ((x[this.secondOtherProductArray] as Array<HierarchyItem>).length > 0 && (update as MultiColumnListUpdate).values) this.editOtherItem(x[this.secondOtherProductArray] as Array<HierarchyItem>, update, ((update as MultiColumnListUpdate).values![1].name == this.parentSearchType ? 0 : 1));
            }

        })
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



    // ============================================================( GET DELETED ITEM PARAMETERS )============================================================ \\

    getDeletedItemParameters(deletedItem: HierarchyItem) {
        let keywordGroupId = null;

        if (deletedItem.hierarchyGroupID == 1) {
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



    // =============================================================( GET ADDED OTHER CHILD ITEM )============================================================= \\

    getAddedOtherChildItem(array: Array<HierarchyItem>, hierarchyItem: HierarchyItem, indexOfOtherParent: number) {
        return {
            id: hierarchyItem.id,
            name: hierarchyItem.name,
            hierarchyGroupID: hierarchyItem.hierarchyGroupID,
            hidden: !array[indexOfOtherParent].arrowDown,
            opacity: array[indexOfOtherParent].opacity,
            checked: true
        }
    }
}