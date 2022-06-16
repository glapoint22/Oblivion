import { KeyValue } from "@angular/common";
import { Directive, ViewChild } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { DataService } from "common";
import { HierarchyComponent } from "../components/hierarchies/hierarchy/hierarchy.component";
import { MultiColumnListComponent } from "../components/lists/multi-column-list/multi-column-list.component";
import { FiltersService } from "../services/filters/filters.service";
import { ProductService } from "../services/product/product.service";
import { CheckboxItem } from "./checkbox-item";
import { CaseType, ListUpdateType } from "./enums";
import { HierarchyUpdate } from "./hierarchy-update";
import { HierarchyUpdateManager } from "./hierarchy-update-manager";
import { SearchResultItem } from "./search-result-item";

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



    // ==================================================================( ON LIST UPDATE )=================================================================== \\

    onListUpdate(hierarchyUpdate: HierarchyUpdate) {
        super.onListUpdate(hierarchyUpdate);
        if (hierarchyUpdate.type == ListUpdateType.CaseTypeUpdate) this.thisArray[hierarchyUpdate.index!].case = CaseType.CapitalizedCase;
    }



    // ======================================================================( GET ITEM )====================================================================== \\

    getItem(x: CheckboxItem) {
        return {
            id: x.id,
            name: x.name,
            hierarchyGroupID: 0,
            hidden: false,
            arrowDown: false,
            case: CaseType.CapitalizedCase
        }
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



    // ===================================================================( GET CHILD ITEM )=================================================================== \\

    getChildItem(child: CheckboxItem) {
        return {
            id: child.id,
            name: child.name,
            hierarchyGroupID: 1,
            hidden: false,
            case: CaseType.CapitalizedCase
        }
    }



    // ===============================================================( GET SEARCH RESULT ITEM )=============================================================== \\

    getSearchResultItem(x: SearchResultItem) {
        return {
            id: x.id,
            name: null!,
            values: [{ name: x.name!, width: this.searchNameWidth, allowEdit: true }, { name: x.type!, width: this.searchTypeWidth }],
            case: CaseType.CapitalizedCase
        }
    }
}