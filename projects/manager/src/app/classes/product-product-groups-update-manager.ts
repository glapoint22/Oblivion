import { KeyValue } from "@angular/common";
import { Directive, Input, ViewChild } from "@angular/core";
import { CheckboxListComponent } from "../components/lists/checkbox-list/checkbox-list.component";
import { CheckboxItem } from "./checkbox-item";
import { CheckboxListUpdate } from "./checkbox-list-update";
import { CheckboxSearchResultItem } from "./checkbox-search-result-item";
import { CaseType, ListUpdateType } from "./enums";
import { FormProductGroupsUpdateManager } from "./form-product-groups-update-manager";

@Directive()
export class ProductProductGroupsUpdateManager extends FormProductGroupsUpdateManager {
    // Public
    public thisArray: Array<CheckboxItem> = new Array<CheckboxItem>();
    public thisSearchArray: Array<CheckboxItem> = new Array<CheckboxItem>();

    // Decorators
    @Input() productId!: number;
    @Input() productIndex!: number;
    @ViewChild('listComponent') listComponent!: CheckboxListComponent;
    @ViewChild('searchComponent') searchComponent!: CheckboxListComponent;


    // ====================================================================( NG ON INIT )===================================================================== \\

    ngOnInit() {
        super.ngOnInit();
        this.otherArray = this.productService.formProductGroupArray;
        this.otherSearchArray = this.productService.formProductGroupSearchArray;
        this.searchInputName = 'productProductGroupsSearchInput' + this.productId;
        this.thisArray = this.productService.productComponents[this.productIndex].productProductGroupArray;
        this.thisSearchArray = this.productService.productComponents[this.productIndex].productProductGroupSearchArray;
    }



    // ==================================================================( ON LIST UPDATE )=================================================================== \\

    onListUpdate(checkboxListUpdate: CheckboxListUpdate) {
        super.onListUpdate(checkboxListUpdate);
        if (checkboxListUpdate.type == ListUpdateType.CheckboxChange) this.onItemCheckboxChange(checkboxListUpdate);
    }



    // ===============================================================( ON SEARCH LIST UPDATE )=============================================================== \\

    onSearchListUpdate(searchUpdate: CheckboxListUpdate) {
        super.onSearchListUpdate(searchUpdate);
        if (searchUpdate.type == ListUpdateType.CheckboxChange) this.onSearchItemCheckboxChange(searchUpdate);
    }



    // ==============================================================( ON ITEM CHECKBOX CHANGE )============================================================== \\

    onItemCheckboxChange(checkboxListUpdate: CheckboxListUpdate) {
        // ********* Commented Out Data Service *********
        // this.dataService.put('api/Products/Subgroup', {
        //     productId: this.productId,
        //     id: checkboxListUpdate.id,
        //     checked: checkboxListUpdate.checked
        // }).subscribe();
    }



    // ==========================================================( ON SEARCH ITEM CHECKBOX CHANGE )=========================================================== \\

    onSearchItemCheckboxChange(checkboxListUpdate: CheckboxListUpdate) {
        // ********* Commented Out Data Service *********
        // this.dataService.put('api/Products/Subgroup', {
        //     productId: this.productId,
        //     id: checkboxListUpdate.id,
        //     checked: checkboxListUpdate.checked
        // }).subscribe();

        // Check to see if the search item that had the checkbox change is visible in the hierarchy
        const listItem = this.thisArray.find(x => x.id == checkboxListUpdate.id && x.name == checkboxListUpdate.name);
        // If it is, make the change to its checkbox as well
        if (listItem) listItem.checked = checkboxListUpdate.checked;
    }



    // ======================================================================( GET ITEM )====================================================================== \\

    getItem(x: CheckboxItem) {
        return {
            id: x.id,
            name: x.name,
            checked: x.checked,
            case: CaseType.CapitalizedCase
        }
    }



    // ================================================================( GET ITEM PARAMETERS )================================================================= \\

    getItemParameters(): Array<KeyValue<any, any>> {
        return [{ key: 'productId', value: this.productId }];
    }



    // ===============================================================( GET SEARCH RESULT ITEM )============================================================== \\

    getSearchResultItem(x: CheckboxSearchResultItem) {
        return {
            id: x.id,
            name: x.name,
            checked: x.checked,
            case: CaseType.CapitalizedCase
        }
    }



    // ===========================================================( GET SEARCH RESULTS PARAMETERS )=========================================================== \\

    getSearchResultsParameters(searchWords: string): Array<KeyValue<any, any>> {
        return [{ key: 'productId', value: this.productId }, { key: 'searchWords', value: searchWords }];
    }
}