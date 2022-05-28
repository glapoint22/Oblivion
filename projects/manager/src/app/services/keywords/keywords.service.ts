import { Injectable } from '@angular/core';
import { KeywordCheckboxItem } from '../../classes/keyword-checkbox-item';
import { MultiColumnItem } from '../../classes/multi-column-item';
import { HierarchyComponent } from '../../components/hierarchies/hierarchy/hierarchy.component';
import { ListUpdateService } from '../list-update/list-update.service';

@Injectable({
  providedIn: 'root'
})
export class KeywordsService extends ListUpdateService {
  public sortList: Array<KeywordCheckboxItem> = new Array<KeywordCheckboxItem>();
  public selectedKeywordsArray: Array<KeywordCheckboxItem> = new Array<KeywordCheckboxItem>();
  public selectedKeywordsSearchList: Array<MultiColumnItem> = new Array<MultiColumnItem>();
  public availableSearchList: Array<MultiColumnItem> = new Array<MultiColumnItem>();
  public selectedHierarchyComponent!: HierarchyComponent;
}