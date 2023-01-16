import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { DataService, LazyLoadingService, SpinnerAction } from "common";
import { Subject } from "rxjs";
import { MoveFormComponent } from "../components/move-form/move-form.component";
import { ProductService } from "../services/product/product.service";
import { CaseType, ListUpdateType, MenuOptionType } from "./enums";
import { HierarchyItem } from "./hierarchy-item";
import { HierarchyUpdate } from "./hierarchy-update";
import { Item } from "./item";
import { ListItem } from "./list-item";
import { HierarchyUpdateManager } from "./hierarchy-update-manager";
import { MultiColumnItem } from "./multi-column-item";
import { MultiColumnListUpdate } from "./multi-column-list-update";
import { Directive, EventEmitter, Output, ViewChild } from "@angular/core";
import { HierarchyComponent } from "../components/hierarchies/hierarchy/hierarchy.component";
import { MultiColumnListComponent } from "../components/lists/multi-column-list/multi-column-list.component";

@Directive()
export class SideMenuNichesUpdateManager extends HierarchyUpdateManager {
    // Private
    private onGrandchildrenLoad: Subject<void> = new Subject<void>();

    // Public
    public isParent!: boolean;
    public moveFormOpen!: boolean;
    public grandchildType: string = 'Product';
    public grandchildSearchType: string = 'Product';
    public grandchildDataServicePath: string = 'Products';

    // Decorators
    @Output() onProductSelect: EventEmitter<void> = new EventEmitter();
    @ViewChild('hierarchyComponent') listComponent!: HierarchyComponent;
    @ViewChild('searchComponent') searchComponent!: MultiColumnListComponent;


    // ====================================================================( CONSTRUCTOR )==================================================================== \\

    constructor(dataService: DataService, sanitizer: DomSanitizer, productService: ProductService, private lazyLoadingService: LazyLoadingService) {
        super(dataService, sanitizer, productService);
    }



    // ====================================================================( NG ON INIT )===================================================================== \\

    ngOnInit() {
        super.ngOnInit()
        this.itemType = 'Niche';
        this.childType = 'Subniche';
        this.dataServicePath = 'Niches';
        this.childDataServicePath = 'Subniches';
        this.parentSearchType = 'Niche';
        this.childSearchType = 'Subniche';
        this.searchNameWidth = '295px';
        this.searchTypeWidth = '78px';
        this.collapseHierarchyOnOpen = false;
        this.selectLastSelectedItemOnOpen = true;
        this.searchInputName = 'nicheHierarchySearchInput';
        this.thisArray = this.productService.sideMenuNicheArray;

        // ---------- HIERARCHY OPTIONS ---------- \\

        this.listOptions.unselectable = false;
        this.listOptions.verifyAddEdit = true;
        this.listOptions.menu!.menuOptions[6] = {
            type: MenuOptionType.Divider
        };

        this.listOptions.menu!.menuOptions[7] = {
            type: MenuOptionType.MenuItem,
            shortcut: 'Ctrl+M',
            optionFunction: this.openMoveForm
        }

        // ---------- SEARCH OPTIONS ---------- \\

        this.searchOptions.unselectable = false;
        this.searchOptions.verifyAddEdit = true;
        this.searchOptions.menu!.menuOptions[4] = {
            type: MenuOptionType.Divider
        };

        this.searchOptions.menu!.menuOptions[5] = {
            type: MenuOptionType.MenuItem,
            shortcut: 'Ctrl+M',
            optionFunction: this.openMoveForm
        }
    }



    // =======================================================================( ADD )========================================================================= \\

    add() {
        this.listComponent.add(null!, this.isParent);
        this.addIconButtonTitle = 'Add';
        this.editIconButtonTitle = 'Rename';
        this.deleteIconButtonTitle = 'Delete';
    }



    // ==================================================================( ON ARROW CLICK )=================================================================== \\

