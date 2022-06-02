import { DomSanitizer } from "@angular/platform-browser";
import { DataService } from "common";
import { ProductGroupsService } from "../services/product-groups/product-groups.service";
import { SortType } from "./enums";
import { ListUpdateManager } from "./list-update-manager";

export class ProductGroupsFormManager extends ListUpdateManager {
    constructor(dataService: DataService, sanitizer: DomSanitizer, public productGroupsService: ProductGroupsService) {
        super(dataService, sanitizer);
        this.itemType = 'Product Group';
        this.dataServicePath = 'Subgroups';
        this.sortType = SortType.Form;
        this.listUpdateService = this.productGroupsService;
        this.thisArray = this.productGroupsService.formArray;
        this.otherArray = this.productGroupsService.productArray;
        this.thisSearchList = this.productGroupsService.formSearchList;
        this.otherSearchList = this.productGroupsService.productSearchList;
    }
}