import { Component } from '@angular/core';
import { BrowseNichesUpdateManager } from '../../classes/browse-niches-update-manager';

@Component({
  selector: 'browse-niches',
  templateUrl: './browse-niches.component.html',
  styleUrls: ['./browse-niches.component.scss']
})
export class BrowseNichesComponent extends BrowseNichesUpdateManager {
  ngOnInit() {
    super.ngOnInit();

    this.onOpen();
  }
}