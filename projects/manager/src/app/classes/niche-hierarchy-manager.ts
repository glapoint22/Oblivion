import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { DataService, LazyLoadingService, SpinnerAction } from "common";
import { Subject } from "rxjs";
import { MoveFormComponent } from "../components/move-form/move-form.component";
import { NicheHierarchyService } from "../services/niche-hierarchy/niche-hierarchy.service";
import { ProductService } from "../services/product/product.service";
import { MenuOptionType, SortType } from "./enums";
import { HierarchyItem } from "./hierarchy-item";
import { HierarchyUpdate } from "./hierarchy-update";
import { Item } from "./item";
import { ListItem } from "./list-item";
import { ListUpdateManager } from "./list-update-manager";
import { MultiColumnItem } from "./multi-column-item";
import { MultiColumnListUpdate } from "./multi-column-list-update";
import { Product } from "./product";

export class NicheHierarchyManager extends ListUpdateManager {
    // Private
    private onGrandChildrenLoad: Subject<void> = new Subject<void>();

    // Public
    public isParent!: boolean;
    public moveFormOpen!: boolean;
    public grandChildType: string = 'Product';
    public grandChildSearchType: string = 'Product';
    public grandChildDataServicePath: string = 'Products';


    // ====================================================================( CONSTRUCTOR )==================================================================== \\

    constructor(dataService: DataService, sanitizer: DomSanitizer, private nicheHierarchyService: NicheHierarchyService, private lazyLoadingService: LazyLoadingService, private productService: ProductService) {
        super(dataService, sanitizer);
        this.sortType = SortType.Product;
        this.parentType = 'Niche';
        this.childType = 'Sub Niche';
        this.parentDataServicePath = 'Categories';
        this.childDataServicePath = 'Niches';
        this.parentSearchType = 'Niche';
        this.childSearchType = 'Sub Niche';
        this.searchNameWidth = '295px';
        this.searchTypeWidth = '78px';
        this.listUpdateService = this.nicheHierarchyService;
        this.thisArray = this.nicheHierarchyService.formArray;
        this.otherArray = this.nicheHierarchyService.productArray;
        this.collapseHierarchyOnOpen = false;
        this.selectLastSelectedItemOnOpen = true;
        this.isSecondLevelHierarchyItemParent = true;
        this.isThreeTierHierarchy = true;

        // ---------- HIERARCHY OPTIONS ---------- \\

        this.hierarchyOptions.unselectable = false;
        this.hierarchyOptions.verifyAddEdit = true;
        this.hierarchyOptions.menu!.menuOptions[4] = {
            type: MenuOptionType.Divider
        };
        this.hierarchyOptions.menu!.menuOptions[5] = {
            type: MenuOptionType.MenuItem,
            shortcut: 'Ctrl+M',
            optionFunction: this.openMoveForm
        }

        // ---------- SEARCH OPTIONS ---------- \\

        this.searchOptions.unselectable = false;
        this.searchOptions.verifyAddEdit = true;
        this.searchOptions.menu!.menuOptions[2] = {
            type: MenuOptionType.Divider
        };

        this.searchOptions.menu!.menuOptions[3] = {
            type: MenuOptionType.MenuItem,
            shortcut: 'Ctrl+M',
            optionFunction: this.openMoveForm
        }

        this.searchOptions.menu!.menuOptions[4] = {
            type: MenuOptionType.MenuItem,
            name: 'Go to Hierarchy',
            shortcut: 'Alt+H',
            optionFunction: this.goToHierarchy
        }
    }



    // ==================================================================( ON ARROW CLICK )=================================================================== \\

