import { Component } from '@angular/core';
import { Background, PageComponent, PageContent } from 'widgets';

@Component({
  selector: 'page-dev',
  templateUrl: './page-dev.component.html',
  styleUrls: ['./page-dev.component.scss']
})
export class PageDevComponent extends PageComponent {

  newPage() {
    this.pageContent = new PageContent();
    this.pageContent.name = 'Untitled';
    this.pageContent.background = new Background();
  }
}