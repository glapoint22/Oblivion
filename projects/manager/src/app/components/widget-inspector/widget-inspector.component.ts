import { Component } from '@angular/core';
import { WidgetInspectorView } from '../../classes/enums';
import { Item } from '../../classes/item';
import { WidgetService } from '../../services/widget/widget.service';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'widget-inspector',
  templateUrl: './widget-inspector.component.html',
  styleUrls: ['./widget-inspector.component.scss']
})
export class WidgetInspectorComponent {
  public widgetInspectorView = WidgetInspectorView;

  constructor(public widgetService: WidgetService) { }


  onNewPageClick() {
    this.widgetService.currentWidgetInspectorView = WidgetInspectorView.Page;
    this.widgetService.page.new();
  }

  
}