    onArrowClick(hierarchyUpdate: HierarchyUpdate) {
        super.onArrowClick(hierarchyUpdate);

        // If a child item was expanded and its grand children hasn't been loaded yet
        if (hierarchyUpdate.arrowDown && !hierarchyUpdate.hasChildren) {

            // If the hierarchy item is a second level hierarchy item
            if (hierarchyUpdate.hierarchyGroupID == 1) {

                this.dataService.get<Array<Item>>('api/' + this.grandChildDataServicePath, [{ key: 'parentId', value: hierarchyUpdate.id }])
                    .subscribe((grandChildren: Array<Item>) => {
                        let num = this.hierarchyComponent.listManager.editedItem ? 2 : 1;

                        for (let i = grandChildren.length - 1; i >= 0; i--) {

                            // This Array
                            this.thisArray.splice(hierarchyUpdate.index! + num, 0,
                                {
                                    id: grandChildren[i].id,
                                    name: grandChildren[i].name,
                                    hierarchyGroupID: 2,
                                    hidden: false,
                                }
                            )

                            // Other Array
                            this.otherArray.splice(hierarchyUpdate.index! + 1, 0,
                                {
                                    id: grandChildren[i].id,
                                    name: grandChildren[i].name,
                                    hierarchyGroupID: 2,
                                    hidden: !this.otherArray[hierarchyUpdate.index!].arrowDown,
                                }
                            )
                        }
                        this.onGrandChildrenLoad.next();
                    });
            }
        }
    }



    // ==================================================================( ADD CHILD BELOW )================================================================== \\

    addChildBelow() {
        this.hierarchyComponent.add(null!, true);
    }



    // =====================================================================( ADD CHILD )===================================================================== \\

    addChild() {
        const index = this.hierarchyComponent.listManager.getIndexOfHierarchyItemParent(this.hierarchyComponent.listManager.selectedItem);
        this.hierarchyComponent.add(index, true);
    }



    // ============================================================( ON SELECTED HIERARCHY ITEM )============================================================= \\

    onSelectedHierarchyItem(hierarchyUpdate: HierarchyUpdate) {
        super.onSelectedHierarchyItem(hierarchyUpdate);

        // Only when the top level hierarchy item is selected is when its added child will be a parent
        this.isParent = hierarchyUpdate.selectedItems![0].hierarchyGroupID == 0 ? true : false;

        if (hierarchyUpdate.selectedItems![0].hierarchyGroupID == 0) {
            this.hierarchyOptions.menu!.menuOptions[1].optionFunction = this.addChildBelow;
            this.hierarchyOptions.menu!.menuOptions[5].isDisabled = true;
            this.hierarchyOptions.menu!.menuOptions[5].name = 'Move ' + this.parentType;
        }

        if (hierarchyUpdate.selectedItems![0].hierarchyGroupID == 1) {
            this.addIconButtonTitle = 'Add ' + this.grandChildType;
            this.hierarchyOptions.menu!.menuOptions[0].optionFunction = this.addChild;
            this.hierarchyOptions.menu!.menuOptions[1].hidden = false;
            this.hierarchyOptions.menu!.menuOptions[1].name = 'Add ' + this.grandChildType;
            this.hierarchyOptions.menu!.menuOptions[1].optionFunction = this.add;
            this.hierarchyOptions.menu!.menuOptions[5].isDisabled = false;
            this.hierarchyOptions.menu!.menuOptions[5].name = 'Move ' + this.childType;
        }

        if (hierarchyUpdate.selectedItems![0].hierarchyGroupID == 2) {
            this.addIconButtonTitle = 'Add ' + this.grandChildType;
            this.editIconButtonTitle = 'Rename ' + this.grandChildType;
            this.deleteIconButtonTitle = 'Delete ' + this.grandChildType;
            this.hierarchyOptions.deletePrompt!.title = 'Delete ' + this.grandChildType;
            this.hierarchyOptions.menu!.menuOptions[0].name = 'Add ' + this.grandChildType;
            this.hierarchyOptions.menu!.menuOptions[0].optionFunction = this.add;
            this.hierarchyOptions.menu!.menuOptions[1].hidden = true;
            this.hierarchyOptions.menu!.menuOptions[2].name = 'Rename ' + this.grandChildType;
            this.hierarchyOptions.menu!.menuOptions[3].name = 'Delete ' + this.grandChildType;
            this.hierarchyOptions.menu!.menuOptions[5].isDisabled = false;
            this.hierarchyOptions.menu!.menuOptions[5].name = 'Move ' + this.grandChildType;

            if (!hierarchyUpdate.rightClick) {
                this.dataService.get<Product>('api/' + this.grandChildDataServicePath + '/Product', [{ key: 'productId', value: hierarchyUpdate.selectedItems![0].id }])
                .subscribe((product: Product) => {
                    this.productService.product = product;
                });
            }
        }
    }



