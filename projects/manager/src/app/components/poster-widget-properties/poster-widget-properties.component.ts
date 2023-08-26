import { Component } from '@angular/core';
import { PosterWidgetDevComponent } from '../poster-widget-dev/poster-widget-dev.component';
import { WidgetProperties } from '../../classes/widget-properties';

@Component({
  selector: 'poster-widget-properties',
  templateUrl: './poster-widget-properties.component.html',
  styleUrls: ['./poster-widget-properties.component.scss']
})
export class PosterWidgetPropertiesComponent extends WidgetProperties<PosterWidgetDevComponent> { }