    onArrowClick(hierarchyUpdate: HierarchyUpdate) {
        super.onArrowClick(hierarchyUpdate);

        // If a child item was expanded and its grandchildren hasn't been loaded yet
        if (hierarchyUpdate.arrowDown && !hierarchyUpdate.hasChildren) {

            // If the hierarchy item is a second level hierarchy item
            if (hierarchyUpdate.hierarchyGroupID == 1) {
                this.dataService.get<Array<Item>>('api/' + this.grandchildDataServicePath, [{ key: 'parentId', value: hierarchyUpdate.id }], {
                    authorization: true
                })
                    .subscribe((grandchildren: Array<Item>) => {
                        window.setTimeout(() => {
                            let num = this.listComponent.listManager.editedItem ? 2 : 1;
                            for (let i = grandchildren.length - 1; i >= 0; i--) {
                                this.thisArray.splice(hierarchyUpdate.index! + num, 0, this.getGrandchildItem(grandchildren[i]));
                            }
                            this.onGrandchildrenLoad.next();
                        })
                    });
            }
        }
    }



    // ==================================================================( ADD CHILD BELOW )================================================================== \\

    addChildBelow() {
        this.listComponent.add(null!, true);
    }



    // =====================================================================( ADD CHILD )===================================================================== \\

    addChild() {
        const index = this.listComponent.listManager.getIndexOfHierarchyItemParent(this.listComponent.listManager.selectedItem);
        this.listComponent.add(index, true);
    }



    // ==================================================================( ON LIST UPDATE )=================================================================== \\

    onListUpdate(hierarchyUpdate: HierarchyUpdate) {
        super.onListUpdate(hierarchyUpdate);
        if (hierarchyUpdate.type == ListUpdateType.CaseTypeUpdate) this.thisArray[hierarchyUpdate.index!].case = CaseType.TitleCase;
    }



    // =================================================================( ON SELECTED ITEM )================================================================== \\

    onSelectedItem(hierarchyUpdate: HierarchyUpdate) {
        super.onSelectedItem(hierarchyUpdate);

        // Only when the top level hierarchy item is selected is when its added child will be a parent
        this.isParent = hierarchyUpdate.selectedItems![0].hierarchyGroupID == 0 ? true : false;

        if (hierarchyUpdate.selectedItems![0].hierarchyGroupID == 0) {
            this.listOptions.menu!.menuOptions[1].optionFunction = this.addChildBelow;
            this.listOptions.menu!.menuOptions[7].isDisabled = true;
            this.listOptions.menu!.menuOptions[7].name = 'Move ' + this.itemType;



            this.listOptions.menu!.menuOptions[1].hidden = false;
            this.listOptions.menu!.menuOptions[2].hidden = false;
            this.listOptions.menu!.menuOptions[4].hidden = true;
        }

        if (hierarchyUpdate.selectedItems![0].hierarchyGroupID == 1) {
            this.addIconButtonTitle = 'Add ' + this.grandchildType;
            this.listOptions.menu!.menuOptions[0].optionFunction = this.addChild;
            this.listOptions.menu!.menuOptions[1].hidden = false;
            this.listOptions.menu!.menuOptions[1].name = 'Add ' + this.grandchildType;
            this.listOptions.menu!.menuOptions[1].optionFunction = this.add;
            this.listOptions.menu!.menuOptions[2].hidden = false;
            this.listOptions.menu!.menuOptions[4].hidden = true;
            this.listOptions.menu!.menuOptions[7].isDisabled = false;
            this.listOptions.menu!.menuOptions[7].name = 'Move ' + this.childType;
        }

        if (hierarchyUpdate.selectedItems![0].hierarchyGroupID == 2) {
            this.addIconButtonTitle = 'Add ' + this.grandchildType;
            this.editIconButtonTitle = 'Rename ' + this.grandchildType;
            this.deleteIconButtonTitle = 'Delete ' + this.grandchildType;
            this.listOptions.deletePrompt!.title = 'Delete ' + this.grandchildType;
            this.listOptions.menu!.menuOptions[0].name = 'Add ' + this.grandchildType;
            this.listOptions.menu!.menuOptions[0].optionFunction = this.add;
            this.listOptions.menu!.menuOptions[1].hidden = true;
            this.listOptions.menu!.menuOptions[2].hidden = true;
            this.listOptions.menu!.menuOptions[3].name = 'Rename ' + this.grandchildType;
            this.listOptions.menu!.menuOptions[4].hidden = true;
            this.listOptions.menu!.menuOptions[5].name = 'Delete ' + this.grandchildType;
            this.listOptions.menu!.menuOptions[7].isDisabled = false;
            this.listOptions.menu!.menuOptions[7].name = 'Move ' + this.grandchildType;

            // As long as we're not right-clicking on the list item
            if (!hierarchyUpdate.rightClick) {
                // See if the product we just selected in the list has already been opened
                const openedProduct = this.productService.products.find(x => x.product.id == hierarchyUpdate.selectedItems![0].id);

                // If the product we just selected in the list has (NOT) yet been opened
                // Or if the product has already been opened, but its tab is (NOT) currently selected
                if (!openedProduct || (openedProduct && openedProduct.zIndex != this.productService.zIndex)) {
                    // This is an output that notifies the (Niches Side Menu) that it can close
                    this.onProductSelect.emit();
                    // Open the product
                    this.productService.openProduct(hierarchyUpdate.selectedItems![0].id!);
                }
            }
        }
    }



