import { Component, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService, LazyLoad, LazyLoadingService, SpinnerAction } from 'common';
import { debounceTime, fromEvent, Subject, Subscription } from 'rxjs';
import { ListUpdateType, MenuOptionType } from '../../classes/enums';
import { HierarchyItem } from '../../classes/hierarchy-item';
import { HierarchyUpdate } from '../../classes/hierarchy-update';
import { Item } from '../../classes/item';
import { ListItem } from '../../classes/list-item';
import { ListOptions } from '../../classes/list-options';
import { MultiColumnItem } from '../../classes/multi-column-item';
import { MultiColumnListUpdate } from '../../classes/multi-column-list-update';
import { MoveFormComponent } from '../../components/move-form/move-form.component';
import { NicheHierarchyService } from '../../services/niche-hierarchy/niche-hierarchy.service';
import { HierarchyComponent } from '../hierarchies/hierarchy/hierarchy.component';
import { MultiColumnListComponent } from '../lists/multi-column-list/multi-column-list.component';

@Component({
  selector: 'niche-hierarchy',
  templateUrl: './niche-hierarchy.component.html',
  styleUrls: ['./niche-hierarchy.component.scss']
})
export class NicheHierarchyComponent extends LazyLoad {
  // Private
  private editedSearchItem!: HierarchyItem;
  private searchInputSubscription!: Subscription;
  private onNicheLoad: Subject<void> = new Subject<void>();
  private onSubNicheLoad: Subject<void> = new Subject<void>();
  private _hierarchyUpdate: HierarchyUpdate = new HierarchyUpdate();
  private _searchListUpdate: MultiColumnListUpdate = new MultiColumnListUpdate();

  // Public
  public isParent!: boolean;
  public searchMode!: boolean;
  public moveFormOpen!: boolean;
  public addButtonTitle: string = 'Add Niche';
  public editButtonTitle: string = 'Edit';
  public deleteButtonTitle: string = 'Delete';
  public hierarchyOptions: ListOptions = new ListOptions();
  public searchListOptions: ListOptions = new ListOptions();
  public overNicheHierarchy: Subject<boolean> = new Subject<boolean>();
  public searchList: Array<MultiColumnItem> = new Array<MultiColumnItem>();
  public get hierarchyUpdate(): HierarchyUpdate { return this._hierarchyUpdate; }
  public get searchListUpdate(): MultiColumnListUpdate { return this._searchListUpdate; }
  public set searchListUpdate(searchListUpdate: MultiColumnListUpdate) { this.onSearchListUpdate(searchListUpdate); }
  public set hierarchyUpdate(hierarchyUpdate: HierarchyUpdate) { this.onHierarchyUpdate(hierarchyUpdate); }

  // Decorators
  @ViewChild('hierarchy') hierarchy!: HierarchyComponent;
  @ViewChild('multiColumnList') multiColumnList!: MultiColumnListComponent;

  // Constructor
  constructor(lazyLoadingService: LazyLoadingService,
    private dataService: DataService,
    private sanitizer: DomSanitizer,
    public nicheHierarchyService: NicheHierarchyService) {
    super(lazyLoadingService);
  }


