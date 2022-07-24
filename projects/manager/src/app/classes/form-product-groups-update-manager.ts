import { KeyValue } from "@angular/common";
import { Directive, ViewChild } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { DataService } from "common";
import { ListComponent } from "../components/lists/list/list.component";
import { ProductGroupsService } from "../services/product-groups/product-groups.service";
import { ProductService } from "../services/product/product.service";
import { CheckboxItem } from "./checkbox-item";
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
        // this.listUpdateService = this.productGroupsService;
        // this.thisArray = this.productGroupsService.formArray;
        // this.otherArray = this.productGroupsService.productArray;
        // this.thisSearchList = this.productGroupsService.formSearchList;
        // this.otherSearchList = this.productGroupsService.productSearchList;
        this.searchInputName = 'productGroupsFormSearchInput';
        this.searchOptions.sortable = false;
    }



    // ==================================================================( ON LIST UPDATE )=================================================================== \\

    onListUpdate(listUpdate: ListUpdate) {
        super.onListUpdate(listUpdate);
        if (listUpdate.type == ListUpdateType.CaseTypeUpdate) this.thisArray[listUpdate.index!].case = CaseType.CapitalizedCase;
    }



    // // ===================================================================( GET OTHER ITEM )=================================================================== \\

    // getOtherItem(x: ListItem) {
    //     return {
    //         id: x.id,
    //         name: x.name,
    //         checked: (x as CheckboxItem).checked
    //     }
    // }



    // ================================================================( GET ITEM PARAMETERS )================================================================= \\

    getItemParameters(): Array<KeyValue<any, any>> {
        return [{ key: 'productId', value: this.productService.product.id }];
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