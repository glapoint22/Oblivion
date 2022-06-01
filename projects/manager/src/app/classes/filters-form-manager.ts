import { DomSanitizer } from "@angular/platform-browser";
import { DataService } from "common";
import { FiltersService } from "../services/filters/filters.service";
import { SortType } from "./enums";
import { ListUpdateManager } from "./list-update-manager";

export class FiltersFormManager extends ListUpdateManager {
    constructor(dataService: DataService, sanitizer: DomSanitizer, public filtersService: FiltersService) {
        super(dataService, sanitizer);
        this.itemType = 'Filter';
        this.childType = 'Filter Option';
        this.dataServicePath = 'Filters';
        this.childDataServicePath = 'Filters/Options';
        this.parentSearchType = 'Filter';
        this.childSearchType = 'Option';
        this.searchNameWidth = '246px';
        this.searchTypeWidth = '55px';
        this.sortType = SortType.Form;
        this.listUpdateService = this.filtersService;
        this.thisArray = this.filtersService.formArray;
        this.otherArray = this.filtersService.productArray;
        this.thisSearchList = this.filtersService.formSearchList;
        this.otherSearchList = this.filtersService.productSearchList;
    }
}