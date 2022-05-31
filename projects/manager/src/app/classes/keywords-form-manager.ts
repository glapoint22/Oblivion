import { DomSanitizer } from "@angular/platform-browser";
import { DataService } from "common";
import { KeywordsService } from "../services/keywords/keywords.service";
import { SortType } from "./enums";
import { HierarchyItem } from "./hierarchy-item";
import { KeywordCheckboxItem } from "./keyword-checkbox-item";
import { ListUpdate } from "./list-update";
import { ListUpdateManager } from "./list-update-manager";
import { MultiColumnItem } from "./multi-column-item";
import { MultiColumnListUpdate } from "./multi-column-list-update";

export class KeywordsFormManager extends ListUpdateManager {
    constructor(dataService: DataService, sanitizer: DomSanitizer, public keywordsService: KeywordsService) {
        super(dataService, sanitizer);
        this.sortType = SortType.Form;
        this.parentType = 'Keyword Group';
        this.childType = 'Keyword';
        this.parentDataServicePath = 'AvailableKeywords/Groups';
        this.childDataServicePath = 'AvailableKeywords';
        this.parentSearchType = 'Group';
        this.childSearchType = 'Keyword';
        this.searchNameWidth = '233px';
        this.searchTypeWidth = '68px';
        this.listUpdateService = this.keywordsService;
        this.thisArray = this.keywordsService.formArray;
        this.otherArray = this.keywordsService.productArray;
        this.thisSearchList = this.keywordsService.formSearchList;
        this.otherSearchList = this.keywordsService.productSearchList;
    }


    // =============================================================( SET OTHER HIERARCHY EDIT )============================================================== \\

    setOtherHierarchyEdit<T extends ListUpdate>(update: T, hierarchyGroupID: number) {
        super.setOtherHierarchyEdit<T>(update, hierarchyGroupID);

        const editedSelectedHierarchyItem: KeywordCheckboxItem = this.keywordsService.selectedKeywordsArray.find(x => x.id == update.id && x.hierarchyGroupID == hierarchyGroupID)!;

        // If the item in the other hierarchy list was found
        if (editedSelectedHierarchyItem) {
            // Then update the name of that item in the other list to the name of the item we just edited in this list
            editedSelectedHierarchyItem!.name = (update as MultiColumnListUpdate).values ? (update as MultiColumnListUpdate).values![0].name : update.name;
            // Then sort the other list
            this.setSelectedHierarchySort(editedSelectedHierarchyItem);
        }
    }



    // ===============================================================( SET OTHER SEARCH EDIT )=============================================================== \\

    setOtherSearchEdit<T extends ListUpdate>(update: T, type: string) {
        super.setOtherSearchEdit<ListUpdate>(update, type);

        // Find itme in the other search list that we just edited in this list
        const editedSelectedSearchItem: MultiColumnItem = this.keywordsService.selectedKeywordsSearchList.find(x => x.id == update.id && x.values[1].name == type)!;

        // If the item in the other search list was found
        if (editedSelectedSearchItem) {

            // Then update the name of that item in the other search list to the name of the item we just edited in this list
            editedSelectedSearchItem!.values[0].name = (update as MultiColumnListUpdate).values ? (update as MultiColumnListUpdate).values![0].name : update.name!;
        }
    }



    // ============================================================( SET SELECTED HIERARCHY SORT )============================================================ \\

    setSelectedHierarchySort(selectedHierarchyItem: KeywordCheckboxItem) {

        // As long as the other hierarchy sort group is NOT hidden
        if (!selectedHierarchyItem.hidden && this.keywordsService.selectedHierarchyComponent) {

            // Then sort the other hierarchy list
            this.keywordsService.selectedHierarchyComponent.listManager.sort(selectedHierarchyItem);

            // But if the other hierarchy sort group is NOT visible
        } else {

            // Make a list of all the items we edited in this hierarchy so that when we go back to the other hierarchy we can then sort those items accordingly
            this.keywordsService.sortList.push(selectedHierarchyItem);
        }
    }



    // =============================================================( ON HIERARCHY ITEM DELETE )============================================================== \\

    onHierarchyItemDelete(deletedItem: HierarchyItem) {
        super.onHierarchyItemDelete(deletedItem);
        this.deleteItem(this.keywordsService.selectedKeywordsArray, deletedItem, deletedItem.hierarchyGroupID!);
        this.deleteItem(this.keywordsService.selectedKeywordsSearchList, deletedItem as MultiColumnItem, deletedItem.hierarchyGroupID == 0 ? this.parentSearchType : this.childSearchType);
    }



    // ===============================================================( ON SEARCH ITEM DELETE )=============================================================== \\

    onSearchItemDelete(deletedItem: MultiColumnItem) {
        super.onSearchItemDelete(deletedItem);
        this.deleteItem(this.keywordsService.selectedKeywordsSearchList, deletedItem, deletedItem.values[1].name);
        this.deleteItem(this.keywordsService.selectedKeywordsArray, deletedItem, deletedItem.values[1].name == this.parentSearchType ? 0 : 1);
    }
}