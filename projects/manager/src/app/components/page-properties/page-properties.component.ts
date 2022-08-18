import { KeyValue } from '@angular/common';
import { ApplicationRef, Component, OnInit } from '@angular/core';
import { ImageSizeType } from 'common';
import { PageType } from 'widgets';
import { BuilderType, MediaLocation } from '../../classes/enums';
import { MediaReference } from '../../classes/media-reference';
import { WidgetService } from '../../services/widget/widget.service';
import { MediaBrowserComponent } from '../media-browser/media-browser.component';

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

  getMediaReference() {
    return {
      mediaId: this.widgetService.page.pageContent.background.image.id,
      imageSizeType: this.widgetService.page.pageContent.background.image.imageSizeType,
      builder: BuilderType.Page,
      hostId: this.widgetService.page.id,
      location: MediaLocation.PageBackground
    }
  }
}