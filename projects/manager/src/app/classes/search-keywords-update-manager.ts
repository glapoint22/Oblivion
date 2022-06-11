import { Directive, ViewChild } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { DataService } from "common";
import { CheckboxHierarchyComponent } from "../components/hierarchies/checkbox-hierarchy/checkbox-hierarchy.component";
import { WidgetService } from "../services/widget/widget.service";
import { MenuOptionType } from "./enums";
import { HierarchyUpdate } from "./hierarchy-update";
import { HierarchyUpdateManager } from "./hierarchy-update-manager";

@Directive()
export class SearchKeywordsUpdateManager extends HierarchyUpdateManager {
    @ViewChild('hierarchyComponent') listComponent!: CheckboxHierarchyComponent;

    constructor(dataService: DataService, sanitizer: DomSanitizer, private widgetService: WidgetService) { super(dataService, sanitizer); }

    ngOnInit() {
        this.dataServicePath = 'Keywords/PageReferenceItem';
        this.childDataServicePath = ''
        this.itemType = 'Keyword Group';
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

    onSelectedItem(hierarchyUpdate: HierarchyUpdate) {
        this.deleteIconButtonTitle = 'Delete ' + this.itemType;
    }



    // ====================================================================( ON ITEM ADD )==================================================================== \\

    onItemAdd(hierarchyUpdate: HierarchyUpdate) {
        this.dataService.post<number>('api/' + this.dataServicePath, {
            itemId: hierarchyUpdate.id,
            pageId: this.widgetService.page.id
        }).subscribe((id: number) => {
            this.thisArray[hierarchyUpdate.index!].id = id;
        });
    }
}