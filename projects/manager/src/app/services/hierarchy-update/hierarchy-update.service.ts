import { Injectable } from '@angular/core';
import { HierarchyItem } from '../../classes/hierarchy-item';
import { MultiColumnItem } from '../../classes/multi-column-item';
import { HierarchyComponent } from '../../components/hierarchies/hierarchy/hierarchy.component';

@Injectable({
  providedIn: 'root'
})
export class HierarchyUpdateService {
  public formArray: Array<HierarchyItem> = new Array<HierarchyItem>();
  public formSearchList: Array<MultiColumnItem> = new Array<MultiColumnItem>();
  public productArray: Array<HierarchyItem> = new Array<HierarchyItem>();
  public productSearchList: Array<MultiColumnItem> = new Array<MultiColumnItem>();
}