    // ==============================================================( ON SELECTED SEARCH ITEM )============================================================== \\

    onSelectedSearchItem(searchUpdate: MultiColumnListUpdate) {
        super.onSelectedSearchItem(searchUpdate);

        if ((searchUpdate.selectedItems![0] as MultiColumnItem).values[1].name == this.parentSearchType) {
            this.searchOptions.menu!.menuOptions[3].name = 'Go to ' + this.itemType + ' in Hierarchy';
            this.searchOptions.menu!.menuOptions[5].isDisabled = true;
            this.searchOptions.menu!.menuOptions[5].name = 'Move ' + this.itemType;
        }

        if ((searchUpdate.selectedItems![0] as MultiColumnItem).values[1].name == this.childSearchType) {
            this.searchOptions.menu!.menuOptions[3].name = 'Go to ' + this.childType + ' in Hierarchy';
            this.searchOptions.menu!.menuOptions[5].isDisabled = false;
            this.searchOptions.menu!.menuOptions[5].name = 'Move ' + this.childType;
        }

        if ((searchUpdate.selectedItems![0] as MultiColumnItem).values[1].name == this.grandchildSearchType) {
            this.editIconButtonTitle = 'Rename ' + this.grandchildType;
            this.deleteIconButtonTitle = 'Delete ' + this.grandchildType;
            this.searchOptions.deletePrompt!.title = 'Delete ' + this.grandchildType;
            this.searchOptions.menu!.menuOptions[0].name = 'Rename ' + this.grandchildType;
            this.searchOptions.menu!.menuOptions[1].name = 'Delete ' + this.grandchildType;
            this.searchOptions.menu!.menuOptions[3].name = 'Go to ' + this.grandchildType + ' in Hierarchy';
            this.searchOptions.menu!.menuOptions[5].isDisabled = false;
            this.searchOptions.menu!.menuOptions[5].name = 'Move ' + this.grandchildType;

            // As long as we're not right-clicking on the list item
            if (!searchUpdate.rightClick) {
                // See if the product we just selected in the list has already been opened
                const openedProduct = this.productService.products.find(x => x.product.id == searchUpdate.selectedItems![0].id);

                // If the product we just selected in the list has (NOT) yet been opened
                // Or if the product has already been opened, but its tab is (NOT) currently selected
                if (!openedProduct || (openedProduct && openedProduct.zIndex != this.productService.zIndex)) {
                    // This is an output that notifies the (Niches Side Menu) that it can close
                    this.onProductSelect.emit();
                    // Open the product
                    this.productService.goToProduct(searchUpdate.selectedItems![0].id!);
                }
            }
        }
    }



    // ====================================================================( ON ITEM ADD )==================================================================== \\
    onItemAdd(hierarchyUpdate: HierarchyUpdate) {
        // Add grandchild hierarchy item
        if (hierarchyUpdate.hierarchyGroupID == 2) {
            const indexOfHierarchyItemParent = this.productService.getIndexOfHierarchyItemParent(this.thisArray[hierarchyUpdate.index!], this.thisArray);

            this.dataService.post<number>('api/' + this.grandchildDataServicePath, {
                id: this.thisArray[indexOfHierarchyItemParent].id,
                name: hierarchyUpdate.name
            }, {
                authorization: true
            }).subscribe((id: number) => {
                this.thisArray[hierarchyUpdate.index!].id = id;
            })
        }
        super.onItemAdd(hierarchyUpdate);
    }



    // ===================================================================( ON ITEM EDIT )==================================================================== \\

