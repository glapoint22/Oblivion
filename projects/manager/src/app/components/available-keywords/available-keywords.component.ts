import { Component } from '@angular/core';
import { AvailableKeywordsUpdateManager } from '../../classes/available-keywords-update-manager';

@Component({
  selector: 'available-keywords',
  templateUrl: './available-keywords.component.html',
  styleUrls: ['./available-keywords.component.scss']
})
export class AvailableKeywordsComponent extends AvailableKeywordsUpdateManager { }