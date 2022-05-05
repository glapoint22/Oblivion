import { DomSanitizer } from "@angular/platform-browser";
import { DataService } from "common";
import { KeywordsService } from "../services/keywords/keywords.service";
import { SortType } from "./enums";
import { KeywordsFormManager } from "./keywords-form-manager";

export class ProductKeywordsManager extends KeywordsFormManager {
    constructor(dataService: DataService, sanitizer: DomSanitizer, keywordsService: KeywordsService) {
        super(dataService, sanitizer, keywordsService);
        this.searchNameWidth = '296px';
        this.sortType = SortType.Product;
        this.thisArray = this.keywordsService.productArray;
        this.otherArray = this.keywordsService.formArray;
    }
}