    onItemEdit(hierarchyUpdate: HierarchyUpdate) {
        // Edit grandchild hierarchy item
        if (hierarchyUpdate.hierarchyGroupID == 2) {
            // Check to see if a tab happens to be open for this product that's being edited
            const product = this.productService.products.find(x => x.product.id == hierarchyUpdate.id);
            //If a tab is open for this product that's being edited
            if (product) {
                // Update the name of the product (name on the tab and name on the form)
                product!.product.name = hierarchyUpdate.name!
                this.onProductSelect.emit();
            }


            // ********* Commented Out Data Service *********
            this.dataService.put('api/' + this.grandchildDataServicePath, {
                id: hierarchyUpdate.id,
                name: hierarchyUpdate.name
            }, {
                authorization: true
            }).subscribe();
        }
        super.onItemEdit(hierarchyUpdate);
    }



    // =========================================================( DELETE PROMPT GRANDCHILD MESSAGE )========================================================== \\

    deletePromptGrandchildMessage(childType: string, childName: string, itemType: string, parentName: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(
            'The '
            + childType +
            '<span style="color: #ffba00"> \"' + childName + '\"</span>' +
            ' and its contents will be permanently deleted from the '
            + itemType +
            '<span style="color: #ffba00"> \"' + parentName + '\"</span>.');
    }



    // =================================================================( ON DELETE PROMPT )================================================================== \\

    onDeletePrompt(deletedItem: HierarchyItem) {
        if (deletedItem.hierarchyGroupID == 0) super.onDeletePrompt(deletedItem);

        // If we're deleting a child item
        if (deletedItem.hierarchyGroupID == 1) {
            const childItem = this.thisArray.find(x => x.id == deletedItem.id && x.hierarchyGroupID == 1);
            const indexOfParentItem = this.productService.getIndexOfHierarchyItemParent(childItem!, this.thisArray);
            this.listOptions.deletePrompt!.message = this.deletePromptGrandchildMessage(this.childType, deletedItem.name!, this.itemType, this.thisArray[indexOfParentItem].name!);
        }

        // If we're deleting a grandchild item
        if (deletedItem.hierarchyGroupID == 2) {
            const grandchildItem = this.thisArray.find(x => x.id == deletedItem.id && x.hierarchyGroupID == 2);
            const indexOfChildItem = this.productService.getIndexOfHierarchyItemParent(grandchildItem!, this.thisArray);
            this.listOptions.deletePrompt!.message = this.deletePromptChildMessage(this.grandchildType, deletedItem.name!, this.childType, this.thisArray[indexOfChildItem].name!);
        }
    }



    // ==============================================================( ON SEARCH DELETE PROMPT )============================================================== \\

    onSearchDeletePrompt(deletedItem: MultiColumnItem) {
        if (deletedItem.values[1].name == this.parentSearchType) super.onSearchDeletePrompt(deletedItem);

        // If we're deleting a child item with children
        if (deletedItem.values[1].name == this.childSearchType) {

            // Prefill the prompt so if the prompt opens before we get the child name, it won't be an empty prompt
            this.searchOptions.deletePrompt!.message = this.deletePromptGrandchildMessage(this.childType, deletedItem.values[0].name, this.itemType, '');

            this.dataService.get<Item>('api/' + this.childDataServicePath + '/Parent', [{ key: 'childId', value: deletedItem.id }],
                {
                    authorization: true
                })
                .subscribe((parentItem: Item) => {
                    // If the child name comes back before the propmt is opened
                    if (!this.searchComponent.listManager.prompt) {
                        this.searchOptions.deletePrompt!.message = this.deletePromptGrandchildMessage(this.childType, deletedItem.values[0].name, this.itemType, parentItem.name!);

                        // But if the prompt opens first before the child name comes back
                    } else {
                        this.searchComponent.listManager.prompt.message = this.deletePromptGrandchildMessage(this.childType, deletedItem.values[0].name, this.itemType, parentItem.name!);
                    }
                })
        }


        // If we're deleting a grandchild item
        if (deletedItem.values[1].name == this.grandchildSearchType) {

            // Prefill the prompt so if the prompt opens before we get the grandchild name, it won't be an empty prompt
            this.searchOptions.deletePrompt!.message = this.deletePromptChildMessage(this.grandchildType, deletedItem.values[0].name, this.childType, '');

            this.dataService.get<Item>('api/' + this.grandchildDataServicePath + '/Parent', [{ key: 'productId', value: deletedItem.id }], {
                authorization: true
            })
                .subscribe((grandchildItem: Item) => {
                    // If the grandchild name comes back before the propmt is opened
                    if (!this.searchComponent.listManager.prompt) {
                        this.searchOptions.deletePrompt!.message = this.deletePromptChildMessage(this.grandchildType, deletedItem.values[0].name, this.childType, grandchildItem.name!);

                        // But if the prompt opens first before the grandchild name comes back
                    } else {
                        this.searchComponent.listManager.prompt.message = this.deletePromptChildMessage(this.grandchildType, deletedItem.values[0].name, this.childType, grandchildItem.name!);
                    }
                })
        }
    }