    // ==============================================================( ON SELECTED SEARCH ITEM )============================================================== \\

    onSelectedSearchItem(searchUpdate: MultiColumnListUpdate) {
        super.onSelectedSearchItem(searchUpdate);

        if (searchUpdate.selectedMultiColumnItems![0].values[1].name == this.parentSearchType) {
            this.searchOptions.menu!.menuOptions[3].isDisabled = true;
            this.searchOptions.menu!.menuOptions[3].name = 'Move ' + this.parentType;
            this.searchOptions.menu!.menuOptions[4].name = 'Go to ' + this.parentType + ' in Hierarchy';
        }

        if (searchUpdate.selectedMultiColumnItems![0].values[1].name == this.childSearchType) {
            this.searchOptions.menu!.menuOptions[3].isDisabled = false;
            this.searchOptions.menu!.menuOptions[3].name = 'Move ' + this.childType;
            this.searchOptions.menu!.menuOptions[4].name = 'Go to ' + this.childType + ' in Hierarchy';
        }

        if (searchUpdate.selectedMultiColumnItems![0].values[1].name == this.grandChildSearchType) {
            this.editIconButtonTitle = 'Rename ' + this.grandChildType;
            this.deleteIconButtonTitle = 'Delete ' + this.grandChildType;
            this.searchOptions.deletePrompt!.title = 'Delete ' + this.grandChildType;
            this.searchOptions.menu!.menuOptions[0].name = 'Rename ' + this.grandChildType;
            this.searchOptions.menu!.menuOptions[1].name = 'Delete ' + this.grandChildType;
            this.searchOptions.menu!.menuOptions[3].isDisabled = false;
            this.searchOptions.menu!.menuOptions[3].name = 'Move ' + this.grandChildType;
            this.searchOptions.menu!.menuOptions[4].name = 'Go to ' + this.grandChildType + ' in Hierarchy';

            if (!searchUpdate.rightClick) {
                this.dataService.get('api/' + this.grandChildDataServicePath + '/Product', [{ key: 'productId', value: searchUpdate.selectedMultiColumnItems![0].id }]).subscribe(x => console.log(x));
            }
        }
    }



    // ===============================================================( ON HIERARCHY ITEM ADD )=============================================================== \\

    onHierarchyItemAdd(hierarchyUpdate: HierarchyUpdate) {
        // Add grand child hierarchy item
        if (hierarchyUpdate.hierarchyGroupID == 2) {
            const indexOfHierarchyItemParent = this.hierarchyComponent.listManager.getIndexOfHierarchyItemParent(this.thisArray[hierarchyUpdate.index!]);

            this.dataService.post<number>('api/' + this.grandChildDataServicePath, {
                id: this.thisArray[indexOfHierarchyItemParent].id,
                name: hierarchyUpdate.name
            }).subscribe((id: number) => {
                this.thisArray[hierarchyUpdate.index!].id = id;

                // Other array
                this.otherArray.splice(hierarchyUpdate.index!, 0, {
                    id: this.thisArray[hierarchyUpdate.index!].id,
                    hierarchyGroupID: this.thisArray[hierarchyUpdate.index!].hierarchyGroupID,
                    name: this.thisArray[hierarchyUpdate.index!].name,
                    hidden: !this.otherArray[indexOfHierarchyItemParent].arrowDown
                })
            })
        }
        super.onHierarchyItemAdd(hierarchyUpdate);
    }



    // ==============================================================( ON HIERARCHY ITEM EDIT )=============================================================== \\

