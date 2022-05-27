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


    // ==================================================================( ON ARROW CLICK )=================================================================== \\

    onArrowClick(hierarchyUpdate: HierarchyUpdate) {
        // If a parent item was expanded and its children has NOT been loaded yet
        if (hierarchyUpdate.arrowDown && !hierarchyUpdate.hasChildren) {

            // If the hierarchy item is a top level hierarchy item
            if (hierarchyUpdate.hierarchyGroupID == 0) {

                this.dataService.get<Array<CheckboxListUpdate>>('api/Products/Filters', [{ key: 'productId', value: this.productService.product.id }, { key: 'filterId', value: hierarchyUpdate.id }])
                    .subscribe((children: Array<CheckboxListUpdate>) => {
                        let num = this.hierarchyComponent.listManager.editedItem ? 2 : 1;

                        for (let i = children.length - 1; i >= 0; i--) {

                            // This Array
                            this.thisArray.splice(hierarchyUpdate.index! + num, 0,
                                {
                                    id: children[i].id!,
                                    name: children[i].name,
                                    hierarchyGroupID: 1,
                                    hidden: false,
                                    arrowDown: false,
                                    isParent: this.isSecondLevelHierarchyItemParent,
                                    checked: children[i].checked
                                }
                            )

                            // Other Array
                            this.otherArray.splice(hierarchyUpdate.index! + 1, 0,
                                {
                                    id: children[i].id!,
                                    name: children[i].name,
                                    hierarchyGroupID: 1,
                                    arrowDown: false,
                                    isParent: this.isSecondLevelHierarchyItemParent,
                                    hidden: !this.otherArray[hierarchyUpdate.index!].arrowDown,
                                }
                            )
                        }
                        this.onChildrenLoad.next();
                    })
            }

            // But if a parent item was expanded and its children has ALREADY been loaded
        } else if (hierarchyUpdate.arrowDown && hierarchyUpdate.hasChildren) {
            // Sort any pending edited items
            this.sortPendingHierarchyItems();
        }
    }


    // ================================================================( ON HIERARCHY UPDATE )================================================================ \\

    onHierarchyUpdate(hierarchyUpdate: HierarchyUpdate) {
        super.onHierarchyUpdate(hierarchyUpdate);
        if (hierarchyUpdate.type == ListUpdateType.CheckboxChange) this.onHierarchyItemCheckboxChange(hierarchyUpdate);
    }



    // =========================================================( ON HIERARCHY ITEM CHECKBOX CHANGE )========================================================= \\

    onHierarchyItemCheckboxChange(hierarchyUpdate: CheckboxListUpdate) {
        this.dataService.put('api/Products/Filter', {
            productId: this.productService.product.id,
            id: hierarchyUpdate.id,
            checked: hierarchyUpdate.checked
        }).subscribe();
    }
}