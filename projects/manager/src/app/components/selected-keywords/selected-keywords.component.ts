import { Component } from '@angular/core';
import { SelectedKeywordsUpdateManager } from '../../classes/selected-keywords-update-manager';

@Component({
  selector: 'selected-keywords',
  templateUrl: './selected-keywords.component.html',
  styleUrls: ['./selected-keywords.component.scss']
})
export class SelectedKeywordsComponent extends SelectedKeywordsUpdateManager { }