    // ==================================================================( ON ITEM DELETE )=================================================================== \\

    onItemDelete(hierarchyUpdate: HierarchyUpdate) {
        // If we're deleting a grandchild item
        if (hierarchyUpdate.deletedItems![0].hierarchyGroupID == 2) {
            this.dataService.delete('api/' + this.grandchildDataServicePath, this.getDeletedItemParameters(hierarchyUpdate.deletedItems![0]), {
                authorization: true
            }).subscribe();
        }
        super.onItemDelete(hierarchyUpdate);
    }



    // ===============================================================( ON SEARCH ITEM DELETE )=============================================================== \\

    onSearchItemDelete(searchUpdate: MultiColumnListUpdate) {
        // If we're deleting a child item
        if ((searchUpdate.deletedItems![0] as MultiColumnItem).values[1].name == this.childSearchType) {
            this.deleteChildren(this.thisSearchArray, (searchUpdate.deletedItems![0] as MultiColumnItem));
        }

        // If we're deleting a grandchild item
        if ((searchUpdate.deletedItems![0] as MultiColumnItem).values[1].name == this.grandchildSearchType) {
            this.dataService.delete('api/' + this.grandchildDataServicePath, this.getDeletedItemParameters(searchUpdate.deletedItems![0]), {
                authorization: true
            }).subscribe();
            this.updateOtherItems(searchUpdate);
        }
        super.onSearchItemDelete(searchUpdate);
    }



    // ==============================================================( FIND DELETED ITEM INDEX )============================================================== \\

    findDeletedItemIndex(otherArrayDeletedItem: ListItem, fromArrayDeletedItem: ListItem) {
        return otherArrayDeletedItem.id == fromArrayDeletedItem.id
            && otherArrayDeletedItem.name == (fromArrayDeletedItem as MultiColumnItem).values[0].name
            && otherArrayDeletedItem.hierarchyGroupID == ((fromArrayDeletedItem as MultiColumnItem).values![1].name == this.parentSearchType ? 0 : (fromArrayDeletedItem as MultiColumnItem).values![1].name == this.grandchildSearchType ? 2 : 1);
    }



    // ==================================================================( DELETE CHILDREN )================================================================== \\

    deleteChildren(searchList: Array<MultiColumnItem>, deletedItem: MultiColumnItem) {

        // If the item that is being deleted is a niche
        if (deletedItem.values[1].name == this.parentSearchType) {
            this.dataService.get<Array<MultiColumnItem>>('api/' + this.dataServicePath + '/Children', [{ key: 'parentId', value: deletedItem.id }], {
                authorization: true
            })
                .subscribe((children: Array<MultiColumnItem>) => {
                    children.forEach(x => {

                        // Check to see if any of the children of the parent item is present in the search list. If so, delete them
                        const searchChildIndex = searchList.findIndex(y => y.id == x.id && (y as MultiColumnItem).values[0].name == x.name && (y as MultiColumnItem).values[1].name == this.childSearchType);
                        if (searchChildIndex != -1) searchList.splice(searchChildIndex, 1);

                        // Also check to see if any of the grandchildren of the parent item is present in the search list. If so, delete them too
                        const searchGrandchildIndex = searchList.findIndex(y => y.id == x.id && (y as MultiColumnItem).values[0].name == x.name && (y as MultiColumnItem).values[1].name == this.grandchildSearchType);
                        if (searchGrandchildIndex != -1) searchList.splice(searchGrandchildIndex, 1);
                    })
                })
        }

        // If the item that is being deleted is a subniche
        if (deletedItem.values[1].name == this.childSearchType) {
            this.dataService.get<Array<MultiColumnItem>>('api/Products', [{ key: 'parentId', value: deletedItem.id }], {
                authorization: true
            })
                .subscribe((children: Array<MultiColumnItem>) => {
                    children.forEach(x => {

                        // Check to see if any of the children of the parent item is present in the search list. If so, delete them
                        const searchChildIndex = searchList.findIndex(y => y.id == x.id && (y as MultiColumnItem).values[0].name == x.name && (y as MultiColumnItem).values[1].name == this.grandchildSearchType);
                        if (searchChildIndex != -1) searchList.splice(searchChildIndex, 1);
                    })
                })
        }
    }



