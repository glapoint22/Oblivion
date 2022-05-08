import { Component } from '@angular/core';
import { WidgetProperties } from '../../classes/widget-properties';
import { LineWidgetDevComponent } from '../line-widget-dev/line-widget-dev.component';

@Component({
  selector: 'line-widget-properties',
  templateUrl: './line-widget-properties.component.html',
  styleUrls: ['./line-widget-properties.component.scss']
})
export class LineWidgetPropertiesComponent extends WidgetProperties<LineWidgetDevComponent> { }