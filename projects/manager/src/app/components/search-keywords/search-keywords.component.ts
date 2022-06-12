import { Component } from '@angular/core';
import { SearchKeywordsUpdateManager } from '../../classes/search-keywords-update-manager';

@Component({
  selector: 'search-keywords',
  templateUrl: './search-keywords.component.html',
  styleUrls: ['./search-keywords.component.scss']
})
export class SearchKeywordsComponent extends SearchKeywordsUpdateManager {
  ngOnInit() {
    super.ngOnInit();

    this.onOpen();
  }
}