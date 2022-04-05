import { Component, ViewChild } from '@angular/core';
import { DataService, LazyLoad, LazyLoadingService, SpinnerAction } from 'common';
import { Subject } from 'rxjs';
import { ListUpdateType, MenuOptionType } from '../../classes/enums';
import { HierarchyItem } from '../../classes/hierarchy-item';
import { ListItem } from '../../classes/list-item';
import { ListOptions } from '../../classes/list-options';
import { ListUpdate } from '../../classes/list-update';
import { MoveFormComponent } from '../../components/move-form/move-form.component';
import { NicheHierarchyService } from '../../services/niche-hierarchy/niche-hierarchy.service';
import { HierarchyComponent } from '../hierarchies/hierarchy/hierarchy.component';

@Component({
  selector: 'niche-hierarchy',
  templateUrl: './niche-hierarchy.component.html',
  styleUrls: ['./niche-hierarchy.component.scss']
})
export class NicheHierarchyComponent extends LazyLoad {
  // Private
  private _hierarchyUpdate: ListUpdate = new ListUpdate();

  // Public
  public isParent!: boolean;
  public showSearch!: boolean;
  public moveFormOpen!: boolean;
  public hierarchyOptions: ListOptions = new ListOptions();
  public overNicheHierarchy: Subject<boolean> = new Subject<boolean>();
  public get hierarchyUpdate(): ListUpdate { return this._hierarchyUpdate; }
  public set hierarchyUpdate(hierarchyUpdate: ListUpdate) { this.onHierarchyUpdate(hierarchyUpdate); }

  // Decorators
  @ViewChild('hierarchy') hierarchy!: HierarchyComponent;

  constructor(lazyLoadingService: LazyLoadingService,
    private dataService: DataService,
    public nicheHierarchyService: NicheHierarchyService) {
    super(lazyLoadingService);
  }


  ngAfterViewInit() {
    super.ngAfterViewInit();

    this.hierarchyOptions = {
      editable: true,
      unselectable: false,
      multiselectable: false,
      deletePrompt: {
        parentObj: this.hierarchy,
        title: 'Delete',
        primaryButton: {
          name: 'Delete',
          buttonFunction: this.hierarchy.delete
        },
        secondaryButton: {
          name: 'Cancel'
        }
      },
      menu: {
        parentObj: this,
        menuOptions: [
          {
            type: MenuOptionType.MenuItem
          },
          {
            type: MenuOptionType.MenuItem
          },
          {
            type: MenuOptionType.MenuItem,
            name: 'Edit',
            shortcut: 'Ctrl+Alt+E',
            optionFunction: this.onEditFromMenu
          },
          {
            type: MenuOptionType.MenuItem,
            name: 'Delete',
            shortcut: 'Delete',
            optionFunction: this.onDeleteFromMenu
          },
          {
            type: MenuOptionType.Divider
          },
          {
            type: MenuOptionType.MenuItem,
            name: 'Move',
            shortcut: 'Ctrl+M',
            optionFunction: this.onMove
          }
        ]
      }
    }
  }


  onOpen() {
    if (this.nicheHierarchyService.niches.length == 0) {
      this.dataService.get<Array<HierarchyItem>>('api/Categories').subscribe((hierarchyItems: Array<HierarchyItem>) => {
        hierarchyItems.forEach(x => {
          this.nicheHierarchyService.niches.push({
            id: x.id,
            name: x.name,
            hierarchyGroupID: 0,
            hidden: false,
            arrowDown: false
          })
        })
      });
    }else {
      
      const selectedItem = this.nicheHierarchyService.niches.filter(x => x.selected)[0];
      if(selectedItem) {
        this.hierarchy.listManager.onItemDown(selectedItem);
      }
    }
  }


  toggleSearch() {
    this.showSearch = !this.showSearch;

    window.setTimeout(() => {
      document.getElementById('searchInput')?.focus();
    })
  }


