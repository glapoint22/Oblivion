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
  @ViewChild('container') container!: ContainerComponent;

  ngOnChanges() {
    if (this.container) {
      this.load();
    }
  }

  ngAfterViewInit(): void {
    this.load();
  }


  load() {
    if (this.pageContent) {
      if (this.pageContent.background) {
        this.setBackground(document.body);
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


  setBackground(element?: HTMLElement) {
    if (this.pageContent.background.enabled) {
      // Background color
      if (this.pageContent.background.color) {
        element!.style.backgroundColor = this.pageContent.background.color;
      }

      // Background image
      if (this.pageContent.background.image && this.pageContent.background.image.src) {
        // Image
        element!.style.backgroundImage = 'url(images/' + this.pageContent.background.image.src + ')';

        // Position
        element!.style.backgroundPosition = this.pageContent.background.image.position.value;

        // Repeat
        element!.style.backgroundRepeat = this.pageContent.background.image.repeat.value;

        // Attachment
        element!.style.backgroundAttachment = this.pageContent.background.image.attachment.value;
      } else {
        this.clearImage(element!);
      }
    } else {
      this.clearBackground(element!);
    }
  }

  clearBackground(element: HTMLElement) {
    element.style.backgroundColor = '';
    this.clearImage(element);
  }


  clearImage(element: HTMLElement) {
    element.style.backgroundImage = '';
    element.style.backgroundPosition = '';
    element.style.backgroundRepeat = '';
    element.style.backgroundAttachment = '';
  }

  ngOnDestroy(): void {
    // Clear the background
    this.clearBackground(document.body);
  }
}