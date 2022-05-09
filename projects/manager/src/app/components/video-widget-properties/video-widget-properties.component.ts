import { Component } from '@angular/core';
import { WidgetProperties } from '../../classes/widget-properties';
import { VideoWidgetDevComponent } from '../video-widget-dev/video-widget-dev.component';

@Component({
  selector: 'video-widget-properties',
  templateUrl: './video-widget-properties.component.html',
  styleUrls: ['./video-widget-properties.component.scss']
})
export class VideoWidgetPropertiesComponent extends WidgetProperties<VideoWidgetDevComponent> { }