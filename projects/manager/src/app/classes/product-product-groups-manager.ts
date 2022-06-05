import { KeyValue } from "@angular/common";
import { DomSanitizer } from "@angular/platform-browser";
import { DataService } from "common";
import { ProductGroupsService } from "../services/product-groups/product-groups.service";
import { ProductService } from "../services/product/product.service";
import { CheckboxItem } from "./checkbox-item";
import { CheckboxListUpdate } from "./checkbox-list-update";
import { CheckboxSearchResultItem } from "./checkbox-search-result-item";
import { ListUpdateType, SortType } from "./enums";
import { ListItem } from "./list-item";
import { ProductGroupsFormManager } from "./product-groups-form-manager";

export class ProductProductGroupsManager extends ProductGroupsFormManager {
    public thisArray: Array<CheckboxItem> = new Array<CheckboxItem>();


    // ====================================================================( CONSTRUCTOR )==================================================================== \\

    constructor(dataService: DataService, sanitizer: DomSanitizer, public productGroupsService: ProductGroupsService, private productService: ProductService) {
        super(dataService, sanitizer, productGroupsService);
        this.sortType = SortType.Product;
        this.thisArray = this.productGroupsService.productArray;
        this.otherArray = this.productGroupsService.formArray;
        this.thisSearchList = this.productGroupsService.productSearchList;
        this.otherSearchList = this.productGroupsService.formSearchList;
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
        // ********* commited Data Service *********
        // this.dataService.put('api/Products/Subgroup', {
        //     productId: this.productService.product.id,
        //     id: checkboxListUpdate.id,
        //     checked: checkboxListUpdate.checked
        // }).subscribe();
    }



    // ==========================================================( ON SEARCH ITEM CHECKBOX CHANGE )=========================================================== \\

    onSearchItemCheckboxChange(checkboxListUpdate: CheckboxListUpdate) {
        // ********* commited Data Service *********
        // this.dataService.put('api/Products/Subgroup', {
        //     productId: this.productService.product.id,
        //     id: checkboxListUpdate.id,
        //     checked: checkboxListUpdate.checked
        // }).subscribe();

        // Check to see if the search item that had the checkbox change is visible in the hierarchy
        const listItem = this.thisArray.find(x => x.id == checkboxListUpdate.id && x.name == checkboxListUpdate.name);
        // If it is, make the change to its checkbox as well
        if (listItem) listItem.checked = checkboxListUpdate.checked;
    }



    // ======================================================================( GET ITEM )====================================================================== \\

    getItem(x: ListItem) {
        return {
            id: x.id,
            name: x.name,
            checked: (x as CheckboxItem).checked
        }
    }



    // ================================================================( GET ITEM PARAMETERS )================================================================= \\

    getItemParameters(): Array<KeyValue<any, any>> {
        return [{ key: 'productId', value: this.productService.product.id }];
    }



    // ===============================================================( GET SEARCH RESULT ITEM )============================================================== \\

    getSearchResultItem(x: CheckboxSearchResultItem) {
        return {
            id: x.id,
            name: x.name,
            checked: x.checked
        }
    }



    // ===========================================================( GET SEARCH RESULTS PARAMETERS )=========================================================== \\

    getSearchResultsParameters(searchWords: string): Array<KeyValue<any, any>> {
        return [{ key: 'productId', value: this.productService.product.id }, { key: 'searchWords', value: searchWords }];
    }
}