import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Background, PageType } from 'widgets';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'page-properties',
  templateUrl: './page-properties.component.html',
  styleUrls: ['./page-properties.component.scss']
})
export class PagePropertiesComponent implements OnInit {
  public pageTypes: Array<KeyValue<string, number>> = new Array<KeyValue<string, number>>();

  constructor(public widgetService: WidgetService) { }

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
    this.setBackground(this.widgetService.page.pageContent.background);
    this.widgetService.$pageChange.next();
  }

  setBackground(background: Background) {
    if (background.enabled) {
      // Background color
      if (background.color) {
        document.body.style.backgroundColor = background.rgbColor.toRGBString();
      }

      // Background image
      if (background.image && background.image.url) {
        // Image
        document.body.style.backgroundImage = 'url(images/' + background.image.url + ')';

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