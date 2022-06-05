import { KeyValue } from "@angular/common";
import { DomSanitizer } from "@angular/platform-browser";
import { DataService } from "common";
import { FiltersService } from "../services/filters/filters.service";
import { ProductService } from "../services/product/product.service";
import { CheckboxItem } from "./checkbox-item";
import { CheckboxListUpdate } from "./checkbox-list-update";
import { ListUpdateType, SortType } from "./enums";
import { FiltersFormManager } from "./filters-form-manager";
import { HierarchyItem } from "./hierarchy-item";
import { HierarchyUpdate } from "./hierarchy-update";

export class ProductFiltersManager extends FiltersFormManager {
    public thisArray: Array<CheckboxItem> = new Array<CheckboxItem>();


    // ====================================================================( CONSTRUCTOR )==================================================================== \\

    constructor(dataService: DataService, sanitizer: DomSanitizer, filtersService: FiltersService, private productService: ProductService) {
        super(dataService, sanitizer, filtersService);
        this.searchNameWidth = '296px';
        this.sortType = SortType.Product;
        this.thisArray = this.filtersService.productArray;
        this.otherArray = this.filtersService.formArray;
        this.thisSearchList = this.filtersService.productSearchList;
        this.otherSearchList = this.filtersService.formSearchList;
    }



    // ==================================================================( ON LIST UPDATE )=================================================================== \\

    onListUpdate(hierarchyUpdate: HierarchyUpdate) {
        super.onListUpdate(hierarchyUpdate);
        if (hierarchyUpdate.type == ListUpdateType.CheckboxChange) this.onItemCheckboxChange(hierarchyUpdate);
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



    // ===================================================================( GET CHILD ITEM )=================================================================== \\

    getChildItem(child: CheckboxItem) {
        return {
            id: child.id!,
            name: child.name,
            hierarchyGroupID: 1,
            hidden: false,
            arrowDown: false,
            isParent: false,
            checked: child.checked
        }
    }



    // ================================================================( GET OTHER CHILD ITEM )================================================================ \\

    getOtherChildItem(child: CheckboxItem, hierarchyUpdate: HierarchyUpdate) {
        return {
            id: child.id!,
            name: child.name,
            hierarchyGroupID: 1,
            arrowDown: false,
            isParent: false,
            hidden: !this.otherArray[hierarchyUpdate.index!].arrowDown
        }
    }



    // =============================================================( GET CHILD ITEM PARAMETERS )============================================================== \\

    getChildItemParameters(hierarchyUpdate: HierarchyUpdate): Array<KeyValue<any, any>> {
        return [{ key: 'productId', value: this.productService.product.id }, { key: 'parentId', value: hierarchyUpdate.id }];
    }
}