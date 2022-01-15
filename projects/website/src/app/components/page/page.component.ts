import { AfterViewInit, Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { Page } from '../../classes/page';
import { ContainerComponent } from '../container/container.component';

@Component({
  selector: 'page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements AfterViewInit, OnDestroy {
  @Input() page!: Page;
  @ViewChild('container', { static: false }) container!: ContainerComponent;

  ngAfterViewInit(): void {
    let page = new Page(this.page);
    page.container = this.container;

    // Background color
    if (page.background.color) {
      document.body.style.backgroundColor = page.background.color;
    }

    // Background image
    if (page.background.image && page.background.image.url) {
      // Image
      document.body.style.backgroundImage = 'url(images/' + page.background.image.url + ')';

      // Position
      document.body.style.backgroundPosition = page.background.image.position;

      // Repeat
      document.body.style.backgroundRepeat = page.background.image.repeat;

      // Attachment
      document.body.style.backgroundAttachment = page.background.image.attachment;
    }
  }


  ngOnDestroy(): void {
    // Reset the background
    document.body.style.backgroundColor = '';
    document.body.style.backgroundImage = '';
    document.body.style.backgroundPosition = '';
    document.body.style.backgroundRepeat = '';
    document.body.style.backgroundAttachment = '';
  }
}