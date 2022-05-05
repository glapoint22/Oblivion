import { DomSanitizer } from "@angular/platform-browser";
import { DataService } from "common";
import { FiltersService } from "../services/filters/filters.service";
import { SortType } from "./enums";
import { ListUpdateManager } from "./list-update-manager";

export class FiltersFormManager extends ListUpdateManager {
    constructor(dataService: DataService, sanitizer: DomSanitizer, public filtersService: FiltersService) {
        super(dataService, sanitizer);
        this.parentType = 'Filter';
        this.childType = 'Filter Option';
        this.parentDataServicePath = 'Filters';
        this.childDataServicePath = 'Filters/Options';
        this.searchParentName = 'Filter';
        this.searchChildName = 'Option';
        this.searchNameWidth = '246px';
        this.searchTypeWidth = '55px';
        this.sortType = SortType.Form;
        this.propertyService = this.filtersService;
        this.thisArray = this.filtersService.formArray;
        this.otherArray = this.filtersService.productArray;
    }
}