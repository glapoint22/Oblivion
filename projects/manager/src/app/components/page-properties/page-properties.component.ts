import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PageType } from 'widgets';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'page-properties',
  templateUrl: './page-properties.component.html',
  styleUrls: ['./page-properties.component.scss']
})
export class PagePropertiesComponent implements OnInit {
  public pageTypes: Array<KeyValue<string, number>> = new Array<KeyValue<string, number>>();
  public selectedPageType!: KeyValue<string, number>;

  constructor(public widgetService: WidgetService) { }


  ngOnInit(): void {
    const pageTypesArray = Object.values(PageType);

    for (let i = 0; i < pageTypesArray.length / 2; i++) {
      this.pageTypes.push({
        key: pageTypesArray[i] as string,
        value: i
      });
    }

    this.selectedPageType = this.pageTypes[0];
  }

  onBackgroundChange() {
    this.widgetService.page.setBackground(document);
    this.widgetService.page.setBackground(this.widgetService.widgetDocument);
    this.widgetService.page.save();
  }
}