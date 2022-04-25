import { Component, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService, LazyLoad, LazyLoadingService } from 'common';
import { Subscription, fromEvent, debounceTime } from 'rxjs';
import { ListUpdateType, MenuOptionType } from '../../classes/enums';
import { Filter } from '../../classes/filter';
import { FilterOption } from '../../classes/filter-option';
import { HierarchyItem } from '../../classes/hierarchy-item';
import { HierarchyUpdate } from '../../classes/hierarchy-update';
import { ListOptions } from '../../classes/list-options';
import { MultiColumnItem } from '../../classes/multi-column-item';
import { MultiColumnListUpdate } from '../../classes/multi-column-list-update';
import { FiltersService } from '../../services/filters/filters.service';
import { HierarchyComponent } from '../hierarchies/hierarchy/hierarchy.component';
import { MultiColumnListComponent } from '../lists/multi-column-list/multi-column-list.component';

@Component({
  selector: 'filter-form',
  templateUrl: './filter-form.component.html',
  styleUrls: ['./filter-form.component.scss']
})
export class FilterFormComponent extends LazyLoad {
  // private
  private editedSearchItem!: HierarchyItem;
  private _filtersHierarchyUpdate!: HierarchyUpdate;
  private searchInputSubscription!: Subscription;
  private _filtersSearchUpdate!: MultiColumnListUpdate;

  // Public
  public isParent!: boolean;
  public searchMode!: boolean;
  public addButtonTitle!: string;
  public editButtonTitle!: string;
  public deleteButtonTitle!: string;
  public filtersHierarchyOptions: ListOptions = new ListOptions();
  public filtersSearchOptions: ListOptions = new ListOptions();
  public searchList: Array<MultiColumnItem> = new Array<MultiColumnItem>();
  public get filtersSearchUpdate(): MultiColumnListUpdate { return this._filtersSearchUpdate; }
  public get filtersHierarchyUpdate(): HierarchyUpdate { return this._filtersHierarchyUpdate; }
  public set filtersSearchUpdate(filtersSearchUpdate: MultiColumnListUpdate) { this.onFiltersSearchUpdate(filtersSearchUpdate); }
  public set filtersHierarchyUpdate(filtersHierarchyUpdate: HierarchyUpdate) { this.onFiltersHierarchyUpdate(filtersHierarchyUpdate); }

  // Decorators
  @ViewChild('filtersHierarchy') filtersHierarchy!: HierarchyComponent;
  @ViewChild('filtersSearch') filtersSearch!: MultiColumnListComponent;

  // Constructor
  constructor(lazyLoadingService: LazyLoadingService,
    private dataService: DataService,
    private sanitizer: DomSanitizer,
    public filtersService: FiltersService) {
    super(lazyLoadingService);
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();

    this.filtersHierarchyOptions = {
      multiselectable: false,
      verifyAddEdit: true,

      // Delete Prompt
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

      // Duplicate Prompt
      duplicatePrompt: {
        parentObj: this,
        secondaryButton: {
          name: 'Close'
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
            shortcut: 'Delete',
            optionFunction: this.onDelete
          }
        ]
      }
    }


