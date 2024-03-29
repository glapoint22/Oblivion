import { KeyValue } from "@angular/common";
import { Directive, EventEmitter, Output, ViewChild } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { DataService } from "common";
import { ListComponent } from "../components/lists/list/list.component";
import { ProductService } from "../services/product/product.service";
import { WidgetService } from "../services/widget/widget.service";
import { ListUpdateType, MenuOptionType } from "./enums";
import { ListItem } from "./list-item";
import { ListUpdate } from "./list-update";
import { ListUpdateManager } from "./list-update-manager";

@Directive()
export class PageNichesUpdateManager extends ListUpdateManager {
    @ViewChild('listComponent') listComponent!: ListComponent;
    @Output() onDuplicatePromptOpen: EventEmitter<void> = new EventEmitter();
    @Output() onDuplicatePromptClose: EventEmitter<void> = new EventEmitter();


    // ====================================================================( CONSTRUCTOR )==================================================================== \\

    constructor
        (
            dataService: DataService,
            sanitizer: DomSanitizer,
            productService: ProductService,
            private widgetService: WidgetService
        ) { super(dataService, sanitizer, productService); }



    // ====================================================================( NG ON INIT )==================================================================== \\
    ngOnInit() {
        super.ngOnInit();
        this.dataServicePath = 'Pages/Subniche';
        this.itemType = 'Subniche';
        this.listOptions.editable = false;
        this.listOptions.deletePrompt = null!;
        this.listOptions.menu!.menuOptions = [
            {
                name: 'Delete ' + this.itemType,
                type: MenuOptionType.MenuItem,
                shortcut: 'Delete',
                optionFunction: this.delete
            }
        ]
    }



    // ==================================================================( ON LIST UPDATE )=================================================================== \\

    onListUpdate(listUpdate: ListUpdate) {
        super.onListUpdate(listUpdate);
        if (listUpdate.type == ListUpdateType.DuplicatePromptOpen) this.onDuplicatePromptOpen.emit();
        if (listUpdate.type == ListUpdateType.DuplicatePromptClose) this.onDuplicatePromptClose.emit();
    }



    // ================================================================( GET ITEM PARAMETERS )================================================================= \\

    getItemParameters(): Array<KeyValue<any, any>> {
        return [{ key: 'pageId', value: this.widgetService.page.id }];
    }



    // =================================================================( ON SELECTED ITEM )================================================================== \\

    onSelectedItem(listUpdate: ListUpdate) {
        this.deleteIconButtonTitle = 'Delete ' + this.itemType;
    }



    // ============================================================( GET DELETED ITEM PARAMETERS )============================================================ \\

    getDeletedItemParameters(deletedItem: ListItem) {
        return {
            pageId: this.widgetService.page.id,
            id: deletedItem.id
        }
    }



    // ====================================================================( ON ITEM ADD )==================================================================== \\

    onItemAdd(listUpdate: ListUpdate) {
        this.dataService.post<number>('api/' + this.dataServicePath, {
            pageId: this.widgetService.page.id,
            subnicheId: listUpdate.id

        }, {
            authorization: true
        }).subscribe();
    }
}