import { Component } from '@angular/core';
import { WidgetType } from 'widgets';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'widget-properties',
  templateUrl: './widget-properties.component.html',
  styleUrls: ['./widget-properties.component.scss']
})
export class WidgetPropertiesComponent {
  public widgetType = WidgetType;

  constructor(public widgetService: WidgetService) { }
}