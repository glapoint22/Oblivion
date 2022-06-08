import { KeyValue } from "@angular/common";
import { Directive, ViewChild } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { DataService } from "common";
import { ListComponent } from "../components/lists/list/list.component";
import { ProductGroupsService } from "../services/product-groups/product-groups.service";
import { ProductService } from "../services/product/product.service";
import { CheckboxItem } from "./checkbox-item";
import { SortType } from "./enums";
import { ListItem } from "./list-item";
import { ListUpdateManager } from "./list-update-manager";

@Directive()
export class ProductGroupsFormUpdateManager extends ListUpdateManager {
    @ViewChild('listComponent') listComponent!: ListComponent;
    @ViewChild('searchComponent') searchComponent!: ListComponent;

    // ====================================================================( CONSTRUCTOR )==================================================================== \\

    constructor(dataService: DataService, sanitizer: DomSanitizer, public productGroupsService: ProductGroupsService, public productService: ProductService) {
        super(dataService, sanitizer);
        
    }


    ngOnInit() {
        this.itemType = 'Product Group';
        this.dataServicePath = 'Subgroups';
        this.sortType = SortType.Form;
        this.listUpdateService = this.productGroupsService;
        this.thisArray = this.productGroupsService.formArray;
        this.otherArray = this.productGroupsService.productArray;
        this.thisSearchList = this.productGroupsService.formSearchList;
        this.otherSearchList = this.productGroupsService.productSearchList;
        this.searchInputName = 'productGroupsFormSearchInput';
    }


    ngAfterViewInit() {
        this.productGroupsService.formListComponent = this.listComponent;
    }



    ngAfterViewChecked() {
        this.otherListComponent = this.productGroupsService.productListComponent;
    }



    // ===================================================================( GET OTHER ITEM )=================================================================== \\

    getOtherItem(x: ListItem) {
        return {
            id: x.id,
            name: x.name,
            checked: (x as CheckboxItem).checked
        }
    }



    // ================================================================( GET ITEM PARAMETERS )================================================================= \\

    getItemParameters(): Array<KeyValue<any, any>> {
        return [{ key: 'productId', value: this.productService.product.id }];
    }
}