import { Injectable } from '@angular/core';
import { HierarchyItem } from '../../classes/hierarchy-item';

@Injectable({
  providedIn: 'root'
})
export class NicheHierarchyService {
  public niches: Array<HierarchyItem> = new Array<HierarchyItem>();
}