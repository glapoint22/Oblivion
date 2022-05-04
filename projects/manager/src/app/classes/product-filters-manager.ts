import { DomSanitizer } from "@angular/platform-browser";
import { DataService } from "common";
import { FiltersService } from "../services/filters/filters.service";
import { ListUpdateType, SortType } from "./enums";
import { FiltersFormManager } from "./filters-form-manager";
import { HierarchyUpdate } from "./hierarchy-update";

export class ProductFiltersManager extends FiltersFormManager {
    constructor(dataService: DataService, sanitizer: DomSanitizer, filtersService: FiltersService) {
        super(dataService, sanitizer, filtersService);
        this.searchNameWidth = '296px';
        this.sortType = SortType.Product;
        this.thisArray = this.filtersService.productArray;
        this.otherArray = this.filtersService.formArray;
    }


    onHierarchyUpdate(hierarchyUpdate: HierarchyUpdate) {
        super.onHierarchyUpdate(hierarchyUpdate);
        if (hierarchyUpdate.type == ListUpdateType.CheckboxChange) console.log('hello')
    }
}