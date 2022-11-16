import { KeyValue } from '@angular/common';
import { ApplicationRef, Component, OnInit } from '@angular/core';
import { DropdownType } from 'common';
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
  public DropdownType = DropdownType;


  private _selectedPageType!: KeyValue<string, number>;
  public get selectedPageType(): KeyValue<string, number> {
    const pageType = this.pageTypes.find(x => x.value == this.widgetService.page.pageType);

    this._selectedPageType = pageType!;
    return this._selectedPageType;
  }
  public set selectedPageType(v: KeyValue<string, number>) {
    this.widgetService.page.pageType = v.value;
    this._selectedPageType = v;

    if (v.value == PageType.Home) {
      this.widgetService.page.name = 'Home';
    } else if (v.value == PageType.Grid) {
      this.widgetService.page.name = 'Grid';
    } else if (v.value == PageType.Custom) {
      this.widgetService.page.name = 'Custom Page';
    } else if (v.value == PageType.Browse) {
      this.widgetService.page.name = 'Browse Page';
    } else if (v.value == PageType.Search) {
      this.widgetService.page.name = 'Search Page';
    }

    this.widgetService.page.save();
  }


  constructor(public widgetService: WidgetService, private appRef: ApplicationRef) { }


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
    this.appRef.tick();
    this.widgetService.page.setBackground();
    this.widgetService.page.save();
  }
}