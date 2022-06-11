import { Component, Input, SimpleChanges } from '@angular/core';
import { Item } from '../../classes/item';
import { SearchKeywordsUpdateManager } from '../../classes/search-keywords-update-manager';

@Component({
  selector: 'search-keywords',
  templateUrl: './search-keywords.component.html',
  styleUrls: ['./search-keywords.component.scss']
})
export class SearchKeywordsComponent extends SearchKeywordsUpdateManager {
  @Input() pageReferenceItems!: Array<Item>;


  ngOnChanges(changes: SimpleChanges): void {
    this.thisArray = this.pageReferenceItems;
  }
}