    onHierarchyItemEdit(hierarchyUpdate: HierarchyUpdate) {
        // Edit grand child hierarchy item
        if (hierarchyUpdate.hierarchyGroupID == 2) {
            this.dataService.put('api/' + this.grandChildDataServicePath, {
                id: hierarchyUpdate.id,
                name: hierarchyUpdate.name
            }).subscribe();
        }

        super.onHierarchyItemEdit(hierarchyUpdate);
    }



    // ================================================================( ON SEARCH ITEM EDIT )================================================================ \\

    onSearchItemEdit(searchUpdate: MultiColumnListUpdate) {
        super.onSearchItemEdit(searchUpdate);

        // Edit grand child search item
        if (searchUpdate.values![1].name == this.grandChildSearchType) {
            this.dataService.put('api/' + this.grandChildDataServicePath, {
                id: searchUpdate.id,
                name: searchUpdate.values![0].name
            }).subscribe();


            // Find the item in the hierarchy list that we just edited in this search list
            const editedSearchItemGrandChild = this.thisArray.find(x => x.id == searchUpdate.id && x.hierarchyGroupID == 2)!;
            // If the item in the hierarchy list was found
            if (editedSearchItemGrandChild) {
                // Then update the name of that item in the hierarchy list to the name of the item we just edited in the search list
                editedSearchItemGrandChild.name = searchUpdate.values![0].name;
                // Now add the item we just edited in search mode to a sort list so that when we go back to hierarchy mode we can then sort the hierarchy list based on the items in that sort list
                this.thisSortList.push(editedSearchItemGrandChild);
            }
            // Update that same item in the other list
            this.setOtherHierarchyEdit<MultiColumnListUpdate>(searchUpdate, 2);
        }
    }



    // =============================================================( ON HIERARCHY ITEM VERIFY )============================================================== \\

    onHierarchyItemVerify(hierarchyUpdate: HierarchyUpdate) {
        super.onHierarchyItemVerify(hierarchyUpdate);

        // If we're verifying a grand child item
        if (hierarchyUpdate.hierarchyGroupID == 2) {
            this.hierarchyComponent.commitAddEdit();
        }
    }



    // ===============================================================( ON SEARCH ITEM VERIFY )=============================================================== \\

    onSearchItemVerify(searchUpdate: MultiColumnListUpdate) {
        super.onSearchItemVerify(searchUpdate);

        // If we're verifying a grand child item
        if (searchUpdate.values![1].name == this.grandChildSearchType) {
            this.searchComponent.commitAddEdit();
        }
    }



    // =====================================================( DELETE PROMPT CHILD WITH CHILDREN MESSAGE )===================================================== \\

    deletePromptChildWithChildrenMessage(childType: string, childName: string, parentType: string, parentName: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(
            'The '
            + childType +
            '<span style="color: #ffba00"> \"' + childName + '\"</span>' +
            ' and its contents will be permanently deleted from the '
            + parentType +
            '<span style="color: #ffba00"> \"'+ parentName + '\"</span>.');
    }


    // ============================================================( ON HIERARCHY DELETE PROMPT )============================================================= \\

    onHierarchyDeletePrompt(deletedItem: HierarchyItem) {
        super.onHierarchyDeletePrompt(deletedItem);

        // If we're deleting a child item
        if (deletedItem.hierarchyGroupID == 1) {
            const childItem = this.thisArray.find(x => x.id == deletedItem.id && x.hierarchyGroupID == 1);
            const indexOfParentItem = this.hierarchyComponent.listManager.getIndexOfHierarchyItemParent(childItem!);
            this.hierarchyOptions.deletePrompt!.message = this.deletePromptChildWithChildrenMessage(this.childType, deletedItem.name!, this.parentType, this.thisArray[indexOfParentItem].name!);
        }

        // If we're deleting a grand child item
        if (deletedItem.hierarchyGroupID == 2) {
            const grandChildItem = this.thisArray.find(x => x.id == deletedItem.id && x.hierarchyGroupID == 2);
            const indexOfChildItem = this.hierarchyComponent.listManager.getIndexOfHierarchyItemParent(grandChildItem!);
            this.hierarchyOptions.deletePrompt!.message = this.deletePromptChildMessage(this.grandChildType, deletedItem.name!, this.childType, this.thisArray[indexOfChildItem].name!);
        }
    }



