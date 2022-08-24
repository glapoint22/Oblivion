import { Component } from '@angular/core';
import { WidgetProperties } from '../../classes/widget-properties';
import { TextWidgetDevComponent } from '../text-widget-dev/text-widget-dev.component';

@Component({
  selector: 'page-text-widget-properties',
  templateUrl: './page-text-widget-properties.component.html',
  styleUrls: ['./page-text-widget-properties.component.scss']
})
export class PageTextWidgetPropertiesComponent extends WidgetProperties<TextWidgetDevComponent> { }