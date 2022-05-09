import { Component } from '@angular/core';
import { WidgetProperties } from '../../classes/widget-properties';
import { ButtonWidgetDevComponent } from '../button-widget-dev/button-widget-dev.component';

@Component({
  selector: 'button-widget-normal-properties',
  templateUrl: './button-widget-normal-properties.component.html',
  styleUrls: ['./button-widget-normal-properties.component.scss']
})
export class ButtonWidgetNormalPropertiesComponent extends WidgetProperties<ButtonWidgetDevComponent> { }