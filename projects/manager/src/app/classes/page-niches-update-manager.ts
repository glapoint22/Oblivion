import { KeyValue } from "@angular/common";
import { Directive, ViewChild } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { DataService } from "common";
import { ListComponent } from "../components/lists/list/list.component";
import { WidgetService } from "../services/widget/widget.service";
import { MenuOptionType } from "./enums";
import { ListItem } from "./list-item";
import { ListUpdate } from "./list-update";
import { ListUpdateManager } from "./list-update-manager";

@Directive()
export class PageNichesUpdateManager extends ListUpdateManager {
    @ViewChild('listComponent') listComponent!: ListComponent;

    constructor
        (
            dataService: DataService,
            sanitizer: DomSanitizer,
            private widgetService: WidgetService
        ) { super(dataService, sanitizer); }




    // ====================================================================( NG ON INIT )==================================================================== \\
    ngOnInit() {
        this.dataServicePath = 'Pages/Niche';
        this.itemType = 'Niche';
        this.listOptions.editable = false;
        this.listOptions.menu!.menuOptions = [
            {
                name: 'Delete ' + this.itemType,
                type: MenuOptionType.MenuItem,
                shortcut: 'Delete',
                optionFunction: this.delete
            }
        ]
    }



    // ================================================================( GET ITEM PARAMETERS )================================================================= \\

    getItemParameters(): Array<KeyValue<any, any>> {
        return [{ key: 'pageId', value: this.widgetService.page.id }];
    }



    // =================================================================( ON SELECTED ITEM )================================================================== \\

    onSelectedItem(listUpdate: ListUpdate) {
        this.deleteIconButtonTitle = 'Delete ' + this.itemType;
    }



    // ====================================================================( ON ITEM ADD )==================================================================== \\

    onItemAdd(listUpdate: ListUpdate) {
        this.dataService.post<number>('api/' + this.dataServicePath, {
            itemId: listUpdate.id,
            pageId: this.widgetService.page.id
        }).subscribe();
    }



    // ==================================================================( ON ITEM DELETE )=================================================================== \\

    onItemDelete(deletedItem: ListItem) {
        this.dataService.delete('api/' + this.dataServicePath, {
            nicheId: deletedItem.id,
            pageId: this.widgetService.page.id
        }).subscribe();

    }
}