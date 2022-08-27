import { Component, OnInit } from '@angular/core';
import { WidgetType } from 'widgets';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'email-widget-properties',
  templateUrl: './email-widget-properties.component.html',
  styleUrls: ['./email-widget-properties.component.scss']
})
export class EmailWidgetPropertiesComponent {
  public widgetType = WidgetType;

  constructor(public widgetService: WidgetService) { }
  
}