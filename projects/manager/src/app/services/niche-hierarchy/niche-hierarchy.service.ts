import { Injectable } from '@angular/core';
import { HierarchyItem } from '../../classes/hierarchy-item';
import { ListUpdateService } from '../list-update/list-update.service';

@Injectable({
  providedIn: 'root'
})
export class NicheHierarchyService extends ListUpdateService {
  // public niches: Array<HierarchyItem> = new Array<HierarchyItem>();
}