    // ================================================================( ON SEARCH ITEM EDIT )================================================================ \\

    onSearchItemEdit(searchUpdate: MultiColumnListUpdate) {
        super.onSearchItemEdit(searchUpdate);

        // Edit grandchild search item
        if (searchUpdate.values![1].name == this.grandchildSearchType) {
            this.dataService.put('api/' + this.grandchildDataServicePath, {
                id: searchUpdate.id,
                name: searchUpdate.values![0].name
            }, {
                authorization: true
            }).subscribe();
            // this.sort(this.OldEditItem(this.thisArray, searchUpdate, 2), this.thisArray);
        }
    }



    // ==================================================================( ON ITEM VERIFY )=================================================================== \\

    onItemVerify(hierarchyUpdate: HierarchyUpdate) {
        super.onItemVerify(hierarchyUpdate);

        // If we're verifying a grandchild item
        if (hierarchyUpdate.hierarchyGroupID == 2) {
            this.listComponent.commitAddEdit();
        }
    }



    // ===============================================================( ON SEARCH ITEM VERIFY )=============================================================== \\

    onSearchItemVerify(searchUpdate: MultiColumnListUpdate) {
        super.onSearchItemVerify(searchUpdate);

        // If we're verifying a grandchild item
        if (searchUpdate.values![1].name == this.grandchildSearchType) {
            this.searchComponent.commitAddEdit();
        }
    }



    // ==================================================================( OPEN MOVE FORM )=================================================================== \\

    async openMoveForm() {
        this.lazyLoadingService.load(async () => {
            const { MoveFormComponent } = await import('../components/move-form/move-form.component');
            const { MoveFormModule } = await import('../components/move-form/move-form.module');

            return { component: MoveFormComponent, module: MoveFormModule }
        }, SpinnerAction.None)
            .then((moveForm: MoveFormComponent) => {

                // If we're in hierarchy view
                if (!this.searchMode) {
                    const itemToBeMovedType = this.listComponent.listManager.selectedItem.hierarchyGroupID == 1 ? this.childType : this.grandchildType;
                    const destinationItemType = this.listComponent.listManager.selectedItem.hierarchyGroupID == 1 ? this.itemType : this.childType;
                    const itemToBeMoved = this.listComponent.listManager.selectedItem;
                    const index = this.productService.getIndexOfHierarchyItemParent(this.listComponent.listManager.selectedItem, this.thisArray);
                    const fromItem = this.thisArray[index];
                    const path = this.listComponent.listManager.selectedItem.hierarchyGroupID == 1 ? 'api/' + this.dataServicePath : 'api/' + this.childDataServicePath + '/All';
                    this.setMoveForm(moveForm, itemToBeMovedType, destinationItemType, itemToBeMoved, fromItem, path);

                    // If we're in search view
                } else {

                    // Check to see if the item-to-be-moved is visible on the niche hierarchy
                    let itemToBeMoved = this.thisArray.find(x =>
                        x.id == this.searchComponent.listManager.selectedItem.id &&
                        x.name == (this.searchComponent.listManager.selectedItem as MultiColumnItem).values[0].name &&
                        x.hierarchyGroupID == ((this.searchComponent.listManager.selectedItem as MultiColumnItem).values[1].name == this.childType ? 1 : 2));

                    // If the item-to-be-moved was not found 
                    // (This would be because the item-to-be-moved is not visible on the niche hierarchy)
                    if (!itemToBeMoved) itemToBeMoved = {
                        // Then create the item-to-be-moved
                        id: this.searchComponent.listManager.selectedItem.id,
                        name: (this.searchComponent.listManager.selectedItem as MultiColumnItem).values[0].name,
                        hierarchyGroupID: (this.searchComponent.listManager.selectedItem as MultiColumnItem).values[1].name == this.childType ? 1 : 2,
                        isParent: (this.searchComponent.listManager.selectedItem as MultiColumnItem).values[1].name == this.childType ? true : false
                    }

                    const itemToBeMovedType = (this.searchComponent.listManager.selectedItem as MultiColumnItem).values[1].name;
                    const destinationItemType = (this.searchComponent.listManager.selectedItem as MultiColumnItem).values[1].name == this.childType ? this.itemType : this.childType;
                    const path = (this.searchComponent.listManager.selectedItem as MultiColumnItem).values[1].name == this.childType ? 'api/' + this.dataServicePath : 'api/' + this.childDataServicePath + '/All';
                    const parentPath = (this.searchComponent.listManager.selectedItem as MultiColumnItem).values[1].name == this.childType ? 'api/' + this.childDataServicePath + '/Parent' : 'api/' + this.grandchildDataServicePath + '/Parent';
                    const key = (this.searchComponent.listManager.selectedItem as MultiColumnItem).values[1].name == this.childType ? 'childId' : 'productId';

                    this.dataService.get<Item>(parentPath, [{ key: key, value: this.searchComponent.listManager.selectedItem.id }], {
                        authorization: true
                    }).subscribe((item: Item) => {
                            const fromItem: HierarchyItem = { id: item.id, name: item.name };
                            this.setMoveForm(moveForm, itemToBeMovedType, destinationItemType, itemToBeMoved!, fromItem, path);
                        });
                }
            });
    }


