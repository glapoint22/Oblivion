import { Injectable } from '@angular/core';
import { KeywordCheckboxItem } from '../../classes/keyword-checkbox-item';
import { MultiColumnItem } from '../../classes/multi-column-item';
import { HierarchyComponent } from '../../components/hierarchies/hierarchy/hierarchy.component';
import { HierarchyUpdateService } from '../hierarchy-update/hierarchy-update.service';

@Injectable({
  providedIn: 'root'
})
export class KeywordsService extends HierarchyUpdateService {
  public sortList: Array<KeywordCheckboxItem> = new Array<KeywordCheckboxItem>();
  public selectedKeywordsArray: Array<KeywordCheckboxItem> = new Array<KeywordCheckboxItem>();
  public selectedKeywordsSearchList: Array<MultiColumnItem> = new Array<MultiColumnItem>();
  public availableSearchList: Array<MultiColumnItem> = new Array<MultiColumnItem>();
  public selectedHierarchyComponent!: HierarchyComponent;
}