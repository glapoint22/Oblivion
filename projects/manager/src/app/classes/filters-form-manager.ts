import { KeyValue } from "@angular/common";
import { Directive } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { DataService } from "common";
import { FiltersService } from "../services/filters/filters.service";
import { ProductService } from "../services/product/product.service";
import { CheckboxItem } from "./checkbox-item";
import { SortType } from "./enums";
import { HierarchyUpdate } from "./hierarchy-update";
import { HierarchyUpdateManager } from "./hierarchy-update-manager";

@Directive()
export class FiltersFormManager extends HierarchyUpdateManager {

    // ====================================================================( CONSTRUCTOR )==================================================================== \\

    constructor(dataService: DataService, sanitizer: DomSanitizer, public filtersService: FiltersService, public productService: ProductService) {
        super(dataService, sanitizer);
        this.itemType = 'Filter';
        this.childType = 'Filter Option';
        this.dataServicePath = 'Filters';
        this.childDataServicePath = 'Filters/Options';
        this.parentSearchType = 'Filter';
        this.childSearchType = 'Option';
        this.searchNameWidth = '246px';
        this.searchTypeWidth = '55px';
        this.sortType = SortType.Form;
        this.hierarchyUpdateService = this.filtersService;
        this.thisArray = this.filtersService.formArray;
        this.otherArray = this.filtersService.productArray;
        this.thisSearchList = this.filtersService.formSearchList;
        this.otherSearchList = this.filtersService.productSearchList;
    }


    // ================================================================( GET OTHER CHILD ITEM )================================================================ \\

    getOtherChildItem(child: CheckboxItem, hierarchyUpdate: HierarchyUpdate) {
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



    // =============================================================( GET CHILD ITEM PARAMETERS )============================================================== \\

    getChildItemParameters(hierarchyUpdate: HierarchyUpdate): Array<KeyValue<any, any>> {
        return [{ key: 'productId', value: this.productService.product.id }, { key: 'parentId', value: hierarchyUpdate.id }];
    }
}