    this.filtersSearchOptions = {
      multiselectable: false,
      verifyAddEdit: true,

      // Delete Prompt
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

      // Duplicate Prompt
      duplicatePrompt: {
        parentObj: this,
        secondaryButton: {
          name: 'Close'
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
            shortcut: 'Delete',
            optionFunction: this.onDelete
          }
        ]
      }
    }
  }

  onOpen(): void {
    if (this.filtersService.filters.length == 0) {
      this.dataService.get<Array<Filter>>('api/Filters')
        .subscribe((filters: Array<Filter>) => {
          filters.forEach(x => {
            this.filtersService.filters.push({
              id: x.id,
              name: x.name,
              hierarchyGroupID: 0,
              hidden: false,
              arrowDown: false
            })
          })
        })
    } else {
      this.filtersHierarchy.listManager.collapseHierarchy();
      this.filtersService.filters.forEach(x => {
        x.selectType = null!;
        x.selected = false;
      })
    }
  }



  onEdit() {
    if (!this.searchMode) {
      this.filtersHierarchy.edit();
    } else {
      this.filtersSearch.edit();
    }
  }


  onDelete() {
    if (!this.searchMode) {
      this.filtersHierarchy.delete();
    } else {
      this.filtersSearch.delete();
    }
  }


  toggleSearch() {
    this.searchMode = !this.searchMode;

    // If we're in hierarchy mode
    if (!this.searchMode) {
      window.setTimeout(() => {
        if (this.editedSearchItem) {
          this.filtersHierarchy.listManager.sort(this.editedSearchItem);
        }
        
        this.searchInputSubscription.unsubscribe();
        const selectedItem = this.filtersService.filters.filter(x => x.selectType != null || x.selected == true)[0];
        if (selectedItem) {
          this.filtersHierarchy.listManager.onItemDown(selectedItem);
        }
      })

      // If we're in search mode
    } else {

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
    }
  }



  onFiltersHierarchyUpdate(filtersHierarchyUpdate: HierarchyUpdate) {
    this._filtersHierarchyUpdate = filtersHierarchyUpdate;
    if (filtersHierarchyUpdate.type == ListUpdateType.Add) this.onHierarchyFilterAdd(filtersHierarchyUpdate);
    if (filtersHierarchyUpdate.type == ListUpdateType.Edit) this.onHierarchyFilterEdit(filtersHierarchyUpdate);
    if (filtersHierarchyUpdate.type == ListUpdateType.VerifyAddEdit) this.onHierarchyFilterVerify(filtersHierarchyUpdate);
    if (filtersHierarchyUpdate.type == ListUpdateType.ArrowClicked) this.onArrowClick(filtersHierarchyUpdate);
    if (filtersHierarchyUpdate.type == ListUpdateType.SelectedItems) this.onSelectedHierarchyFilter(filtersHierarchyUpdate);
    if (filtersHierarchyUpdate.type == ListUpdateType.DeletePrompt) this.onHierarchyFilterDeletePrompt(filtersHierarchyUpdate.deletedItems![0]);
    if (filtersHierarchyUpdate.type == ListUpdateType.Delete) this.onHierarchyFilterDelete(filtersHierarchyUpdate.deletedItems![0]);
  }


  onFiltersSearchUpdate(filtersSearchUpdate: MultiColumnListUpdate) {
    this._filtersSearchUpdate = filtersSearchUpdate;
    if (filtersSearchUpdate.type == ListUpdateType.Edit) this.onSearchFilterEdit(filtersSearchUpdate);
    if (filtersSearchUpdate.type == ListUpdateType.VerifyAddEdit) this.onSearchFilterVerify(filtersSearchUpdate);
    if (filtersSearchUpdate.type == ListUpdateType.SelectedItems) this.onSelectedSearchFilter(filtersSearchUpdate);
    if (filtersSearchUpdate.type == ListUpdateType.DeletePrompt) this.onSearchFilterDeletePrompt(filtersSearchUpdate.deletedMultiColumnItems![0]);
    if (filtersSearchUpdate.type == ListUpdateType.Delete) this.onSearchFilterDelete(filtersSearchUpdate.deletedMultiColumnItems![0]);
  }


  onHierarchyFilterAdd(filtersHierarchyUpdate: HierarchyUpdate) {
    // Add Filter
    if (filtersHierarchyUpdate.hierarchyGroupID == 0) {
      this.dataService.post<number>('api/Filters', {
        name: filtersHierarchyUpdate.name
      }).subscribe((id: number) => {
        this.filtersService.filters[filtersHierarchyUpdate.index!].id = id;
      });
    }

    // Add Filter Option
    if (filtersHierarchyUpdate.hierarchyGroupID == 1) {
      this.dataService.post<number>('api/Filters/Options', {
        id: this.filtersService.filters[this.filtersHierarchy.listManager.getIndexOfHierarchyItemParent(this.filtersService.filters[filtersHierarchyUpdate.index!])].id,
        name: filtersHierarchyUpdate.name
      }).subscribe((id: number) => {
        this.filtersService.filters[filtersHierarchyUpdate.index!].id = id;
      })
    }
  }


  onHierarchyFilterEdit(filtersHierarchyUpdate: HierarchyUpdate) {
    // Edit Filter
    if (filtersHierarchyUpdate.hierarchyGroupID == 0) {
      this.dataService.put('api/Filters', {
        id: filtersHierarchyUpdate.id,
        name: filtersHierarchyUpdate.name
      }).subscribe();
    }

    // Edit Filter Option
    if (filtersHierarchyUpdate.hierarchyGroupID == 1) {
      this.dataService.put('api/Filters/Options', {
        id: filtersHierarchyUpdate.id,
        name: filtersHierarchyUpdate.name
      }).subscribe();
    }
  }


  onSearchFilterEdit(filtersSearchUpdate: MultiColumnListUpdate) {
    if (filtersSearchUpdate.values![1].name == 'Filter') {
      this.dataService.put('api/Filters', {
        id: filtersSearchUpdate.id,
        name: filtersSearchUpdate.values![0].name
      }).subscribe(() => {
        this.editedSearchItem = this.filtersService.filters.find(x => x.id == filtersSearchUpdate.id && x.hierarchyGroupID == 0)!;
        if (this.editedSearchItem) {
          this.editedSearchItem.name = filtersSearchUpdate.values![0].name;
        }
      });
    }

    if (filtersSearchUpdate.values![1].name == 'Option') {
      this.dataService.put('api/Filters/Options', {
        id: filtersSearchUpdate.id,
        name: filtersSearchUpdate.values![0].name
      }).subscribe(() => {
        this.editedSearchItem = this.filtersService.filters.find(x => x.id == filtersSearchUpdate.id && x.hierarchyGroupID == 1)!;
        if (this.editedSearchItem) {
          this.editedSearchItem.name = filtersSearchUpdate.values![0].name;
        }
      });
    }
  }


  onHierarchyFilterVerify(filtersHierarchyUpdate: HierarchyUpdate) {
    let matchFound: boolean = false;

    // If we're verifying a filter
    if (filtersHierarchyUpdate.hierarchyGroupID == 0) {
      // Loop through each filter and check for a duplicate
      this.filtersService.filters.forEach(x => {
        if (x.hierarchyGroupID == 0) {
          if (x.name?.toLowerCase() == filtersHierarchyUpdate.name?.toLowerCase()) {
            matchFound = true;
          }
        }
      })

      // If no match was found
      if (!matchFound) {
        this.filtersHierarchy.commitAddEdit();

        // If a match was found
      } else {
        this.filtersHierarchyOptions.duplicatePrompt!.title = 'Duplicate Filter';
        this.filtersHierarchyOptions.duplicatePrompt!.message = this.sanitizer.bypassSecurityTrustHtml('A filter with the name <span style="color: #ffba00">\'' + filtersHierarchyUpdate.name + '\'</span> already exists.');
        this.filtersHierarchy.openDuplicatePrompt();
      }
    }

    // If we're verifying a filter option
    if (filtersHierarchyUpdate.hierarchyGroupID == 1) {
      const filterOption = this.filtersService.filters.find(x => x.id == filtersHierarchyUpdate.id);
      const indexOfParentFilter = this.filtersHierarchy.listManager.getIndexOfHierarchyItemParent(filterOption!);

      // Loop through each filter option of the parent filter and check for a duplicate
      for (let i = indexOfParentFilter + 1; i < this.filtersService.filters.length; i++) {
        if (this.filtersService.filters[i].hierarchyGroupID == 0) break;
        if (this.filtersService.filters[i].name?.toLowerCase() == filtersHierarchyUpdate.name?.toLowerCase()) {
          matchFound = true;
        }
      }

      // If no match was found
      if (!matchFound) {
        this.filtersHierarchy.commitAddEdit();

        // If a match was found
      } else {
        this.filtersHierarchyOptions.duplicatePrompt!.title = 'Duplicate Filter Option';
        this.filtersHierarchyOptions.duplicatePrompt!.message = this.sanitizer.bypassSecurityTrustHtml('The filter <span style="color: #ffba00">' + this.filtersService.filters[indexOfParentFilter].name + '</span> already contains a filter option with the name <span style="color: #ffba00">' + filtersHierarchyUpdate.name + '</span>.');
        this.filtersHierarchy.openDuplicatePrompt();
      }
    }
  }


  onSearchFilterVerify(filtersSearchUpdate: MultiColumnListUpdate) {
    let matchFound: boolean = false;

    // If we're verifying a filter
    if (filtersSearchUpdate.values![1].name == 'Filter') {
      // Loop through each filter and check for a duplicate
      this.filtersService.filters.forEach(x => {
        if (x.hierarchyGroupID == 0) {
          if (x.name?.toLowerCase() == filtersSearchUpdate.name?.toLowerCase()) {
            matchFound = true;
          }
        }
      })

      // If no match was found
      if (!matchFound) {
        this.filtersSearch.commitAddEdit();

        // If a match was found
      } else {
        this.filtersSearchOptions.duplicatePrompt!.title = 'Duplicate Filter';
        this.filtersSearchOptions.duplicatePrompt!.message = this.sanitizer.bypassSecurityTrustHtml('A filter with the name <span style="color: #ffba00">\'' + filtersSearchUpdate.name + '\'</span> already exists.');
        this.filtersSearch.openDuplicatePrompt();
      }
    }

    // If we're verifying a filter option
    if (filtersSearchUpdate.values![1].name == 'Option') {

      // Query the database to check for a duplicate
      this.dataService.get<{ id: null, name: null, filterId: null }>('api/Filters/CheckDuplicate', [{ key: 'filterOptionId', value: filtersSearchUpdate.id }, { key: 'filterOptionName', value: filtersSearchUpdate.name }])
        .subscribe((item: { id: null, name: null, filterId: null }) => {

          // If no match was found
          if (item == null) {
            this.filtersSearch.commitAddEdit();

            // If a match was found
          } else {
            const filter = this.filtersService.filters.find(x => x.hierarchyGroupID == 0 && x.id == item.filterId);
            this.filtersSearchOptions.duplicatePrompt!.title = 'Duplicate Filter Option';
            this.filtersSearchOptions.duplicatePrompt!.message = this.sanitizer.bypassSecurityTrustHtml('The filter <span style="color: #ffba00">' + filter!.name + '</span> already contains a filter option with the name <span style="color: #ffba00">' + filtersSearchUpdate.name + '</span>.');
            this.filtersSearch.openDuplicatePrompt();
          }
        })
    }
  }


  onArrowClick(filtersHierarchyUpdate: HierarchyUpdate) {
    // If a filter was expanded and its children hasn't been loaded yet
    if (filtersHierarchyUpdate.arrowDown && !filtersHierarchyUpdate.hasChildren) {
      this.dataService.get<Array<FilterOption>>('api/Filters/Options', [{ key: 'filterId', value: filtersHierarchyUpdate.id }])
        .subscribe((filterOptions: Array<FilterOption>) => {

          let num = this.filtersHierarchy.listManager.editedItem ? 2 : 1;

          for (let i = filterOptions.length - 1; i >= 0; i--) {
            this.filtersService.filters.splice(filtersHierarchyUpdate.index! + num, 0,
              {
                id: filterOptions[i].id,
                name: filterOptions[i].name,
                hierarchyGroupID: 1,
                hidden: false,
                arrowDown: false,
                isParent: false
              }
            )
          }
        })
    }
  }


  onSelectedHierarchyFilter(filtersHierarchyUpdate: HierarchyUpdate) {
    if (filtersHierarchyUpdate.selectedItems![0].hierarchyGroupID == 0) {
      this.addButtonTitle = 'Add Filter Option';
      this.editButtonTitle = 'Edit Filter';
      this.deleteButtonTitle = 'Delete Filter';
      this.filtersHierarchyOptions.menu!.menuOptions[0].name = 'Add Filter';
      this.filtersHierarchyOptions.menu!.menuOptions[0].optionFunction = this.addFilter;
      this.filtersHierarchyOptions.menu!.menuOptions[1].hidden = false;
      this.filtersHierarchyOptions.menu!.menuOptions[1].name = 'Add Filter Option';
      this.filtersHierarchyOptions.menu!.menuOptions[1].optionFunction = this.addFilterOptionBelow;
      this.filtersHierarchyOptions.menu!.menuOptions[2].name = 'Rename Filter';
      this.filtersHierarchyOptions.menu!.menuOptions[3].name = 'Delete Filter';
    }

    if (filtersHierarchyUpdate.selectedItems![0].hierarchyGroupID == 1) {
      this.addButtonTitle = 'Add Filter Option';
      this.editButtonTitle = 'Edit Filter Option';
      this.deleteButtonTitle = 'Delete Filter Option';
      this.filtersHierarchyOptions.menu!.menuOptions[0].name = 'Add Filter Option';
      this.filtersHierarchyOptions.menu!.menuOptions[0].optionFunction = this.addFilterOption;
      this.filtersHierarchyOptions.menu!.menuOptions[1].hidden = true;
      this.filtersHierarchyOptions.menu!.menuOptions[2].name = 'Rename Filter Option';
      this.filtersHierarchyOptions.menu!.menuOptions[3].name = 'Delete Filter Option';
    }
  }

  onSelectedSearchFilter(filtersSearchUpdate: MultiColumnListUpdate) {
    this.editButtonTitle = 'Edit ' + (filtersSearchUpdate.selectedMultiColumnItems![0].values[1].name == 'Filter' ? 'Filter' : 'Filter Optiion');
    this.deleteButtonTitle = 'Delete ' + (filtersSearchUpdate.selectedMultiColumnItems![0].values[1].name == 'Filter' ? 'Filter' : 'Filter Optiion');
    this.filtersSearchOptions.menu!.menuOptions[0].name = 'Rename ' + (filtersSearchUpdate.selectedMultiColumnItems![0].values[1].name == 'Filter' ? 'Filter' : 'Filter Optiion');
    this.filtersSearchOptions.menu!.menuOptions[1].name = 'Delete ' + (filtersSearchUpdate.selectedMultiColumnItems![0].values[1].name == 'Filter' ? 'Filter' : 'Filter Optiion');
  }


  addFilter() {
    this.filtersHierarchy.listManager.selectedItem = null!
    this.filtersHierarchy.add();
  }


  addFilterOptionBelow() {
    this.filtersHierarchy.add();
  }

  addFilterOption() {
    this.filtersHierarchy.add();
  }


  onHierarchyFilterDeletePrompt(deletedItem: HierarchyItem) {
    // If we're deleting a filter
    if (deletedItem.hierarchyGroupID == 0) {
      this.filtersHierarchyOptions.deletePrompt!.title = 'Delete Filter';
      this.filtersHierarchyOptions.deletePrompt!.message = this.sanitizer.bypassSecurityTrustHtml(
        '<div style="margin-bottom: 21px; display: flex">' +
        '<div style="color: #b4b4b4; width: fit-content; padding-right: 4px; flex-shrink: 0;">Filter:</div>' +
        '<div style="color: #ffba00">' + deletedItem.name + '</div>' +
        '</div>' +

        'Are you sure you want to delete the filter listed above and its contents?'
      );
    }

    // If we're deleting a filter option
    if (deletedItem.hierarchyGroupID == 1) {
      this.filtersHierarchyOptions.deletePrompt!.title = 'Delete Filter Option';
      this.filtersHierarchyOptions.deletePrompt!.message = this.sanitizer.bypassSecurityTrustHtml(
        '<div style="margin-bottom: 21px; display: flex">' +
        '<div style="color: #b4b4b4; width: fit-content; padding-right: 4px; flex-shrink: 0;">Filter Option:</div>' +
        '<div style="color: #ffba00">' + deletedItem.name + '</div>' +
        '</div>' +

        ' Are you sure you want to delete the filter option listed above?'
      );
    }
  }


  onSearchFilterDeletePrompt(deletedItem: MultiColumnItem) {
    // If we're deleting a filter
    if (deletedItem.values[1].name == 'Filter') {
      this.filtersSearchOptions.deletePrompt!.title = 'Delete Filter';
      this.filtersSearchOptions.deletePrompt!.message = this.sanitizer.bypassSecurityTrustHtml(

        '<div style="margin-bottom: 21px; display: flex">' +
        '<div style="color: #b4b4b4; width: fit-content; padding-right: 4px; flex-shrink: 0;">Filter:</div>' +
        '<div style="color: #ffba00">' + deletedItem.values[0].name + '</div>' +
        '</div>' +

        'Are you sure you want to delete the filter listed above and its contents?'
      );
    }

    // If we're deleting a filter option
    if (deletedItem.values[1].name == 'Option') {
      this.filtersSearchOptions.deletePrompt!.title = 'Delete Filter Option';
      this.filtersSearchOptions.deletePrompt!.message = this.sanitizer.bypassSecurityTrustHtml(

        '<div style="margin-bottom: 21px; display: flex">' +
        '<div style="color: #b4b4b4; width: fit-content; padding-right: 4px; flex-shrink: 0;">Filter Option:</div>' +
        '<div style="color: #ffba00">' + deletedItem.values[0].name + '</div>' +
        '</div>' +

        ' Are you sure you want to delete the filter option listed above?'
      );
    }
  }


  onHierarchyFilterDelete(deletedItem: HierarchyItem) {
    if (deletedItem.hierarchyGroupID == 0) {
      this.dataService.delete('api/Filters', {
        id: deletedItem.id
      }).subscribe();
    }


    if (deletedItem.hierarchyGroupID == 1) {
      this.dataService.delete('api/Filters/Options', {
        id: deletedItem.id
      }).subscribe();
    }
  }


  onSearchFilterDelete(deletedItem: MultiColumnItem) {
    if (deletedItem.values[1].name == 'Filter') {
      this.dataService.delete('api/Filters', {
        id: deletedItem.id
      }).subscribe();
    }


    if (deletedItem.values[1].name == 'Option') {
      this.dataService.delete('api/Filters/Options', {
        id: deletedItem.id
      }).subscribe();
    }


    // Remove the deleted search filter from the filters hierarchy as well
    const index = this.filtersService.filters.findIndex(x => x.id == deletedItem.id && x.name == deletedItem.values[0].name);
    this.filtersService.filters.splice(index, 1)
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

    this.dataService.get<Array<MultiColumnItem>>('api/Filters/Search', [{ key: 'searchWords', value: value }])
      .subscribe((searchList: Array<MultiColumnItem>) => {

        searchList.forEach(x => {
          this.searchList.push({

            id: x.id,
            values: [{ name: x.name!, width: '246px', allowEdit: true }, { name: 'Filter', width: '55px' }]
          })
        })
      });


    this.dataService.get<Array<MultiColumnItem>>('api/Filters/Options/Search', [{ key: 'searchWords', value: value }])
      .subscribe((searchList: Array<MultiColumnItem>) => {

        searchList.forEach(x => {
          this.searchList.push({

            id: x.id,
            values: [{ name: x.name!, width: '246px', allowEdit: true }, { name: 'Option', width: '55px' }]
          })
        })
      });
  }



  isDisabled(disabledUpdateProperty: keyof HierarchyUpdate | keyof MultiColumnListUpdate): boolean {
    // If we're in hierarchy mode
    if (!this.searchMode) {

      // As long as filters hierarchy update is not null
      if (this.filtersHierarchyUpdate) {
        // Update it
        let filtersHierarchyDisabledUpdateProperty = disabledUpdateProperty as keyof HierarchyUpdate;
        return this.filtersHierarchyUpdate[filtersHierarchyDisabledUpdateProperty] as boolean;
      }

      // If we're in search mode
    } else if (this.searchMode && this.searchList.length > 0) {

      // As long as filters search update is not null
      if (this.filtersSearchUpdate) {
        // Update it
        let filtersSearchDisabledUpdateProperty = disabledUpdateProperty as keyof MultiColumnListUpdate;
        return this.filtersSearchUpdate[filtersSearchDisabledUpdateProperty] as boolean;
      }
    }
    // Otherwise, set as disabled
    return true;
  }


  onEscape(): void {
    if (

      // Filters Hierarchy
      (!this.searchMode &&
        this.filtersHierarchy.listManager.selectedItem == null &&
        this.filtersHierarchy.listManager.editedItem == null &&
        !this.filtersHierarchy.listManager.promptOpen)

      ||

      // Filters Search No Results
      (this.searchMode && this.searchList.length == 0)

      ||

      // Filters Search With Results
      (this.searchMode && this.searchList.length > 0 &&
        this.filtersSearch.listManager.selectedItem == null &&
        this.filtersSearch.listManager.editedItem == null &&
        !this.filtersSearch.listManager.promptOpen))

      this.close();
  }
}