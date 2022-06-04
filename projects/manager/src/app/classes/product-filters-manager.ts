import { DomSanitizer } from "@angular/platform-browser";
import { DataService } from "common";
import { FiltersService } from "../services/filters/filters.service";
import { ProductService } from "../services/product/product.service";
import { CheckboxItem } from "./checkbox-item";
import { CheckboxListUpdate } from "./checkbox-list-update";
import { ListUpdateType, SortType } from "./enums";
import { FiltersFormManager } from "./filters-form-manager";
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







    // ================================================================( ON HIERARCHY UPDATE )================================================================ \\

    onListUpdate(hierarchyUpdate: HierarchyUpdate) {
        super.onListUpdate(hierarchyUpdate);
        if (hierarchyUpdate.type == ListUpdateType.CheckboxChange) this.onItemCheckboxChange(hierarchyUpdate);
    }



    // =========================================================( ON HIERARCHY ITEM CHECKBOX CHANGE )========================================================= \\

    onItemCheckboxChange(hierarchyUpdate: CheckboxListUpdate) {
        // ********* commited Data Service *********
        // this.dataService.put('api/Products/Filter', {
        //     productId: this.productService.product.id,
        //     id: hierarchyUpdate.id,
        //     checked: hierarchyUpdate.checked
        // }).subscribe();
    }



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



    getChildItems(hierarchyUpdate: HierarchyUpdate) {
        this.dataService.get<Array<CheckboxItem>>('api/Products/Filters', [{ key: 'productId', value: this.productService.product.id }, { key: 'filterId', value: hierarchyUpdate.id }])
            .subscribe((children: Array<CheckboxItem>) => {
                window.setTimeout(() => {
                    let num = this.listComponent.listManager.editedItem ? 2 : 1;
                    for (let i = children.length - 1; i >= 0; i--) {
                        this.thisArray.splice(hierarchyUpdate.index! + num, 0, this.getChildItem(children[i]));
                        this.otherArray.splice(hierarchyUpdate.index! + 1, 0, this.getOtherChildItem(children[i], hierarchyUpdate));
                    }
                    this.onChildrenLoad.next();
                })
            })
    }



}