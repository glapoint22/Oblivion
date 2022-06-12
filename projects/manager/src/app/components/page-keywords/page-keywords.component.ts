import { Component, OnInit } from '@angular/core';
import { PageKeywordsUpdateManager } from '../../classes/page-keywords-update-manager';

@Component({
  selector: 'page-keywords',
  templateUrl: './page-keywords.component.html',
  styleUrls: ['./page-keywords.component.scss']
})
export class PageKeywordsComponent extends PageKeywordsUpdateManager implements OnInit {

  ngOnInit() {
    super.ngOnInit();
    this.onOpen();
  }
}