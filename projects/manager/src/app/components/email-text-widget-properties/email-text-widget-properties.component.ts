import { Component, OnInit } from '@angular/core';
import { WidgetProperties } from '../../classes/widget-properties';
import { TextWidgetDevComponent } from '../text-widget-dev/text-widget-dev.component';

@Component({
  selector: 'email-text-widget-properties',
  templateUrl: './email-text-widget-properties.component.html',
  styleUrls: ['./email-text-widget-properties.component.scss']
})
export class EmailTextWidgetPropertiesComponent extends WidgetProperties<TextWidgetDevComponent> { }