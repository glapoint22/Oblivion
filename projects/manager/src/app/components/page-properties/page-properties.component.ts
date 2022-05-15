import { KeyValue } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Background, PageType } from 'widgets';
import { PageDevComponent } from '../page-dev/page-dev.component';

@Component({
  selector: 'page-properties',
  templateUrl: './page-properties.component.html',
  styleUrls: ['./page-properties.component.scss']
})
export class PagePropertiesComponent implements OnInit {
  @Input() page!: PageDevComponent;
  public pageTypes: Array<KeyValue<string, number>> = new Array<KeyValue<string, number>>();


  ngOnInit(): void {
    const pageTypesArray = Object.values(PageType);

    for (let i = 0; i < pageTypesArray.length / 2; i++) {
      this.pageTypes.push({
        key: pageTypesArray[i] as string,
        value: i
      });
    }
  }

  onBackgroundChange() {
    this.setBackground(this.page.pageContent.background);
  }

  setBackground(background: Background) {
    if (background.enabled) {
      // Background color
      if (background.color) {
        document.body.style.backgroundColor = background.rgbColor.toRGBString();
      }

      // Background image
      if (background.image && background.image.src) {
        // Image
        document.body.style.backgroundImage = 'url(images/' + background.image.src + ')';

        // Position
        document.body.style.backgroundPosition = background.image.position;

        // Repeat
        document.body.style.backgroundRepeat = background.image.repeat;

        // Attachment
        document.body.style.backgroundAttachment = background.image.attachment;
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
}