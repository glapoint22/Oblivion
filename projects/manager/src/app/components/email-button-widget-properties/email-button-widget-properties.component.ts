import { Component } from '@angular/core';
import { WidgetProperties } from '../../classes/widget-properties';
import { ButtonWidgetDevComponent } from '../button-widget-dev/button-widget-dev.component';

@Component({
  selector: 'email-button-widget-properties',
  templateUrl: './email-button-widget-properties.component.html',
  styleUrls: ['./email-button-widget-properties.component.scss']
})
export class EmailButtonWidgetPropertiesComponent extends WidgetProperties<ButtonWidgetDevComponent> { }