    // ==============================================================( ON SEARCH DELETE PROMPT )============================================================== \\

    onSearchDeletePrompt(deletedItem: MultiColumnItem) {
        super.onSearchDeletePrompt(deletedItem);

        // If we're deleting a child item with children
        if (deletedItem.values[1].name == this.childSearchType) {

            // Prefill the prompt so if the prompt opens before we get the child name, it won't be an empty prompt
            this.searchOptions.deletePrompt!.message = this.deletePromptChildWithChildrenMessage(this.childType, deletedItem.values[0].name, this.parentType, '');

            this.dataService.get<Item>('api/' + this.childDataServicePath + '/Parent', [{ key: 'childId', value: deletedItem.id }])
                .subscribe((parentItem: Item) => {
                    // If the child name comes back before the propmt is opened
                    if (!this.searchComponent.listManager.prompt) {
                        this.searchOptions.deletePrompt!.message = this.deletePromptChildWithChildrenMessage(this.childType, deletedItem.values[0].name, this.parentType, parentItem.name!);

                        // But if the prompt opens first before the child name comes back
                    } else {
                        this.searchComponent.listManager.prompt.message = this.deletePromptChildWithChildrenMessage(this.childType, deletedItem.values[0].name, this.parentType, parentItem.name!);
                    }
                })
        }


        // If we're deleting a grand child item
        if (deletedItem.values[1].name == this.grandChildSearchType) {

            // Prefill the prompt so if the prompt opens before we get the grand child name, it won't be an empty prompt
            this.searchOptions.deletePrompt!.message = this.deletePromptChildMessage(this.grandChildType, deletedItem.values[0].name, this.childType, '');

            this.dataService.get<Item>('api/' + this.grandChildDataServicePath + '/Parent', [{ key: 'productId', value: deletedItem.id }])
                .subscribe((grandChildItem: Item) => {
                    // If the grand child name comes back before the propmt is opened
                    if (!this.searchComponent.listManager.prompt) {
                        this.searchOptions.deletePrompt!.message = this.deletePromptChildMessage(this.grandChildType, deletedItem.values[0].name, this.childType, grandChildItem.name!);

                        // But if the prompt opens first before the grand child name comes back
                    } else {
                        this.searchComponent.listManager.prompt.message = this.deletePromptChildMessage(this.grandChildType, deletedItem.values[0].name, this.childType, grandChildItem.name!);
                    }
                })
        }
    }



    // =============================================================( ON HIERARCHY ITEM DELETE )============================================================== \\

