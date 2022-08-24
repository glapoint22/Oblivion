import { Component } from '@angular/core';
import { WidgetProperties } from '../../classes/widget-properties';
import { ButtonWidgetDevComponent } from '../button-widget-dev/button-widget-dev.component';

@Component({
  selector: 'page-button-widget-properties',
  templateUrl: './page-button-widget-properties.component.html',
  styleUrls: ['./page-button-widget-properties.component.scss']
})
export class PageButtonWidgetPropertiesComponent extends WidgetProperties<ButtonWidgetDevComponent> { }