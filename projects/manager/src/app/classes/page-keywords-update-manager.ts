import { KeyValue } from "@angular/common";
import { Directive, EventEmitter, Output, ViewChild } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { DataService } from "common";
import { CheckboxHierarchyComponent } from "../components/hierarchies/checkbox-hierarchy/checkbox-hierarchy.component";
import { ProductService } from "../services/product/product.service";
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
        this.dataServicePath = 'Pages/KeywordGroup';
        this.childDataServicePath = 'Pages/keywords';
        this.itemType = 'Keyword Group';
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

    onListUpdate(hierarchyUpdate: HierarchyUpdate) {
        super.onListUpdate(hierarchyUpdate);
        if (hierarchyUpdate.type == ListUpdateType.CheckboxChange) this.onItemCheckboxChange(hierarchyUpdate);
        if (hierarchyUpdate.type == ListUpdateType.DuplicatePromptOpen) this.onDuplicatePromptOpen.emit();
        if (hierarchyUpdate.type == ListUpdateType.DuplicatePromptClose) this.onDuplicatePromptClose.emit();
    }




    // ==============================================================( ON ITEM CHECKBOX CHANGE )============================================================== \\

    onItemCheckboxChange(hierarchyUpdate: CheckboxListUpdate) {
        const index = this.productService.getIndexOfHierarchyItemParent(this.thisArray[hierarchyUpdate.index!], this.thisArray);
        const keywordGroupId = this.thisArray[index].id;

        this.dataService.put('api/' + this.childDataServicePath, {
            pageId: this.widgetService.page.id,
            keywordGroupId: keywordGroupId,
            keywordId: hierarchyUpdate.id,
            checked: hierarchyUpdate.checked
        }, {
            authorization: true
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
        return [
            {
                key: 'pageId',
                value: this.widgetService.page.id
            },
            {
                key: 'KeywordGroupId',
                value: hierarchyUpdate.id
            }
        ];
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



    // ====================================================================( ON ITEM ADD )==================================================================== \\

    onItemAdd(hierarchyUpdate: HierarchyUpdate) {
        this.dataService.post<number>('api/' + this.dataServicePath, {
            pageId: this.widgetService.page.id,
            keywordGroupId: hierarchyUpdate.id
        }, {
            authorization: true
        }).subscribe();
    }



    // ============================================================( GET DELETED ITEM PARAMETERS )============================================================ \\

    getDeletedItemParameters(deletedItem: HierarchyItem) {
        return {
            pageId: this.widgetService.page.id,
            id: deletedItem.id,
        }
    }
}