    // ===================================================================( SET MOVE FORM )=================================================================== \\

    setMoveForm(moveForm: MoveFormComponent, itemToBeMovedType: string, destinationItemType: string, itemToBeMoved: HierarchyItem, fromItem: HierarchyItem, path: string) {
        this.moveFormOpen = true;
        moveForm.itemToBeMoved = itemToBeMoved;
        moveForm.fromItem = fromItem;
        moveForm.destinationItemType = destinationItemType;
        moveForm.itemToBeMovedType = itemToBeMovedType;
        moveForm.nicheHierarchy = this.thisArray;

        moveForm.isOpen.subscribe((moveFormOpen: boolean) => {
            window.setTimeout(() => {
                this.moveFormOpen = moveFormOpen;
            })
        })


        this.dataService.get<Array<ListItem>>(path, undefined, {authorization: true})
            .subscribe((results: Array<ListItem>) => {
                results.forEach(x => {
                    if (x.name != fromItem.name) {
                        moveForm.destinationList.push({
                            id: x.id,
                            name: x.name
                        })
                    }
                })
            });
    }



    // ==================================================================( GO TO HIERARCHY )================================================================== \\

    goToHierarchy() {
        super.goToHierarchy();

        // Go to grandchild item
        if ((this.searchComponent.listManager.selectedItem as MultiColumnItem).values[1].name == this.grandchildSearchType) {
            const grandchild: MultiColumnItem = this.searchComponent.listManager.selectedItem as MultiColumnItem;

            const onProductSelectListener = this.productService.onProductSelect.subscribe(() => {
                onProductSelectListener.unsubscribe();

                const selectedItem = this.thisArray.filter(x => x.selectType != null || x.selected == true)[0];
                // If an item was selected
                if (selectedItem) {
                    this.searchMode = false;

                    window.setTimeout(() => {
                        // Then select that item
                        this.listComponent.listManager.setItemSelection(selectedItem);
                        this.listComponent.listManager.setButtonsState();
                    })
                }
            });
            this.productService.goToProduct(grandchild.id!);
        }
    }



    // ======================================================================( GET ITEM )====================================================================== \\

    getItem(x: HierarchyItem) {
        return {
            id: x.id,
            name: x.name,
            hierarchyGroupID: 0,
            hidden: false,
            arrowDown: false,
            case: CaseType.TitleCase
        }
    }



    // ===================================================================( GET CHILD ITEM )=================================================================== \\

    getChildItem(child: Item) {
        return {
            id: child.id,
            name: child.name,
            hierarchyGroupID: 1,
            hidden: false,
            arrowDown: false,
            isParent: true,
            case: CaseType.TitleCase
        }
    }



    // ================================================================( GET GRANDCHILD ITEM )================================================================= \\

    getGrandchildItem(grandchild: Item) {
        return {
            id: grandchild.id,
            name: grandchild.name,
            hierarchyGroupID: 2,
            hidden: false,
            case: CaseType.TitleCase
        }
    }
}