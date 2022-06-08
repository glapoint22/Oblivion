import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService } from 'common';
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
  public pageType = PageType;
  

  constructor(public widgetService: WidgetService, private dataService: DataService, private sanitizer: DomSanitizer) { }


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