import { KeyValue } from "@angular/common";
import { Directive, ViewChild } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { DataService } from "common";
import { CheckboxHierarchyComponent } from "../components/hierarchies/checkbox-hierarchy/checkbox-hierarchy.component";
import { WidgetService } from "../services/widget/widget.service";
import { CheckboxItem } from "./checkbox-item";
import { CheckboxListUpdate } from "./checkbox-list-update";
import { ListUpdateType, MenuOptionType } from "./enums";
import { HierarchyItem } from "./hierarchy-item";
import { HierarchyUpdate } from "./hierarchy-update";
import { HierarchyUpdateManager } from "./hierarchy-update-manager";

@Directive()
export class PageKeywordsUpdateManager extends HierarchyUpdateManager {
    @ViewChild('hierarchyComponent') listComponent!: CheckboxHierarchyComponent;

    constructor
        (
            dataService: DataService,
            sanitizer: DomSanitizer,
            private widgetService: WidgetService
        ) { super(dataService, sanitizer); }



    // ====================================================================( NG ON INIT )==================================================================== \\
    ngOnInit() {
        this.dataServicePath = 'Pages/KeywordGroup';
        this.childDataServicePath = 'Pages/keywords';
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



    // ==================================================================( ON LIST UPDATE )=================================================================== \\

    onListUpdate(hierarchyUpdate: HierarchyUpdate) {
        super.onListUpdate(hierarchyUpdate);
        if (hierarchyUpdate.type == ListUpdateType.CheckboxChange) this.onItemCheckboxChange(hierarchyUpdate);
    }




    // ==============================================================( ON ITEM CHECKBOX CHANGE )============================================================== \\

    onItemCheckboxChange(hierarchyUpdate: CheckboxListUpdate) {
        const index = this.getIndexOfHierarchyItemParent(this.thisArray[hierarchyUpdate.index!], this.thisArray);
        const groupId = this.thisArray[index].id;

        this.dataService.put('api/' + this.childDataServicePath, {
            pageId: this.widgetService.page.id,
            keywordId: hierarchyUpdate.id,
            groupId: groupId,
            checked: hierarchyUpdate.checked
        }).subscribe();
    }



    // =================================================================( ON SELECTED ITEM )================================================================== \\

    onSelectedItem(hierarchyUpdate: HierarchyUpdate) {
        this.deleteIconButtonTitle = 'Delete ' + this.itemType;
    }



    // ================================================================( GET ITEM PARAMETERS )================================================================= \\

    getItemParameters(): Array<KeyValue<any, any>> {
        return [{ key: 'pageId', value: this.widgetService.page.id }];
    }



    // =============================================================( GET CHILD ITEM PARAMETERS )============================================================== \\

    getChildItemParameters(hierarchyUpdate: HierarchyUpdate): Array<KeyValue<any, any>> {
        return [{ key: 'groupId', value: hierarchyUpdate.id }, { key: 'pageId', value: this.widgetService.page.id }];
    }




    // ===================================================================( GET CHILD ITEM )=================================================================== \\

    getChildItem(child: CheckboxItem) {
        return {
            id: child.id,
            name: child.name,
            hierarchyGroupID: 1,
            hidden: false,
            checked: child.checked,
            selectable: false
        }
    }



    // ================================================================( GET OTHER CHILD ITEM )================================================================ \\

    getOtherChildItem(child: HierarchyItem, hierarchyUpdate: HierarchyUpdate) {
        return null!
    }



    // ====================================================================( ON ITEM ADD )==================================================================== \\

    onItemAdd(hierarchyUpdate: HierarchyUpdate) {
        this.dataService.post<number>('api/' + this.dataServicePath, {
            itemId: hierarchyUpdate.id,
            pageId: this.widgetService.page.id
        }).subscribe();
    }




    // ==================================================================( ON ITEM DELETE )=================================================================== \\

    onItemDelete(deletedItem: HierarchyItem) {
        this.dataService.delete('api/' + this.dataServicePath, {
            groupId: deletedItem.id,
            pageId: this.widgetService.page.id
        }).subscribe();

    }

}