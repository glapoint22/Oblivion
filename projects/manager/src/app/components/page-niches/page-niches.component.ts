import { Component, OnInit } from '@angular/core';
import { PageNichesUpdateManager } from '../../classes/page-niches-update-manager';

@Component({
  selector: 'page-niches',
  templateUrl: './page-niches.component.html',
  styleUrls: ['./page-niches.component.scss']
})
export class PageNichesComponent extends PageNichesUpdateManager implements OnInit {

  ngOnInit() {
    super.ngOnInit();
    this.onOpen();
  }
}