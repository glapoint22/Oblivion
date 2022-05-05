import { DomSanitizer } from "@angular/platform-browser";
import { DataService } from "common";
import { KeywordsService } from "../services/keywords/keywords.service";
import { SortType } from "./enums";
import { ListUpdateManager } from "./list-update-manager";

export class KeywordsFormManager extends ListUpdateManager {
    constructor(dataService: DataService, sanitizer: DomSanitizer, public keywordsService: KeywordsService) {
        super(dataService, sanitizer);
        this.sortType = SortType.Form;
        this.parentType = 'Keyword Group';
        this.childType = 'Keyword';
        this.parentDataServicePath = 'AvailableKeywords/Groups';
        this.childDataServicePath = 'AvailableKeywords';
        this.searchParentName = 'Group';
        this.searchChildName = 'Keyword';
        this.searchNameWidth = '233px';
        this.searchTypeWidth = '68px';
        this.propertyService = this.keywordsService;
        this.thisArray = this.keywordsService.formArray;
        this.otherArray = this.keywordsService.productArray;
    }
}