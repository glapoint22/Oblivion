import { KeyValue } from "@angular/common";
import { Directive, ViewChild } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { DataService } from "common";
import { HierarchyComponent } from "../components/hierarchies/hierarchy/hierarchy.component";
import { MultiColumnListComponent } from "../components/lists/multi-column-list/multi-column-list.component";
import { FiltersService } from "../services/filters/filters.service";
import { ProductService } from "../services/product/product.service";
import { CheckboxItem } from "./checkbox-item";
import { HierarchyUpdate } from "./hierarchy-update";
import { HierarchyUpdateManager } from "./hierarchy-update-manager";

@Directive()
export class FormFiltersUpdateManager extends HierarchyUpdateManager {
    // Decorators
    @ViewChild('hierarchyComponent') listComponent!: HierarchyComponent;
    @ViewChild('searchComponent') searchComponent!: MultiColumnListComponent;


    // ====================================================================( CONSTRUCTOR )==================================================================== \\

    constructor(dataService: DataService, sanitizer: DomSanitizer, public filtersService: FiltersService, public productService: ProductService) {
        super(dataService, sanitizer);

    }



    // ====================================================================( NG ON INIT )===================================================================== \\

    ngOnInit() {
        this.itemType = 'Filter';
        this.childType = 'Filter Option';
        this.dataServicePath = 'Filters';
        this.childDataServicePath = 'Filters/Options';
        this.parentSearchType = 'Filter';
        this.childSearchType = 'Option';
        this.searchNameWidth = '246px';
        this.searchTypeWidth = '55px';
        this.hierarchyUpdateService = this.filtersService;
        this.thisArray = this.filtersService.formArray;
        this.otherArray = this.filtersService.productArray;
        this.thisSearchList = this.filtersService.formSearchList;
        this.otherSearchList = this.filtersService.productSearchList;
        this.searchInputName = 'filtersFormSearchInput';
    }

    

    // ================================================================( GET OTHER CHILD ITEM )================================================================ \\

    getOtherChildItem(child: CheckboxItem, hierarchyUpdate: HierarchyUpdate) {
        return {
            id: child.id!,
            name: child.name,
            hierarchyGroupID: 1,
            hidden: !this.otherArray[hierarchyUpdate.index!].arrowDown,
            arrowDown: false,
            isParent: false,
            checked: child.checked
        }
    }



    // =============================================================( GET CHILD ITEM PARAMETERS )============================================================== \\

    getChildItemParameters(hierarchyUpdate: HierarchyUpdate): Array<KeyValue<any, any>> {
        return [{ key: 'productId', value: this.productService.product.id }, { key: 'parentId', value: hierarchyUpdate.id }];
    }


    getChildItem(child: CheckboxItem) {
        return {
            id: child.id,
            name: child.name,
            hierarchyGroupID: 1,
            hidden: false
        }
    }
}