  ngAfterViewInit() {
    super.ngAfterViewInit();

    // Hierarchy
    this.hierarchyOptions = {
      editable: true,
      unselectable: false,
      multiselectable: false,

      // Prompt
      deletePrompt: {
        parentObj: this,
        primaryButton: {
          name: 'Delete',
          buttonFunction: this.onDelete
        },
        secondaryButton: {
          name: 'Cancel'
        }
      },

      // Menu
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
            shortcut: 'Ctrl+Alt+R',
            optionFunction: this.onEdit
          },
          {
            type: MenuOptionType.MenuItem,
            name: 'Delete',
            shortcut: 'Delete',
            optionFunction: this.onDelete
          },
          {
            type: MenuOptionType.Divider
          },
          {
            type: MenuOptionType.MenuItem,
            name: 'Move',
            shortcut: 'Ctrl+M',
            optionFunction: this.openMoveForm
          }
        ]
      }
    }


    // Search List
    this.searchListOptions = {
      unselectable: false,
      sortable: false,
      multiselectable: false,

      // Prompt
      deletePrompt: {
        parentObj: this,
        primaryButton: {
          name: 'Delete',
          buttonFunction: this.onDelete
        },
        secondaryButton: {
          name: 'Cancel'
        }
      },

      // Menu
      menu: {
        parentObj: this,
        menuOptions: [
          {
            type: MenuOptionType.MenuItem,
            shortcut: 'Ctrl+Alt+R',
            optionFunction: this.onEdit
          },
          {
            type: MenuOptionType.MenuItem,
            name: 'Delete',
            shortcut: 'Delete',
            optionFunction: this.onDelete
          },
          {
            type: MenuOptionType.Divider
          },
          {
            type: MenuOptionType.MenuItem,
            name: 'Move',
            shortcut: 'Ctrl+M',
            optionFunction: this.openMoveForm
          },
          {
            type: MenuOptionType.MenuItem,
            name: 'Go To Hierarchy',
            shortcut: 'Alt+H',
            optionFunction: this.gotoHierarchy
          }
        ]
      }
    }
  }


  onOpen() {
    if (this.nicheHierarchyService.niches.length == 0) {
      this.dataService.get<Array<HierarchyItem>>('api/Categories')
        .subscribe((hierarchyItems: Array<HierarchyItem>) => {
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
    } else {

      this.setHierarchy();
    }
  }


  setHierarchy() {
    if (this.searchInputSubscription) this.searchInputSubscription.unsubscribe();
    const selectedItem = this.nicheHierarchyService.niches.filter(x => x.selectType != null || x.selected == true)[0];
    if (selectedItem) {
      this.hierarchy.listManager.onItemDown(selectedItem);
    }
    this.hierarchy.listManager.collapseDisabled = this.hierarchy.listManager.getIsCollapsed();
  }


  getNiche(nicheId: number, subNicheId: number, func: Function, funcParameters: Array<any>, func2: Function, func2Parameters: Array<any>) {
    // Find the niche in the hierarchy
    const niche: HierarchyItem = this.nicheHierarchyService.niches.find(x => x.hierarchyGroupID == 0 && x.id == nicheId)!;

    // If the niche does NOT have its arrow down
    if (!niche.arrowDown) {

      // Check to see if its arrow was ever down and its sub-niches have already been loaded
      const subNiche: HierarchyItem = this.nicheHierarchyService.niches.find(x => x.hierarchyGroupID == 1 && x.id == subNicheId)!;

      // Then set that arrow of that niche to be down
      this.hierarchy.listManager.onArrowClick(niche);

      // If its sub-niches were never loaded
      if (subNiche == null) {

        // Now that the niche's arrow is down, wait for its sub-niches to load
        let onNicheLoadListener = this.onNicheLoad.subscribe(() => {
          onNicheLoadListener.unsubscribe();
          func.apply(this, funcParameters);
        })

        // But if the sub-niches are already loaded
      } else {

        func2.apply(this, func2Parameters);
      }

      // If the arrow of the niche is already down
    } else {

      func2.apply(this, func2Parameters);
    }
  }


  getSubNiche(subNicheId: number, productId: number) {
    // Find the sub-niche we're looking for in the hierarchy
    const subNiche: HierarchyItem = this.nicheHierarchyService.niches.find(x => x.hierarchyGroupID == 1 && x.id == subNicheId)!;

    // If the arrow of that sub-niche is NOT down
    if (!subNiche.arrowDown) {

      // Check to see if the arrow of that sub-niche was ever down and its products have already been loaded
      const product: HierarchyItem = this.nicheHierarchyService.niches.find(x => x.hierarchyGroupID == 2 && x.id == productId)!;

      // Then set that arrow of that sub-niche to be down
      this.hierarchy.listManager.onArrowClick(subNiche);

      // If its products were never loaded
      if (product == null) {

        // Now that the sub-niche's arrow is down, wait for its products to load
        let onSubNicheLoadListener = this.onSubNicheLoad.subscribe(() => {
          onSubNicheLoadListener.unsubscribe();

          // Once all the products are loaded, find the product in the hierarchy
          const product: HierarchyItem = this.nicheHierarchyService.niches.find(x => x.hierarchyGroupID == 2 && x.id == productId)!;
          // Then select that product
          this.hierarchy.listManager.onItemDown(product);
        })

        // But if the products are already loaded
      } else {

        // Then select the product we're looking for
        this.hierarchy.listManager.onItemDown(product);
      }

      // If the arrow of that sub-niche is already down
    } else {

      // Find the product we're looking for in the hierarchy
      const product: HierarchyItem = this.nicheHierarchyService.niches.find(x => x.hierarchyGroupID == 2 && x.id == productId)!;
      // Then select that product
      this.hierarchy.listManager.onItemDown(product);
    }
  }


  selectSubNiche(subNicheId: number) {
    // Find the sub-niche we're looking for in the hierarchy
    const subNiche: HierarchyItem = this.nicheHierarchyService.niches.find(x => x.hierarchyGroupID == 1 && x.id == subNicheId)!;
    // Then select that sub-niche
    this.hierarchy.listManager.onItemDown(subNiche);
  }


  getProduct(subNicheId: number, productId: number) {
    // Find the sub-niche we were looking for
    const subNiche: HierarchyItem = this.nicheHierarchyService.niches.find(x => x.hierarchyGroupID == 1 && x.id == subNicheId)!;

    // Now that we found the sub-niche we were looking for, set the arrow of that sub-niche to be down
    if (!subNiche.arrowDown) this.hierarchy.listManager.onArrowClick(subNiche);

    // Now that the sub-niche's arrow is down, wait for its products to load
    let onSubNicheLoadListener = this.onSubNicheLoad.subscribe(() => {
      onSubNicheLoadListener.unsubscribe();

      // Once all the products are loaded, find the product in the hierarchy
      const product: HierarchyItem = this.nicheHierarchyService.niches.find(x => x.hierarchyGroupID == 2 && x.id == productId)!;
      // Then select that product
      this.hierarchy.listManager.onItemDown(product);
    })
  }




  gotoHierarchy() {
    // Go to niche
    if ((this.multiColumnList.listManager.selectedItem as MultiColumnItem).values[1].name == 'Niche') {
      const searchListNiche: MultiColumnItem = this.multiColumnList.listManager.selectedItem as MultiColumnItem;

      // Now go to the hierarchy
      this.searchMode = false;
      window.setTimeout(() => {
        this.setHierarchy();

        // Find the niche in the hierarchy
        const niche: HierarchyItem = this.nicheHierarchyService.niches.find(x => x.hierarchyGroupID == 0 && x.id == searchListNiche.id)!;
        // Then select that niche
        this.hierarchy.listManager.onItemDown(niche);
      })
    }


    // Go to sub-Niche
    if ((this.multiColumnList.listManager.selectedItem as MultiColumnItem).values[1].name == 'Sub Niche') {
      const searchListSubNiche: MultiColumnItem = this.multiColumnList.listManager.selectedItem as MultiColumnItem;

      // Get the parent niche of the selected sub-niche
      this.dataService.get<Item>('api/Niches/ParentCategory', [{ key: 'nicheId', value: searchListSubNiche.id }])
        .subscribe((item: Item) => {
          const nicheId: number = item.id;

          // Now go to the hierarchy
          this.searchMode = false;
          window.setTimeout(() => {
            this.setHierarchy();
            this.getNiche(nicheId, searchListSubNiche.id, this.selectSubNiche, [searchListSubNiche.id], this.selectSubNiche, [searchListSubNiche.id]);
          })
        })
    }


    // Go to product
    if ((this.multiColumnList.listManager.selectedItem as MultiColumnItem).values[1].name == 'Product') {
      const searchListProduct: MultiColumnItem = this.multiColumnList.listManager.selectedItem as MultiColumnItem;

      // Get the parent sub-niche of the selected product
      this.dataService.get<Item>('api/Products/ParentNiche', [{ key: 'productId', value: searchListProduct.id }])
        .subscribe((item: Item) => {
          const subNicheId: number = item.id;

          // Then get the parent niche of the sub-niche
          this.dataService.get<Item>('api/Niches/ParentCategory', [{ key: 'nicheId', value: item.id }])
            .subscribe((item: Item) => {
              const nicheId: number = item.id;

              // Now go to the hierarchy
              this.searchMode = false;
              window.setTimeout(() => {
                this.setHierarchy();
                this.getNiche(nicheId, subNicheId, this.getProduct, [subNicheId, searchListProduct.id], this.getSubNiche, [subNicheId, searchListProduct.id]);
              })
            });
        });
    }
  }


  toggleSearch() {
    this.searchMode = !this.searchMode;

    // If we're in search mode
    if (this.searchMode) {
      this.searchList.splice(0, this.searchList.length);
      window.setTimeout(() => {
        const searchInput: HTMLInputElement = document.getElementById('searchInput') as HTMLInputElement;
        searchInput!.focus();
        this.searchInputSubscription = fromEvent(searchInput, 'input').pipe(debounceTime(500)).subscribe(() => {
          if (searchInput.value.length > 1) {
            this.getSearchResults(searchInput.value);
          }
        });
      })

      // If we're in hierarchy mode
    } else {

      window.setTimeout(() => {
        if (this.editedSearchItem) {
          this.hierarchy.listManager.sort(this.editedSearchItem);
        }
        this.setHierarchy();
      })
    }
  }


  onHierarchyUpdate(hierarchyUpdate: HierarchyUpdate) {
    this._hierarchyUpdate = hierarchyUpdate;
    if (hierarchyUpdate.type == ListUpdateType.Add) this.onHierarchyItemAdd(hierarchyUpdate);
    if (hierarchyUpdate.type == ListUpdateType.Edit) this.onHierarchyItemEdit(hierarchyUpdate);
    if (hierarchyUpdate.type == ListUpdateType.ArrowClicked) this.onArrowClick(hierarchyUpdate);
    if (hierarchyUpdate.type == ListUpdateType.SelectedItems) this.onSelectedHierarchyItem(hierarchyUpdate);
    if (hierarchyUpdate.type == ListUpdateType.Delete) this.onHierarchyItemDelete(hierarchyUpdate.deletedItems![0]);
    if (hierarchyUpdate.type == ListUpdateType.DeletePrompt) this.onHierarchyDeletePromptOpen(hierarchyUpdate.deletedItems![0]);
    this.hierarchyOptions.menu!.menuOptions[0].isDisabled = hierarchyUpdate.editDisabled;
  }


  onSearchListUpdate(searchListUpdate: MultiColumnListUpdate) {
    this._searchListUpdate = searchListUpdate;
    if (searchListUpdate.type == ListUpdateType.Edit) this.onSearchListItemEdit(searchListUpdate);
    if (searchListUpdate.type == ListUpdateType.SelectedItems) this.onSelectedSearchListItem(searchListUpdate);
    if (searchListUpdate.type == ListUpdateType.Delete) this.onSearchListItemDelete(searchListUpdate.deletedMultiColumnItems![0]);
    if (searchListUpdate.type == ListUpdateType.DeletePrompt) this.onSearchListDeletePromptOpen(searchListUpdate.deletedMultiColumnItems![0]);
  }


  onHierarchyItemAdd(hierarchyUpdate: HierarchyUpdate) {
    if (hierarchyUpdate.hierarchyGroupID == 0) {
      this.dataService.post<number>('api/Categories', {
        name: hierarchyUpdate.name
      }).subscribe((id: number) => {
        this.nicheHierarchyService.niches[hierarchyUpdate.index!].id = id;
      });
    }


    if (hierarchyUpdate.hierarchyGroupID == 1) {
      this.dataService.post<number>('api/Niches', {
        id: this.nicheHierarchyService.niches[this.hierarchy.listManager.getIndexOfHierarchyItemParent(this.nicheHierarchyService.niches[hierarchyUpdate.index!])].id,
        name: hierarchyUpdate.name
      }).subscribe((id: number) => {
        this.nicheHierarchyService.niches[hierarchyUpdate.index!].id = id;
      });
    }


    if (hierarchyUpdate.hierarchyGroupID == 2) {
      this.dataService.post<number>('api/Products', {
        id: this.nicheHierarchyService.niches[this.hierarchy.listManager.getIndexOfHierarchyItemParent(this.nicheHierarchyService.niches[hierarchyUpdate.index!])].id,
        name: hierarchyUpdate.name
      }).subscribe((id: number) => {
        this.nicheHierarchyService.niches[hierarchyUpdate.index!].id = id;
      });
    }
  }


  onHierarchyItemEdit(hierarchyUpdate: HierarchyUpdate) {
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


  onSearchListItemEdit(searchListUpdate: MultiColumnListUpdate) {
    if (searchListUpdate.values![1].name == 'Niche') {
      this.dataService.put('api/Categories', {
        id: searchListUpdate.id,
        name: searchListUpdate.values![0].name
      }).subscribe(() => {
        this.editedSearchItem = this.nicheHierarchyService.niches.find(x => x.id == searchListUpdate.id && x.hierarchyGroupID == 0)!;
        if (this.editedSearchItem) {
          this.editedSearchItem.name = searchListUpdate.values![0].name;
        }
      });
    }

    if (searchListUpdate.values![1].name == 'Sub Niche') {
      this.dataService.put('api/Niches', {
        id: searchListUpdate.id,
        name: searchListUpdate.values![0].name
      }).subscribe(() => {
        this.editedSearchItem = this.nicheHierarchyService.niches.find(x => x.id == searchListUpdate.id && x.hierarchyGroupID == 1)!;
        if (this.editedSearchItem) {
          this.editedSearchItem.name = searchListUpdate.values![0].name;
        }
      });
    }

    if (searchListUpdate.values![1].name == 'Product') {
      this.dataService.put('api/Products', {
        id: searchListUpdate.id,
        name: searchListUpdate.values![0].name
      }).subscribe(() => {
        this.editedSearchItem = this.nicheHierarchyService.niches.find(x => x.id == searchListUpdate.id && x.hierarchyGroupID == 2)!;
        if (this.editedSearchItem) {
          this.editedSearchItem.name = searchListUpdate.values![0].name;
        }
      });
    }
  }


  onHierarchyItemDelete(deletedItem: HierarchyItem) {
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


  onSearchListItemDelete(deletedItem: MultiColumnItem) {
    if (deletedItem.values[1].name == 'Niche') {
      this.dataService.delete('api/Categories', {
        id: deletedItem.id
      }).subscribe();
    }


    if (deletedItem.values[1].name == 'Sub Niche') {
      this.dataService.delete('api/Niches', {
        id: deletedItem.id
      }).subscribe();
    }


    if (deletedItem.values[1].name == 'Product') {
      this.dataService.delete('api/Products', {
        id: deletedItem.id
      }).subscribe();
    }


    // Remove the deleted search item from the niche hierarchy as well
    const index = this.nicheHierarchyService.niches.findIndex(x => x.id == deletedItem.id && x.name == deletedItem.values[0].name);
    this.nicheHierarchyService.niches.splice(index, 1)
  }


  onSelectedHierarchyItem(hierarchyUpdate: HierarchyUpdate) {
    this.isParent = hierarchyUpdate.selectedItems![0].hierarchyGroupID == 1 || hierarchyUpdate.selectedItems![0].hierarchyGroupID == 2 ? false : true;

    if (hierarchyUpdate.selectedItems![0].hierarchyGroupID == 0) {
      this.addButtonTitle = 'Add Sub Niche';
      this.editButtonTitle = 'Edit Niche';
      this.deleteButtonTitle = 'Delete Niche';
      this.hierarchyOptions.deletePrompt!.title = 'Delete Niche';
      this.hierarchyOptions.menu!.menuOptions[0].name = 'Add Niche';
      this.hierarchyOptions.menu!.menuOptions[0].optionFunction = this.addNiche;
      this.hierarchyOptions.menu!.menuOptions[1].hidden = false;
      this.hierarchyOptions.menu!.menuOptions[1].name = 'Add Sub Niche';
      this.hierarchyOptions.menu!.menuOptions[1].optionFunction = this.addSubNicheBelow;
      this.hierarchyOptions.menu!.menuOptions[2].name = 'Rename Niche';
      this.hierarchyOptions.menu!.menuOptions[3].name = 'Delete Niche';
      this.hierarchyOptions.menu!.menuOptions[5].isDisabled = true;
    }

    if (hierarchyUpdate.selectedItems![0].hierarchyGroupID == 1) {
      this.addButtonTitle = 'Add Product';
      this.editButtonTitle = 'Edit Sub Niche';
      this.deleteButtonTitle = 'Delete Sub Niche';
      this.hierarchyOptions.deletePrompt!.title = 'Delete Sub Niche';
      this.hierarchyOptions.menu!.menuOptions[0].name = 'Add Sub Niche';
      this.hierarchyOptions.menu!.menuOptions[0].optionFunction = this.addSubNiche;
      this.hierarchyOptions.menu!.menuOptions[1].hidden = false;
      this.hierarchyOptions.menu!.menuOptions[1].name = 'Add Product';
      this.hierarchyOptions.menu!.menuOptions[1].optionFunction = this.addProductBelow;
      this.hierarchyOptions.menu!.menuOptions[2].name = 'Rename Sub Niche';
      this.hierarchyOptions.menu!.menuOptions[3].name = 'Delete Sub Niche';
      this.hierarchyOptions.menu!.menuOptions[5].isDisabled = false;
    }

    if (hierarchyUpdate.selectedItems![0].hierarchyGroupID == 2) {
      this.addButtonTitle = 'Add Product';
      this.editButtonTitle = 'Edit Product';
      this.deleteButtonTitle = 'Delete Product';
      this.hierarchyOptions.deletePrompt!.title = 'Delete Product';
      this.hierarchyOptions.menu!.menuOptions[0].name = 'Add Product';
      this.hierarchyOptions.menu!.menuOptions[0].optionFunction = this.addProduct;
      this.hierarchyOptions.menu!.menuOptions[1].hidden = true;
      this.hierarchyOptions.menu!.menuOptions[2].name = 'Rename Product';
      this.hierarchyOptions.menu!.menuOptions[3].name = 'Delete Product';
      this.hierarchyOptions.menu!.menuOptions[5].isDisabled = false;

      if (!hierarchyUpdate.rightClick) {
        this.dataService.get('api/Products/product', [{ key: 'productId', value: hierarchyUpdate.selectedItems![0].id }]).subscribe(x => console.log(x));
      }
    }
  }


  onSelectedSearchListItem(searchListUpdate: MultiColumnListUpdate) {
    this.searchListOptions.deletePrompt!.title = 'Delete ' + searchListUpdate.selectedMultiColumnItems![0].values[1].name;
    this.searchListOptions.menu!.menuOptions[0].name = 'Rename ' + searchListUpdate.selectedMultiColumnItems![0].values[1].name;

    this.editButtonTitle = 'Edit ' + searchListUpdate.selectedMultiColumnItems![0].values[1].name;
    this.deleteButtonTitle = 'Delete ' + searchListUpdate.selectedMultiColumnItems![0].values[1].name;

    if (searchListUpdate.selectedMultiColumnItems![0].values[1].name == 'Niche') this.searchListOptions.menu!.menuOptions[3].isDisabled = true;
    if (searchListUpdate.selectedMultiColumnItems![0].values[1].name == 'Sub Niche') this.searchListOptions.menu!.menuOptions[3].isDisabled = false;
    if (searchListUpdate.selectedMultiColumnItems![0].values[1].name == 'Product') this.searchListOptions.menu!.menuOptions[3].isDisabled = false;
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

  onEdit() {
    if (!this.searchMode) {
      this.hierarchy.edit();
    } else {
      this.multiColumnList.edit();
    }
  }

  onDelete() {
    if (!this.searchMode) {
      this.hierarchy.delete();
    } else {
      this.multiColumnList.delete();
    }
  }


  async openMoveForm() {
    this.lazyLoadingService.load(async () => {
      const { MoveFormComponent } = await import('../../components/move-form/move-form.component');
      const { MoveFormModule } = await import('../../components/move-form/move-form.module');

      return { component: MoveFormComponent, module: MoveFormModule }
    }, SpinnerAction.None)
      .then((moveForm: MoveFormComponent) => {

        // If we're in hierarchy view
        if (!this.searchMode) {
          const itemToBeMovedType = this.hierarchy.listManager.selectedItem.hierarchyGroupID == 1 ? 'Sub Niche' : 'Product';
          const destinationItemType = this.hierarchy.listManager.selectedItem.hierarchyGroupID == 1 ? 'Niche' : 'Sub Niche';
          const itemToBeMoved = this.hierarchy.listManager.selectedItem;
          const index = this.hierarchy.listManager.getIndexOfHierarchyItemParent(this.hierarchy.listManager.selectedItem);
          const fromItem = this.nicheHierarchyService.niches[index];
          const path = this.hierarchy.listManager.selectedItem.hierarchyGroupID == 1 ? 'api/Categories' : 'api/Niches/All';
          this.setMoveForm(moveForm, itemToBeMovedType, destinationItemType, itemToBeMoved, fromItem, path);

          // If we're in search view
        } else {

          // Check to see if the item-to-be-moved is visible on the niche hierarchy
          let itemToBeMoved = this.nicheHierarchyService.niches.find(x =>
            x.id == this.multiColumnList.listManager.selectedItem.id &&
            x.name == (this.multiColumnList.listManager.selectedItem as MultiColumnItem).values[0].name &&
            x.hierarchyGroupID == ((this.multiColumnList.listManager.selectedItem as MultiColumnItem).values[1].name == 'Sub Niche' ? 1 : 2));

          // If the item-to-be-moved was not found 
          // (This would be because the item-to-be-moved is not visible on the niche hierarchy)
          if (!itemToBeMoved) itemToBeMoved = {
            // Then create the item-to-be-moved
            id: this.multiColumnList.listManager.selectedItem.id,
            name: (this.multiColumnList.listManager.selectedItem as MultiColumnItem).values[0].name,
            hierarchyGroupID: (this.multiColumnList.listManager.selectedItem as MultiColumnItem).values[1].name == 'Sub Niche' ? 1 : 2,
            isParent: (this.multiColumnList.listManager.selectedItem as MultiColumnItem).values[1].name == 'Sub Niche' ? true : false
          }

          const itemToBeMovedType = (this.multiColumnList.listManager.selectedItem as MultiColumnItem).values[1].name;
          const destinationItemType = (this.multiColumnList.listManager.selectedItem as MultiColumnItem).values[1].name == 'Sub Niche' ? 'Niche' : 'Sub Niche';
          const path = (this.multiColumnList.listManager.selectedItem as MultiColumnItem).values[1].name == 'Sub Niche' ? 'api/Categories' : 'api/Niches/All';
          const parentPath = (this.multiColumnList.listManager.selectedItem as MultiColumnItem).values[1].name == 'Sub Niche' ? 'api/Niches/ParentCategory' : 'api/Products/ParentNiche';
          const key = (this.multiColumnList.listManager.selectedItem as MultiColumnItem).values[1].name == 'Sub Niche' ? 'nicheId' : 'productId';

          this.dataService.get<Item>(parentPath, [{ key: key, value: this.multiColumnList.listManager.selectedItem.id }])
            .subscribe((item: Item) => {
              const fromItem: HierarchyItem = { id: item.id, name: item.name };
              this.setMoveForm(moveForm, itemToBeMovedType, destinationItemType, itemToBeMoved!, fromItem, path);
            });
        }
      });
  }


  setMoveForm(moveForm: MoveFormComponent, itemToBeMovedType: string, destinationItemType: string, itemToBeMoved: HierarchyItem, fromItem: HierarchyItem, path: string) {
    this.moveFormOpen = true;
    moveForm.itemToBeMoved = itemToBeMoved;
    moveForm.fromItem = fromItem;
    moveForm.destinationItemType = destinationItemType;
    moveForm.itemToBeMovedType = itemToBeMovedType;
    moveForm.nicheHierarchy = this.nicheHierarchyService.niches;

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



  onArrowClick(hierarchyUpdate: HierarchyUpdate) {
    // If a niche was expanded and its children hasn't been loaded yet
    if (hierarchyUpdate.arrowDown && !hierarchyUpdate.hasChildren) {

      // If that niche is the top level niche
      if (hierarchyUpdate.hierarchyGroupID == 0) {

        // Get all its niche children
        this.dataService.get<Array<HierarchyItem>>('api/Niches', [{ key: 'categoryId', value: hierarchyUpdate.id! }]).subscribe((hierarchyItems: Array<HierarchyItem>) => {
          // If a niche is being added and the arrow down is automated, then place the loading niches after the added niche, otherwise place the loading niches after the parent niche
          let num = this.hierarchy.listManager.editedItem ? 2 : 1;

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
          this.onNicheLoad.next();
        });
      }

      if (hierarchyUpdate.hierarchyGroupID == 1) {
        this.dataService.get<Array<HierarchyItem>>('api/Products', [{ key: 'nicheId', value: hierarchyUpdate.id! }]).subscribe((hierarchyItems: Array<HierarchyItem>) => {
          // If a product is being added and the arrow down is automated, then place the loading products after the added product, otherwise place the loading products after the parent niche
          let num = this.hierarchy.listManager.editedItem ? 2 : 1;

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
          this.onSubNicheLoad.next();
        });
      }
    }
  }


  onSearchInputChange(searchInput: any) {
    if (searchInput.value.length == 1) {
      this.getSearchResults(searchInput.value);
    } else if (searchInput.value.length == 0) {
      this.searchList.splice(0, this.searchList.length);
    }
  }


  getSearchResults(value: string) {
    this.searchList.splice(0, this.searchList.length);

    this.dataService.get<Array<MultiColumnItem>>('api/Products/Search', [{ key: 'searchWords', value: value }])
      .subscribe((searchList: Array<MultiColumnItem>) => {

        searchList.forEach(x => {
          this.searchList.push({

            id: x.id,
            values: [{ name: x.name!, width: '295px', allowEdit: true }, { name: 'Product', width: '78px' }]
          })
        })
      });


    this.dataService.get<Array<MultiColumnItem>>('api/Niches/Search', [{ key: 'searchWords', value: value }])
      .subscribe((searchList: Array<MultiColumnItem>) => {

        searchList.forEach(x => {
          this.searchList.push({

            id: x.id,
            values: [{ name: x.name!, width: '295px', allowEdit: true }, { name: 'Sub Niche', width: '78px' }]
          })
        })
      });


    this.dataService.get<Array<MultiColumnItem>>('api/Categories/Search', [{ key: 'searchWords', value: value }])
      .subscribe((searchList: Array<MultiColumnItem>) => {

        searchList.forEach(x => {
          this.searchList.push({

            id: x.id,
            values: [{ name: x.name!, width: '295px', allowEdit: true }, { name: 'Niche', width: '78px' }]
          })
        })
      });
  }


  onHierarchyDeletePromptOpen(deletedItem: HierarchyItem) {
    const itemType = deletedItem.hierarchyGroupID == 0 ? 'Niche' : deletedItem.hierarchyGroupID == 1 ? 'Sub Niche' : 'Product';
    this.hierarchyOptions.deletePrompt!.message = this.sanitizer.bypassSecurityTrustHtml(

      '<div>The following ' + itemType.toLowerCase() + (itemType == 'Product' ? '' : ' and its contents') + ' will be permanently deleted from the list:</div>' +

      '<br>' +

      '<div style="margin-bottom: 4px; display: flex">' +
      '<div style="width: fit-content; padding-right: 4px; flex-shrink: 0;">' + itemType + ':</div>' +
      '<div style="color: #ffba00">' + deletedItem.name + '</div>' +
      '</div>' +

      '<br>' +

      '<div>This operation can NOT be undone. Are you sure you want to proceed?</div>'
    )
  }


  onSearchListDeletePromptOpen(deletedItem: MultiColumnItem) {
    this.searchListOptions.deletePrompt!.message = this.sanitizer.bypassSecurityTrustHtml(

      '<div>The following ' + deletedItem.values[1].name.toLowerCase() + (deletedItem.values[1].name == 'Product' ? '' : ' and its contents') + ' will be permanently deleted from the list:</div>' +

      '<br>' +

      '<div style="margin-bottom: 4px; display: flex">' +
      '<div style="width: fit-content; padding-right: 4px; flex-shrink: 0;">' + deletedItem.values[1].name + ':</div>' +
      '<div style="color: #ffba00">' + deletedItem.values[0].name + '</div>' +
      '</div>' +

      '<br>' +

      '<div>This operation can NOT be undone. Are you sure you want to proceed?</div>'
    )
  }

  onEscape(): void {
    // Prevent escacpe from happening here and let the menu bar component take care of it
  }
}