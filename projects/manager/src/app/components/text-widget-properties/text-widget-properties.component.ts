import { Component } from '@angular/core';
import { WidgetProperties } from '../../classes/widget-properties';
import { TextWidgetDevComponent } from '../text-widget-dev/text-widget-dev.component';

@Component({
  selector: 'text-widget-properties',
  templateUrl: './text-widget-properties.component.html',
  styleUrls: ['./text-widget-properties.component.scss']
})
export class TextWidgetPropertiesComponent extends WidgetProperties<TextWidgetDevComponent> { }