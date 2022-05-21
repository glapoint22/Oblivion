import { Injectable } from '@angular/core';
import { KeywordCheckboxItem } from '../../classes/selected-keywords-manager';
import { ListUpdateService } from '../list-update/list-update.service';

@Injectable({
  providedIn: 'root'
})
export class KeywordsService extends ListUpdateService {}