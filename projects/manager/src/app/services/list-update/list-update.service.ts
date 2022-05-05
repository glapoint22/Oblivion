import { Injectable } from '@angular/core';
import { SortType } from '../../classes/enums';
import { HierarchyItem } from '../../classes/hierarchy-item';
import { HierarchyComponent } from '../../components/hierarchies/hierarchy/hierarchy.component';

@Injectable({
  providedIn: 'root'
})
export class ListUpdateService {
  public formArray: Array<HierarchyItem> = new Array<HierarchyItem>();
  public productArray: Array<HierarchyItem> = new Array<HierarchyItem>();
  public otherSortList: Array<HierarchyItem> = new Array<HierarchyItem>();
  public formHierarchyComponent!: HierarchyComponent;
  public productHierarchyComponent!: HierarchyComponent;
  public targetSortType!: SortType;
}