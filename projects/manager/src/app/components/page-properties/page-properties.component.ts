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
  public pageType = PageType;


  private _selectedPageType!: KeyValue<string, number>;
  public get selectedPageType(): KeyValue<string, number> {
    const pageType = this.pageTypes.find(x => x.value == this.widgetService.page.pageType);

    this._selectedPageType = pageType!;
    return this._selectedPageType;
  }
  public set selectedPageType(v: KeyValue<string, number>) {
    this.widgetService.page.pageType = v.value;
    this._selectedPageType = v;
    this.widgetService.page.save();
  }


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
    this.widgetService.page.setBackground();
    this.widgetService.page.save();
  }
}