import { KeyValue } from '@angular/common';
import { Injectable } from '@angular/core';
import { Filters } from '../../classes/filters';

@Injectable({
  providedIn: 'root'
})
export class GridWidgetSideMenuService {
  public filters!: Filters;
  public selectedSortOption!: KeyValue<string, string>;
  public sortOptions!: Array<KeyValue<string, string>>;
}