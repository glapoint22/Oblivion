import { Component } from '@angular/core';
import { DataService } from 'common';
import { WidgetInspectorView } from '../../classes/enums';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'page-inspector',
  templateUrl: './page-inspector.component.html',
  styleUrls: ['./page-inspector.component.scss']
})
export class PageInspectorComponent {
  public widgetInspectorView = WidgetInspectorView;

  constructor(public widgetService: WidgetService, private dataService: DataService) { }


  clickMe() {
    this.dataService.get('api/Products/SetData').subscribe();
  }
}
