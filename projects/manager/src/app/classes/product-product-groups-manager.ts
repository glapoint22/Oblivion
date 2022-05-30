import { DomSanitizer } from "@angular/platform-browser";
import { DataService } from "common";
import { ProductGroupsService } from "../services/product-groups/product-groups.service";
import { SortType } from "./enums";
import { ProductGroupsFormManager } from "./product-groups-form-manager";

export class ProductProductGroupsManager extends ProductGroupsFormManager {
    constructor(dataService: DataService, sanitizer: DomSanitizer, public productGroupsService: ProductGroupsService) {
        super(dataService, sanitizer, productGroupsService);
        this.sortType = SortType.Product;
        this.thisArray = this.productGroupsService.productArray;
        this.otherArray = this.productGroupsService.formArray;
        this.thisSearchList = this.productGroupsService.productSearchList;
        this.otherSearchList = this.productGroupsService.formSearchList;
    }
}