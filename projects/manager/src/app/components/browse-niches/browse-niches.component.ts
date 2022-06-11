import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BrowseNichesUpdateManager } from '../../classes/browse-niches-update-manager';
import { Item } from '../../classes/item';

@Component({
  selector: 'browse-niches',
  templateUrl: './browse-niches.component.html',
  styleUrls: ['./browse-niches.component.scss']
})
export class BrowseNichesComponent extends BrowseNichesUpdateManager implements OnChanges {
  @Input() pageReferenceItems!: Array<Item>;


  ngOnChanges(changes: SimpleChanges): void {
    this.thisArray = this.pageReferenceItems;
  }
}