  onHierarchyUpdate(hierarchyUpdate: ListUpdate) {
    this._hierarchyUpdate = hierarchyUpdate;
    if (hierarchyUpdate.type == ListUpdateType.Add) this.onAdd(hierarchyUpdate);
    if (hierarchyUpdate.type == ListUpdateType.Edit) this.onEdit(hierarchyUpdate);
    if (hierarchyUpdate.type == ListUpdateType.Delete) this.onDelete(hierarchyUpdate.deletedItems![0]);
    if (hierarchyUpdate.type == ListUpdateType.SelectedItems) this.onSelectedItem(hierarchyUpdate);
    if (hierarchyUpdate.type == ListUpdateType.ArrowClicked) this.onArrowClick(hierarchyUpdate);
    if (hierarchyUpdate.type == ListUpdateType.DeletePrompt) this.onDeletePromptOpen(hierarchyUpdate.deletedItems![0]);
    this.hierarchyOptions.menu!.menuOptions[0].isDisabled = hierarchyUpdate.editDisabled;
  }

  onAdd(hierarchyUpdate: ListUpdate) {

    if (hierarchyUpdate.hierarchyGroupID == 0) {
      this.dataService.post<number>('api/Categories', {
        name: hierarchyUpdate.name
      }).subscribe((id: number) => {
        this.hierarchy.sourceList[hierarchyUpdate.index!].id = id;
      });
    }


    if (hierarchyUpdate.hierarchyGroupID == 1) {
      this.dataService.post<number>('api/Niches', {
        id: this.hierarchy.sourceList[this.hierarchy.listManager.getIndexOfHierarchyItemParent(this.hierarchy.sourceList[hierarchyUpdate.index!])].id,
        name: hierarchyUpdate.name
      }).subscribe((id: number) => {
        this.hierarchy.sourceList[hierarchyUpdate.index!].id = id;
      });
    }


    if (hierarchyUpdate.hierarchyGroupID == 2) {
      this.dataService.post<number>('api/Products', {
        id: this.hierarchy.sourceList[this.hierarchy.listManager.getIndexOfHierarchyItemParent(this.hierarchy.sourceList[hierarchyUpdate.index!])].id,
        name: hierarchyUpdate.name
      }).subscribe((id: number) => {
        this.hierarchy.sourceList[hierarchyUpdate.index!].id = id;
      });
    }
  }


  onEdit(hierarchyUpdate: ListUpdate) {
    if (hierarchyUpdate.hierarchyGroupID == 0) {
      this.dataService.put('api/Categories', {
        id: hierarchyUpdate.id,
        name: hierarchyUpdate.name
      }).subscribe();
    }


    if (hierarchyUpdate.hierarchyGroupID == 1) {
      this.dataService.put('api/Niches', {
        id: hierarchyUpdate.id,
        name: hierarchyUpdate.name
      }).subscribe();
    }


    if (hierarchyUpdate.hierarchyGroupID == 2) {
      this.dataService.put('api/Products', {
        id: hierarchyUpdate.id,
        name: hierarchyUpdate.name
      }).subscribe();
    }
  }


  onDelete(deletedItem: HierarchyItem) {
    if (deletedItem.hierarchyGroupID == 0) {
      this.dataService.delete('api/Categories', {
        id: deletedItem.id
      }).subscribe();
    }


    if (deletedItem.hierarchyGroupID == 1) {
      this.dataService.delete('api/Niches', {
        id: deletedItem.id
      }).subscribe();
    }


    if (deletedItem.hierarchyGroupID == 2) {
      this.dataService.delete('api/Products', {
        id: deletedItem.id
      }).subscribe();
    }
  }


