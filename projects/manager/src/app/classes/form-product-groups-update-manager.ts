import { Directive, ViewChild } from "@angular/core";
import { ListComponent } from "../components/lists/list/list.component";
import { CaseType, ListUpdateType } from "./enums";
import { ListItem } from "./list-item";
import { ListUpdate } from "./list-update";
import { ListUpdateManager } from "./list-update-manager";
import { SearchResultItem } from "./search-result-item";

@Directive()
export class FormProductGroupsUpdateManager extends ListUpdateManager {
    // Decorators
    @ViewChild('listComponent') listComponent!: ListComponent;
    @ViewChild('searchComponent') searchComponent!: ListComponent;


    // ====================================================================( NG ON INIT )===================================================================== \\

    ngOnInit() {
        super.ngOnInit();
        this.itemType = 'Product Group';
        this.dataServicePath = 'Subgroups';
        this.searchOptions.sortable = false;
        this.searchInputName = 'productGroupsFormSearchInput';
        this.otherProductArray = 'productProductGroupArray';
        this.otherProductSearchArray = 'productProductGroupSearchArray';
        this.thisArray = this.productService.formProductGroupArray;
        this.thisSearchArray = this.productService.formProductGroupSearchArray;
    }



    // ==================================================================( ON LIST UPDATE )=================================================================== \\

    onListUpdate(listUpdate: ListUpdate) {
        super.onListUpdate(listUpdate);
        if (listUpdate.type == ListUpdateType.CaseTypeUpdate) this.thisArray[listUpdate.index!].case = CaseType.CapitalizedCase;
    }



    // ======================================================================( GET ITEM )====================================================================== \\

    getItem(x: ListItem) {
        return {
            id: x.id,
            name: x.name,
            case: CaseType.CapitalizedCase
        }
    }



    // ===============================================================( GET SEARCH RESULT ITEM )============================================================== \\

    getSearchResultItem(x: SearchResultItem) {
        return {
            id: x.id,
            name: x.name,
            case: CaseType.CapitalizedCase
        }
    }
}