import { Component, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService, LazyLoad, LazyLoadingService } from 'common';
import { ListUpdateType } from '../../classes/enums';
import { Filter } from '../../classes/filter';
import { FilterOption } from '../../classes/filter-option';
import { HierarchyUpdate } from '../../classes/hierarchy-update';
import { ListOptions } from '../../classes/list-options';
import { FiltersService } from '../../services/filters/filters.service';
import { HierarchyComponent } from '../hierarchies/hierarchy/hierarchy.component';

@Component({
  selector: 'filter-form',
  templateUrl: './filter-form.component.html',
  styleUrls: ['./filter-form.component.scss']
})
export class FilterFormComponent extends LazyLoad {
  // private
  private _filtersUpdate!: HierarchyUpdate;

  // Public
  public isParent!: boolean;
  public filtersOptions: ListOptions = new ListOptions();
  public get filtersUpdate(): HierarchyUpdate { return this._filtersUpdate; }
  public set filtersUpdate(filtersUpdate: HierarchyUpdate) { this.onFiltersUpdate(filtersUpdate); }

  // Decorators
  @ViewChild('filtersHierarchy') filtersHierarchy!: HierarchyComponent;

  // Constructor
  constructor(lazyLoadingService: LazyLoadingService,
    private dataService: DataService,
    private sanitizer: DomSanitizer,
    public filtersService: FiltersService) {
    super(lazyLoadingService);
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();

    this.filtersOptions = {
      verifyAddEdit: true,
      duplicatePrompt: {
        parentObj: this,
        title: 'Duplicate',
        message: 'Duplicate Item',
        secondaryButton: {
          name: 'Close'
        }
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



  onFiltersUpdate(filtersUpdate: HierarchyUpdate) {
    this._filtersUpdate = filtersUpdate;
    if (filtersUpdate.type == ListUpdateType.Add) this.onFilterAdd(filtersUpdate);
    if (filtersUpdate.type == ListUpdateType.VerifyAddEdit) this.onVerifyAddEdit(filtersUpdate);
    if (filtersUpdate.type == ListUpdateType.ArrowClicked) this.onArrowClick(filtersUpdate);
  }


  onFilterAdd(filtersUpdate: HierarchyUpdate) {
    // console.log(filtersUpdate)
  }


  onVerifyAddEdit(filtersUpdate: HierarchyUpdate) {
    let matchFound: boolean = false;

    // If we're verifying a filter
    if (filtersUpdate.hierarchyGroupID == 0) {
      // Loop through each filter and check for a duplicate
      this.filtersHierarchy.sourceList.forEach(x => {
        if (x.hierarchyGroupID == 0) {
          if (x.name?.toLowerCase() == filtersUpdate.name?.toLowerCase()) {
            matchFound = true;
          }
        }
      })

      if (!matchFound) {
        this.filtersHierarchy.commitAddEdit();
      } else {
        this.filtersOptions.duplicatePrompt!.title = 'Duplicate Filter';
        this.filtersOptions.duplicatePrompt!.message = this.sanitizer.bypassSecurityTrustHtml('A filter with the name <span style="color: #ffba00">\'' + filtersUpdate.name + '\'</span> already exists.');
        this.filtersHierarchy.openDuplicatePrompt();
      }
    }

    // If we're verifying a filter option
    if (filtersUpdate.hierarchyGroupID == 1) {
      const filterOption = this.filtersHierarchy.sourceList.find(x => x.id == filtersUpdate.id);
      const indexOfParentFilter = this.filtersHierarchy.listManager.getIndexOfHierarchyItemParent(filterOption!);

      // Loop through each filter option of the parent filter and check for a duplicate
      for (let i = indexOfParentFilter + 1; i < this.filtersHierarchy.sourceList.length; i++) {
        if (this.filtersHierarchy.sourceList[i].hierarchyGroupID == 0) break;
        if (this.filtersHierarchy.sourceList[i].name?.toLowerCase() == filtersUpdate.name?.toLowerCase()) {
          matchFound = true;
        }
      }

      if (!matchFound) {
        this.filtersHierarchy.commitAddEdit();
      } else {
        this.filtersOptions.duplicatePrompt!.title = 'Duplicate Filter Option';
        this.filtersOptions.duplicatePrompt!.message = this.sanitizer.bypassSecurityTrustHtml('A filter option with the name <span style="color: #ffba00">\'' + filtersUpdate.name + '\'</span> from the filter <span style="color: #ffba00">\'' + this.filtersHierarchy.sourceList[indexOfParentFilter].name + '\'</span> already exists.');
        this.filtersHierarchy.openDuplicatePrompt();
      }
    }
  }


  onArrowClick(filtersUpdate: HierarchyUpdate) {
    // If a filter was expanded and its children hasn't been loaded yet
    if (filtersUpdate.arrowDown && !filtersUpdate.hasChildren) {
      this.dataService.get<Array<FilterOption>>('api/Filters/Options', [{ key: 'filterId', value: filtersUpdate.id }])
        .subscribe((filterOptions: Array<FilterOption>) => {

          let num = this.filtersHierarchy.listManager.editedItem ? 2 : 1;

          for (let i = filterOptions.length - 1; i >= 0; i--) {
            this.filtersService.filters.splice(filtersUpdate.index! + num, 0,
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


  onEscape(): void {
    if (this.filtersHierarchy.listManager.selectedItem == null && this.filtersHierarchy.listManager.editedItem == null && !this.filtersHierarchy.listManager.promptOpen) {
      this.close();
    }
  }
}