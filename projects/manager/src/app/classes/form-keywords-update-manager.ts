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
        this.childType = 'Keyword';
        this.searchTypeWidth = '68px';
        this.searchNameWidth = '233px';
        this.parentSearchType = 'Group';
        this.itemType = 'Keyword Group';
        this.childSearchType = 'Keyword';
        this.childDataServicePath = 'AvailableKeywords';
        this.otherProductArray = 'availableKeywordArray';
        this.searchInputName = 'keywordsFormSearchInput';
        this.dataServicePath = 'AvailableKeywords/Groups';
        this.thisArray = this.productService.formKeywordArray;
        this.otherProductSearchArray = 'availableKeywordSearchArray';
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

            // Add Other
            if (update.type == ListUpdateType.Add) {
                if ((update as HierarchyUpdate).hierarchyGroupID == 1) this.addOtherItem(x[this.secondOtherProductArray] as Array<HierarchyItem>, update.index!, this.thisArray[update.index!]);
            }

            // Edit Other
            if (update.type == ListUpdateType.Edit) {

                // From Hierarchy
                if ((update as HierarchyUpdate).hierarchyGroupID != null) {
                    this.editOtherItem(x[this.secondOtherProductArray] as Array<HierarchyItem>, update, (update as HierarchyUpdate).hierarchyGroupID);
                    this.editOtherItem(x[this.secondOtherProductSearchArray] as Array<MultiColumnItem>, update, ((update as HierarchyUpdate).hierarchyGroupID == 0 ? this.parentSearchType : this.childSearchType));
                }

                // From Search
                if ((update as MultiColumnListUpdate).values) {
                    this.editOtherItem(x[this.secondOtherProductArray] as Array<HierarchyItem>, update, ((update as MultiColumnListUpdate).values![1].name == this.parentSearchType ? 0 : 1));
                    this.editOtherItem(x[this.secondOtherProductSearchArray] as Array<MultiColumnItem>, update, (update as MultiColumnListUpdate).values![1].name);
                }
            }


            // Delete Other
            if (update.type == ListUpdateType.Delete) {

                // From Hierarchy
                if (update.deletedItems![0].hierarchyGroupID != null) {
                    this.deleteOtherItem(x[this.secondOtherProductArray] as Array<HierarchyItem>, update.deletedItems![0], update.deletedItems![0].hierarchyGroupID!);
                    this.deleteOtherItem(x[this.secondOtherProductSearchArray] as Array<MultiColumnItem>, update.deletedItems![0] as MultiColumnItem, (update.deletedItems![0].hierarchyGroupID == 0 ? this.parentSearchType : this.childSearchType));
                }

                // From Search
                if ((update.deletedItems![0] as MultiColumnListUpdate).values) {
                    this.deleteOtherItem(x[this.secondOtherProductArray] as Array<HierarchyItem>, update.deletedItems![0] as MultiColumnItem, (update.deletedItems![0] as MultiColumnItem).values![1].name == this.parentSearchType ? 0 : 1);
                    this.deleteOtherItem(x[this.secondOtherProductSearchArray] as Array<MultiColumnItem>, update.deletedItems![0] as MultiColumnItem, (update.deletedItems![0] as MultiColumnItem).values![1].name);
                }
            }
        })
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


    //     productId: this.productId,
                //     id: searchUpdate.deletedItems![0].id



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