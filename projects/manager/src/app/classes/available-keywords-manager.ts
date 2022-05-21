import { DomSanitizer } from "@angular/platform-browser";
import { DataService } from "common";
import { HierarchyComponent } from "../components/hierarchies/hierarchy/hierarchy.component";
import { KeywordsService } from "../services/keywords/keywords.service";
import { SortType } from "./enums";
import { HierarchyUpdate } from "./hierarchy-update";
import { KeywordsFormManager } from "./keywords-form-manager";

export class AvailableKeywordsManager extends KeywordsFormManager {
    public addToSelectedKeywordsButtonDisabled!: boolean;
    public selectedHierarchyComponent!: HierarchyComponent;

    constructor(dataService: DataService, sanitizer: DomSanitizer, keywordsService: KeywordsService) {
        super(dataService, sanitizer, keywordsService);
        this.searchNameWidth = '296px';
        this.sortType = SortType.Product;
        this.thisArray = this.keywordsService.productArray;
        this.otherArray = this.keywordsService.formArray;
    }


    // ======================================================================( ON OPEN )====================================================================== \\

    onOpen() {
        super.onOpen();
        this.addToSelectedKeywordsButtonDisabled = true;

        let onParentsLoad = () => {
            if (this.thisArray.length == 0 || this.selectedHierarchyComponent.listManager.sourceList.length == 0) {
                window.setTimeout(() => {
                    onParentsLoad();
                })
            } else {

                this.thisArray.forEach(x => {
                    const selectedItem = this.selectedHierarchyComponent.listManager.sourceList.find(y => y.id == x.id && y.hierarchyGroupID == 0);
                    if (selectedItem) x.opacity = 0.4;
                })
            }
        }
        onParentsLoad();
    }



    // ==================================================================( ON ARROW CLICK )=================================================================== \\

    onArrowClick(hierarchyUpdate: HierarchyUpdate) {
        super.onArrowClick(hierarchyUpdate);

        // If the parent has the disabled look
        if (this.thisArray[hierarchyUpdate.index!].opacity != null) {
            // And its children hasn't been loaded yet
            if (hierarchyUpdate.arrowDown && !hierarchyUpdate.hasChildren) {

                // Wait for the children to load
                let onChildrenLoadListener = this.onChildrenLoad.subscribe(() => {
                    onChildrenLoadListener.unsubscribe();

                    // Then give its children the disabled look too
                    for (let i = hierarchyUpdate.index! + 1; i < this.thisArray.length; i++) {
                        if (this.thisArray[i].hierarchyGroupID! <= hierarchyUpdate.hierarchyGroupID!) break;
                        this.thisArray[i].opacity = 0.4;
                    }
                });
            }
        }
    }



    // ===================================================================( TOGGLE SEARCH )=================================================================== \\

    toggleSearch() {
        super.toggleSearch();

        // If we're toggling back to hierarchy mode
        if (!this.searchMode) {
            this.thisArray.forEach(x => {
                const selectedItem = this.selectedHierarchyComponent.listManager.sourceList.find(y => y.id == x.id && y.hierarchyGroupID == 0);



                if (!selectedItem) {

                    if (x.hierarchyGroupID == 0 && x.opacity != null) {
                        x.opacity = null!;

                        const index = this.thisArray.findIndex(y => y.id == x.id && y.hierarchyGroupID == 0);


                        // Remove the disabled look from it's children too (if available)
                        for (let i = index + 1; i < this.thisArray.length; i++) {
                            if (this.thisArray[i].hierarchyGroupID! <= this.thisArray[index].hierarchyGroupID!) break;
                            this.thisArray[i].opacity = null!;
                        }
                    }
                }
            })
        }
    }



    // ============================================================( ON SELECTED HIERARCHY ITEM )============================================================= \\

    onSelectedHierarchyItem(hierarchyUpdate: HierarchyUpdate) {
        super.onSelectedHierarchyItem(hierarchyUpdate);
        this.addToSelectedKeywordsButtonDisabled = hierarchyUpdate.selectedItems![0].opacity != null ? true : false;
    }



    // ===========================================================( ON UNSELECTED HIERARCHY ITEM )============================================================ \\

    onUnselectedHierarchyItem() {
        super.onUnselectedHierarchyItem();
        this.addToSelectedKeywordsButtonDisabled = true;
    }
}