  onSelectedItem(hierarchyUpdate: ListUpdate) {
    this.isParent = hierarchyUpdate.selectedItems![0].hierarchyGroupID == 1 || hierarchyUpdate.selectedItems![0].hierarchyGroupID == 2 ? false : true;

    if (hierarchyUpdate.selectedItems![0].hierarchyGroupID == 0) {
      this.hierarchyOptions.deletePrompt!.title = 'Delete Niche';
      this.hierarchyOptions.menu!.menuOptions[0].name = 'Add Niche';
      this.hierarchyOptions.menu!.menuOptions[0].optionFunction = this.addNiche;
      this.hierarchyOptions.menu!.menuOptions[1].hidden = false;
      this.hierarchyOptions.menu!.menuOptions[1].name = 'Add Sub Niche';
      this.hierarchyOptions.menu!.menuOptions[1].optionFunction = this.addSubNicheBelow;
      this.hierarchyOptions.menu!.menuOptions[5].isDisabled = true;
    }

    if (hierarchyUpdate.selectedItems![0].hierarchyGroupID == 1) {
      this.hierarchyOptions.deletePrompt!.title = 'Delete Sub Niche';
      this.hierarchyOptions.menu!.menuOptions[0].name = 'Add Sub Niche';
      this.hierarchyOptions.menu!.menuOptions[0].optionFunction = this.addSubNiche;
      this.hierarchyOptions.menu!.menuOptions[1].hidden = false;
      this.hierarchyOptions.menu!.menuOptions[1].name = 'Add Product';
      this.hierarchyOptions.menu!.menuOptions[1].optionFunction = this.addProductBelow;
      this.hierarchyOptions.menu!.menuOptions[5].isDisabled = false;
    }

    if (hierarchyUpdate.selectedItems![0].hierarchyGroupID == 2) {
      this.hierarchyOptions.deletePrompt!.title = 'Delete Product';
      this.hierarchyOptions.menu!.menuOptions[0].name = 'Add Product';
      this.hierarchyOptions.menu!.menuOptions[0].optionFunction = this.addProduct;
      this.hierarchyOptions.menu!.menuOptions[1].hidden = true;
      this.hierarchyOptions.menu!.menuOptions[5].isDisabled = false;


      if (!hierarchyUpdate.rightClick) {
        this.dataService.get('api/Products/product', [{ key: 'productId', value: hierarchyUpdate.selectedItems![0].id }]).subscribe(x => console.log(x));
      }

    }
  }


  addNiche() {
    this.hierarchy.listManager.selectedItem = null!
    this.hierarchy.add();
  }


  addSubNicheBelow() {
    this.hierarchy.add(null!, true);
  }

  addSubNiche() {
    const index = this.hierarchy.listManager.getIndexOfHierarchyItemParent(this.hierarchy.listManager.selectedItem);
    this.hierarchy.add(index, true);
  }

  addProductBelow() {
    this.hierarchy.add();
  }


  addProduct() {
    this.hierarchy.add();
  }

  onEditFromMenu() {
    this.hierarchy.edit();
  }

  onDeleteFromMenu() {
    this.hierarchy.delete();
  }

  async onMove() {
    this.lazyLoadingService.load(async () => {
      const { MoveFormComponent } = await import('../../components/move-form/move-form.component');
      const { MoveFormModule } = await import('../../components/move-form/move-form.module');

      return {
        component: MoveFormComponent,
        module: MoveFormModule
      }
    }, SpinnerAction.None).then((moveForm: MoveFormComponent) => {
      this.moveFormOpen = true;
      moveForm.nicheHierarchy = this.nicheHierarchyService.niches;
      moveForm.moveItemType = this.hierarchy.listManager.selectedItem.hierarchyGroupID == 1 ? 'Sub Niche' : 'Product';
      moveForm.toItemType = this.hierarchy.listManager.selectedItem.hierarchyGroupID == 1 ? 'Niche' : 'Sub Niche';
      moveForm.moveItem = this.hierarchy.listManager.selectedItem;
      moveForm.isOpen.subscribe((moveFormOpen: boolean) => {
        window.setTimeout(() => {
          this.moveFormOpen = moveFormOpen;
        })
      })
      const index = this.hierarchy.listManager.getIndexOfHierarchyItemParent(this.hierarchy.listManager.selectedItem);
      const fromItem = this.hierarchy.sourceList[index];
      moveForm.fromItem = fromItem;

      if (this.hierarchy.listManager.selectedItem.hierarchyGroupID == 1) {
        this.dataService.get<Array<ListItem>>('api/Categories')
          .subscribe((categories: Array<ListItem>) => {

            categories.forEach(x => {
              if (x.name != fromItem.name) {
                moveForm.destinationList.push({
                  id: x.id,
                  name: x.name
                })
              }
            })
          });

      } else {

        this.dataService.get<Array<ListItem>>('api/Niches/All')
          .subscribe((niches: Array<ListItem>) => {

            niches.forEach(x => {
              if (x.name != fromItem.name) {
                moveForm.destinationList.push({
                  id: x.id,
                  name: x.name
                })
              }
            })
          });
      }
    });
  }



