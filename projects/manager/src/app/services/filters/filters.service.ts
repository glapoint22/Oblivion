import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService } from 'common';
import { HierarchyItem } from '../../classes/hierarchy-item';
import { HierarchyComponent } from '../../components/hierarchies/hierarchy/hierarchy.component';

@Injectable({
  providedIn: 'root'
})
export class FiltersService {
  public formFilters: Array<HierarchyItem> = new Array<HierarchyItem>();
  public productFilters: Array<HierarchyItem> = new Array<HierarchyItem>();
  public otherEditedFilters: Array<HierarchyItem> = new Array<HierarchyItem>();
  public filtersFormHierarchyComponent!: HierarchyComponent;
  public productFiltersHierarchyComponent!: HierarchyComponent;
  public targetFiltersType!: FiltersType;
  constructor(public dataService: DataService, public sanitizer: DomSanitizer) { }
}

export enum FiltersType {
  FilterForm,
  ProductFilters
}