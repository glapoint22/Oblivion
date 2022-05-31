import { DomSanitizer } from "@angular/platform-browser";
import { DataService } from "common";
import { ProductGroupsService } from "../services/product-groups/product-groups.service";
import { SortType } from "./enums";
import { NewListUpdateManager } from "./new-list-update-manager";

export class ProductGroupsFormManager extends NewListUpdateManager {
    constructor(dataService: DataService, sanitizer: DomSanitizer, public productGroupsService: ProductGroupsService) {
        super(dataService, sanitizer);
        this.itemType = 'Product Group';
        this.dataServicePath = 'Subgroups';
        // this.parentSearchType = 'Group';
        // this.searchNameWidth = '246px';
        // this.searchTypeWidth = '55px';
        this.sortType = SortType.Form;
        this.newListUpdateService = this.productGroupsService;
        this.thisArray = this.productGroupsService.formArray;
        this.otherArray = this.productGroupsService.productArray;
        this.thisSearchList = this.productGroupsService.formSearchList;
        this.otherSearchList = this.productGroupsService.productSearchList;
    }
}