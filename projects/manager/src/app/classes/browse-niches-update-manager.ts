import { Directive, ViewChild } from "@angular/core";
import { ListComponent } from "../components/lists/list/list.component";
import { MenuOptionType } from "./enums";
import { ListUpdate } from "./list-update";
import { ListUpdateManager } from "./list-update-manager";

@Directive()
export class BrowseNichesUpdateManager extends ListUpdateManager {
    @ViewChild('listComponent') listComponent!: ListComponent;


    ngOnInit() {
        // this.dataServicePath = 'trumpy';
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
        // ********* commited Data Service *********
        // this.dataService.post<number>('api/' + this.dataServicePath, {
        //     name: listUpdate.name
        // }).subscribe();
    }
}