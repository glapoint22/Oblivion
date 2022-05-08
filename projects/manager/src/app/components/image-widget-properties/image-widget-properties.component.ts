import { Component } from '@angular/core';
import { WidgetProperties } from '../../classes/widget-properties';
import { ImageWidgetDevComponent } from '../image-widget-dev/image-widget-dev.component';

@Component({
  selector: 'image-widget-properties',
  templateUrl: './image-widget-properties.component.html',
  styleUrls: ['./image-widget-properties.component.scss']
})
export class ImageWidgetPropertiesComponent extends WidgetProperties<ImageWidgetDevComponent> { }