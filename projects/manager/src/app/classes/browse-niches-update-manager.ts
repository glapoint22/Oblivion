import { Directive, ViewChild } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { DataService } from "common";
import { ListComponent } from "../components/lists/list/list.component";
import { WidgetService } from "../services/widget/widget.service";
import { MenuOptionType } from "./enums";
import { ListUpdate } from "./list-update";
import { ListUpdateManager } from "./list-update-manager";

@Directive()
export class BrowseNichesUpdateManager extends ListUpdateManager {
    @ViewChild('listComponent') listComponent!: ListComponent;

    constructor(dataService: DataService, sanitizer: DomSanitizer, private widgetService: WidgetService) { super(dataService, sanitizer); }

    ngOnInit() {
        this.dataServicePath = 'Pages/PageReferenceItem';
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



    // =================================================================( ON SELECTED ITEM )================================================================== \\

    onSelectedItem(listUpdate: ListUpdate) {
        this.deleteIconButtonTitle = 'Delete ' + this.itemType;
    }



    // ====================================================================( ON ITEM ADD )==================================================================== \\

    onItemAdd(listUpdate: ListUpdate) {
        this.dataService.post<number>('api/' + this.dataServicePath, {
            itemId: listUpdate.id,
            pageId: this.widgetService.page.id
        }).subscribe((id: number) => {
            this.thisArray[listUpdate.index!].id = id;
        });
    }
}