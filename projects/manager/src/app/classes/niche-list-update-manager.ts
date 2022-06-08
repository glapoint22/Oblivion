import { DomSanitizer } from "@angular/platform-browser";
import { DataService } from "common";
import { ListUpdateManager } from "./list-update-manager";

export class NicheListUpdateManager extends ListUpdateManager {
    constructor(dataService: DataService, sanitizer: DomSanitizer) {
        super(dataService, sanitizer);
        this.itemType = 'Niche';
        this.dataServicePath = 'Niches';
        // this.sortType = SortType.Form;
        // this.listUpdateService = this.productGroupsService;
        // this.thisArray = this.productGroupsService.formArray;
        // this.otherArray = this.productGroupsService.productArray;
        // this.thisSearchList = this.productGroupsService.formSearchList;
        // this.otherSearchList = this.productGroupsService.productSearchList;
    }
}