import { KeyValue } from "@angular/common";
import { Directive, ViewChild } from "@angular/core";
import { HierarchyComponent } from "../components/hierarchies/hierarchy/hierarchy.component";
import { MultiColumnListComponent } from "../components/lists/multi-column-list/multi-column-list.component";
import { CheckboxItem } from "./checkbox-item";
import { CheckboxListUpdate } from "./checkbox-list-update";
import { CheckboxMultiColumnListUpdate } from "./checkbox-multi-column-list-update";
import { CheckboxSearchResultItem } from "./checkbox-search-result-item";
import { CaseType, ListUpdateType } from "./enums";
import { FormFiltersUpdateManager } from "./form-filters-update-manager";
import { HierarchyUpdate } from "./hierarchy-update";

@Directive()
export class ProductFiltersUpdateManager extends FormFiltersUpdateManager {
    // Public
    public thisArray: Array<CheckboxItem> = new Array<CheckboxItem>();

    // Decorators
    @ViewChild('hierarchyComponent') listComponent!: HierarchyComponent;
    @ViewChild('searchComponent') searchComponent!: MultiColumnListComponent;


    // ====================================================================( NG ON INIT )===================================================================== \\

    ngOnInit() {
        super.ngOnInit();
        this.searchNameWidth = '296px';
        this.thisArray = this.filtersService.productArray;
        this.otherArray = this.filtersService.formArray;
        this.thisSearchList = this.filtersService.productSearchList;
        this.otherSearchList = this.filtersService.formSearchList;
        this.searchInputName = 'productFiltersSearchInput';
    }



    // ==================================================================( ON LIST UPDATE )=================================================================== \\

    onListUpdate(hierarchyUpdate: HierarchyUpdate) {
        super.onListUpdate(hierarchyUpdate);
        if (hierarchyUpdate.type == ListUpdateType.CheckboxChange) this.onItemCheckboxChange(hierarchyUpdate);
    }



    // ===============================================================( ON SEARCH LIST UPDATE )=============================================================== \\

    onSearchListUpdate(searchUpdate: CheckboxMultiColumnListUpdate) {
        super.onSearchListUpdate(searchUpdate);
        if (searchUpdate.type == ListUpdateType.CheckboxChange) this.onSearchItemCheckboxChange(searchUpdate);
    }



    // ==============================================================( ON ITEM CHECKBOX CHANGE )============================================================== \\

    onItemCheckboxChange(hierarchyUpdate: CheckboxListUpdate) {
        // ********* commited Data Service *********
        // this.dataService.put('api/Products/Filter', {
        //     productId: this.productService.product.id,
        //     id: hierarchyUpdate.id,
        //     checked: hierarchyUpdate.checked
        // }).subscribe();
    }



    // ==========================================================( ON SEARCH ITEM CHECKBOX CHANGE )=========================================================== \\

    onSearchItemCheckboxChange(checkboxMultiColumnListUpdate: CheckboxMultiColumnListUpdate) {
        // ********* commited Data Service *********
        // this.dataService.put('api/Products/Filter', {
        //     productId: this.productService.product.id,
        //     id: checkboxMultiColumnListUpdate.id,
        //     checked: checkboxMultiColumnListUpdate.checked
        // }).subscribe();

        // Check to see if the search item that had the checkbox change is visible in the hierarchy
        const hierarchyItem = this.thisArray.find(x => x.id == checkboxMultiColumnListUpdate.id && x.hierarchyGroupID == 1);
        // If it is, make the change to its checkbox as well
        if (hierarchyItem) hierarchyItem.checked = checkboxMultiColumnListUpdate.checked;
    }



    // ===================================================================( GET CHILD ITEM )=================================================================== \\

    getChildItem(child: CheckboxItem) {
        return {
            id: child.id!,
            name: child.name,
            hierarchyGroupID: 1,
            hidden: false,
            arrowDown: false,
            isParent: false,
            checked: child.checked,
            case: CaseType.CapitalizedCase
        }
    }



    // ===============================================================( GET SEARCH RESULT ITEM )============================================================== \\

    getSearchResultItem(x: CheckboxSearchResultItem) {
        return {
            id: x.id!,
            name: null!,
            values: [{ name: x.name!, width: this.searchNameWidth, allowEdit: true }, { name: x.type!, width: this.searchTypeWidth }],
            checked: x.checked,
            case: CaseType.CapitalizedCase
        }
    }



    // ===========================================================( GET SEARCH RESULTS PARAMETERS )=========================================================== \\

    getSearchResultsParameters(searchWords: string): Array<KeyValue<any, any>> {
        return [{ key: 'productId', value: this.productService.product.id }, { key: 'searchWords', value: searchWords }];
    }
}