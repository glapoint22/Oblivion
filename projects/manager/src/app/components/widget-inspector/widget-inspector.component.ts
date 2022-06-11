import { Component } from '@angular/core';
import { DataService } from 'common';
import { WidgetInspectorView } from '../../classes/enums';
import { Item } from '../../classes/item';
import { PageData } from '../../classes/page-data';
import { WidgetService } from '../../services/widget/widget.service';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'widget-inspector',
  templateUrl: './widget-inspector.component.html',
  styleUrls: ['./widget-inspector.component.scss']
})
export class WidgetInspectorComponent {
  public widgetInspectorView = WidgetInspectorView;

  constructor(public widgetService: WidgetService, private dataService: DataService) { }


  onNewPageClick() {
    this.widgetService.currentWidgetInspectorView = WidgetInspectorView.Page;
    this.widgetService.page.new();
  }

  getPage(page: Item, searchComponent: SearchComponent) {
    searchComponent.searchInput.nativeElement.value = '';

    this.dataService.get<PageData>('api/Pages', [{ key: 'id', value: page.id }])
      .subscribe((pageData: PageData) => {
        this.widgetService.currentWidgetInspectorView = WidgetInspectorView.Page;
        this.widgetService.page.setData(pageData);
      });
  }
}