  onArrowClick(hierarchyUpdate: ListUpdate) {
    // If a niche was expanded and its children hasn't been loaded yet
    if (hierarchyUpdate.arrowDown && !hierarchyUpdate.hasChildren) {

      // If that niche is the top level niche
      if (hierarchyUpdate.hierarchyGroupID == 0) {

        // Get all its niche children
        this.dataService.get<Array<HierarchyItem>>('api/Niches', [{ key: 'categoryId', value: hierarchyUpdate.id! }]).subscribe((hierarchyItems: Array<HierarchyItem>) => {
          // If a niche is being added and the arrow down is automated, then place the loading niches after the added niche, otherwise place the loading niches after the parent niche
          let num = this.hierarchy.listManager.editableItem ? 2 : 1;

          for (let i = hierarchyItems.length - 1; i >= 0; i--) {
            this.nicheHierarchyService.niches.splice(hierarchyUpdate.index! + num, 0,
              {
                id: hierarchyItems[i].id,
                name: hierarchyItems[i].name,
                hierarchyGroupID: 1,
                hidden: false,
                arrowDown: false,
                isParent: true
              }
            )
          }
        });
      }

      if (hierarchyUpdate.hierarchyGroupID == 1) {
        this.dataService.get<Array<HierarchyItem>>('api/Products', [{ key: 'nicheId', value: hierarchyUpdate.id! }]).subscribe((hierarchyItems: Array<HierarchyItem>) => {
          // If a product is being added and the arrow down is automated, then place the loading products after the added product, otherwise place the loading products after the parent niche
          let num = this.hierarchy.listManager.editableItem ? 2 : 1;

          for (let i = hierarchyItems.length - 1; i >= 0; i--) {
            this.nicheHierarchyService.niches.splice(hierarchyUpdate.index! + num, 0,
              {
                id: hierarchyItems[i].id,
                name: hierarchyItems[i].name,
                hierarchyGroupID: 2,
                hidden: false,
              }
            )
          }
        });
      }
    }
  }


  onDeletePromptOpen(deletedItem: HierarchyItem) {
    // Niche
    if (deletedItem.hierarchyGroupID == 0 || deletedItem.hierarchyGroupID == 1) {
      this.hierarchyOptions.deletePrompt!.message = 'Are you sure you want to delete the following niche and its contents?<br><br>\"' + deletedItem.name + '\"';

      // Product
    } else {
      const indexOfHierarchyItemParent = this.hierarchy.listManager.getIndexOfHierarchyItemParent(this.hierarchy.sourceList[deletedItem.index!]);
      this.hierarchyOptions.deletePrompt!.message = 'Are you sure you want to delete the following product from the niche, ' + this.hierarchy.sourceList[indexOfHierarchyItemParent].name + '?<br><br>\"' + deletedItem.name + '\"';
    }
  }




  onEscape(): void {
    // Prevent escacpe from happening here and let the menu bar component take care of it
  }
}