import { Component } from '@angular/core';
import { ButtonState } from '../../classes/enums';
import { WidgetProperties } from '../../classes/widget-properties';
import { ButtonWidgetDevComponent } from '../button-widget-dev/button-widget-dev.component';

@Component({
  selector: 'button-widget-properties',
  templateUrl: './button-widget-properties.component.html',
  styleUrls: ['./button-widget-properties.component.scss']
})
export class ButtonWidgetPropertiesComponent extends WidgetProperties<ButtonWidgetDevComponent> {
  public buttonState = ButtonState;
}