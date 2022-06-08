import { Directive, ViewChild } from "@angular/core";
import { ListComponent } from "../components/lists/list/list.component";
import { ListUpdateManager } from "./list-update-manager";

@Directive()
export class BrowseNichesUpdateManager extends ListUpdateManager {
    @ViewChild('listComponent') listComponent!: ListComponent;
}