import { Component, ViewChild } from '@angular/core';
import { LazyLoad, LazyLoadingService } from 'common';
import { FiltersService } from '../../services/filters/filters.service';
import { HierarchyComponent } from '../hierarchies/hierarchy/hierarchy.component';
import { MultiColumnListComponent } from '../lists/multi-column-list/multi-column-list.component';

@Component({
  selector: 'filter-form',
  templateUrl: './filter-form.component.html',
  styleUrls: ['./filter-form.component.scss']
})
export class FilterFormComponent extends LazyLoad {
  @ViewChild('filtersHierarchy') filtersHierarchy!: HierarchyComponent;
  @ViewChild('filtersSearch') filtersSearch!: MultiColumnListComponent;

  constructor(lazyLoadingService: LazyLoadingService, public filtersService: FiltersService) {
    super(lazyLoadingService);
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.filtersService.ngAfterViewInit();
    this.filtersService.filtersSearch = this.filtersSearch;
    this.filtersService.filtersHierarchy = this.filtersHierarchy;
    this.filtersService.getSearchInput.subscribe(()=> {
      this.filtersService.searchInput = document.getElementById('searchInput') as HTMLInputElement;
    })
    this.filtersService.onClose.subscribe(()=> {
      this.close();
    })
  }

  onOpen(): void {
    this.filtersService.onOpen();
  }

  onEscape(): void {
    this.filtersService.onEscape();
  }
}