    onHierarchyItemDelete(deletedItem: HierarchyItem) {
        // If we're deleting a grand child item
        if (deletedItem.hierarchyGroupID == 2) {
            this.dataService.delete('api/' + this.grandChildDataServicePath, {
                id: deletedItem.id
            }).subscribe();
        }
        super.onHierarchyItemDelete(deletedItem);
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
                const itemToBeMovedType = this.hierarchyComponent.listManager.selectedItem.hierarchyGroupID == 1 ? this.childType : this.grandChildType;
                const destinationItemType = this.hierarchyComponent.listManager.selectedItem.hierarchyGroupID == 1 ? this.parentType : this.childType;
                const itemToBeMoved = this.hierarchyComponent.listManager.selectedItem;
                const index = this.hierarchyComponent.listManager.getIndexOfHierarchyItemParent(this.hierarchyComponent.listManager.selectedItem);
                const fromItem = this.thisArray[index];
                const path = this.hierarchyComponent.listManager.selectedItem.hierarchyGroupID == 1 ? 'api/' + this.parentDataServicePath : 'api/' + this.childDataServicePath + '/All';
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
                const destinationItemType = (this.searchComponent.listManager.selectedItem as MultiColumnItem).values[1].name == this.childType ? this.parentType : this.childType;
                const path = (this.searchComponent.listManager.selectedItem as MultiColumnItem).values[1].name == this.childType ? 'api/' + this.parentDataServicePath : 'api/' + this.childDataServicePath + '/All';
                const parentPath = (this.searchComponent.listManager.selectedItem as MultiColumnItem).values[1].name == this.childType ? 'api/' + this.childDataServicePath + '/Parent' : 'api/' + this.grandChildDataServicePath + '/Parent';
                const key = (this.searchComponent.listManager.selectedItem as MultiColumnItem).values[1].name == this.childType ? 'childId' : 'productId';
      
                this.dataService.get<Item>(parentPath, [{ key: key, value: this.searchComponent.listManager.selectedItem.id }])
                  .subscribe((item: Item) => {
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
    
    
        this.dataService.get<Array<ListItem>>(path)
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

        // Go to grand child item
        if ((this.searchComponent.listManager.selectedItem as MultiColumnItem).values[1].name == this.grandChildSearchType) {
            const grandChild: MultiColumnItem = this.searchComponent.listManager.selectedItem as MultiColumnItem;

            // Get the parent of the selected grand child
            this.dataService.get<Item>('api/' + this.grandChildDataServicePath + '/Parent', [{ key: 'productId', value: grandChild.id }])
                .subscribe((child: Item) => {

                    // Then get the parent of the child
                    this.dataService.get<Item>('api/' + this.childDataServicePath + '/Parent', [{ key: 'childId', value: child.id }])
                        .subscribe((parent: Item) => {

                            // Now go to the hierarchy
                            this.searchMode = false;
                            window.setTimeout(() => {
                                this.searchInputSubscription.unsubscribe();
                                this.goToParent(parent.id, child.id, this.goToChild, [child.id, grandChild.id], this.goToGrandChild, [child.id, grandChild.id]);
                            })
                        });
                });
        }
    }



    // ====================================================================( GO TO CHILD )==================================================================== \\

    goToChild(childId: number, grandChildId: number) {
        // Find the child we're looking for in the hierarchy
        const child: HierarchyItem = this.thisArray.find(x => x.hierarchyGroupID == 1 && x.id == childId)!;

        // If the arrow of that child is NOT down
        if (!child.arrowDown) {

            // Check to see if the arrow of that child was ever down and its children have already been loaded
            const grandChild: HierarchyItem = this.thisArray.find(x => x.hierarchyGroupID == 2 && x.id == grandChildId)!;

            // Then set the arrow of that child to be down
            this.hierarchyComponent.listManager.onArrowClick(child);

            // If its children were never loaded
            if (grandChild == null) {

                // Now that the child's arrow is down, wait for its children to load
                let onGrandChildrenLoadListener = this.onGrandChildrenLoad.subscribe(() => {
                    onGrandChildrenLoadListener.unsubscribe();

                    // Find and select the grand child item
                    this.selectItem(grandChildId, 2);
                })

                // But if the children of the child have already been loaded
            } else {

                // Then select the grand child we're looking for
                this.hierarchyComponent.listManager.onItemDown(grandChild);
            }

            // If the arrow of that chlld is already down
        } else {

            // Find and select the grand child item
            this.selectItem(grandChildId, 2);
        }
    }


    
    // =================================================================( GO TO GRAND CHILD )================================================================= \\

    goToGrandChild(childId: number, grandChildId: number) {
        // Find the child we were looking for
        const child: HierarchyItem = this.thisArray.find(x => x.hierarchyGroupID == 1 && x.id == childId)!;

        // Now that we found the child we were looking for, set the arrow of that child to be down
        if (!child.arrowDown) this.hierarchyComponent.listManager.onArrowClick(child);

        // Now that the child's arrow is down, wait for its children to load
        let onGrandChildrenLoadListener = this.onGrandChildrenLoad.subscribe(() => {
            onGrandChildrenLoadListener.unsubscribe();

            // Find and select the grand child item
            this.selectItem(grandChildId, 2);
        })
    }



    // =====================================================================( ON ESCAPE )===================================================================== \\

    onEscape(): void {
        // Prevent escacpe from happening here and let the menu bar component take care of it
    }
}