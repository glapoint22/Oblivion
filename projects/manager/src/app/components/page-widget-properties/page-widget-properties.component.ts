import { Component } from '@angular/core';
import { WidgetType } from 'widgets';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'page-widget-properties',
  templateUrl: './page-widget-properties.component.html',
  styleUrls: ['./page-widget-properties.component.scss']
})
export class PageWidgetPropertiesComponent {
  public widgetType = WidgetType;

  constructor(public widgetService: WidgetService) { }
}