import { AfterViewInit, Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { PageContent } from '../../classes/page-content';
import { Row } from '../../classes/row';
import { ContainerComponent } from '../container/container.component';

@Component({
  selector: 'page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements AfterViewInit, OnDestroy {
  @Input() pageContent!: PageContent;
  @ViewChild('container', { static: false }) container!: ContainerComponent;

  ngOnChanges() {
    if (this.container) {
      this.loadPage();
    }
  }

  ngAfterViewInit(): void {
    this.loadPage();
  }


  loadPage() {
    if (this.pageContent) {
      if (this.pageContent.background) {
        this.setBackground();
      }

      // This will create the widgets starting with the rows
      if (this.pageContent.rows && this.pageContent.rows.length > 0) {
        this.container.viewContainerRef.clear();

        // Loop through the rows
        this.pageContent.rows.forEach((row: Row) => {

          // Create the row
          this.container.createRow(row);
        });
      }
    }
  }


  setBackground() {
    if (this.pageContent.background.enabled) {
      // Background color
      if (this.pageContent.background.color) {
        document.body.style.backgroundColor = this.pageContent.background.rgbColor.toRGBString();
      }

      // Background image
      if (this.pageContent.background.image && this.pageContent.background.image.url) {
        // Image
        document.body.style.backgroundImage = 'url(images/' + this.pageContent.background.image.url + ')';

        // Position
        document.body.style.backgroundPosition = this.pageContent.background.image.position;

        // Repeat
        document.body.style.backgroundRepeat = this.pageContent.background.image.repeat;

        // Attachment
        document.body.style.backgroundAttachment = this.pageContent.background.image.attachment;
      }
    } else {
      this.clearBackground();
    }
  }

  clearBackground() {
    document.body.style.backgroundColor = '';
    document.body.style.backgroundImage = '';
    document.body.style.backgroundPosition = '';
    document.body.style.backgroundRepeat = '';
    document.body.style.backgroundAttachment = '';
  }

  ngOnDestroy(): void {
    // Clear the background
    this.clearBackground();
  }
}