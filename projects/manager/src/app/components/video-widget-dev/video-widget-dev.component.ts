import { Component } from '@angular/core';
import { VideoWidgetComponent } from 'widgets';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'video-widget-dev',
  templateUrl: './video-widget-dev.component.html',
  styleUrls: ['./video-widget-dev.component.scss']
})
export class VideoWidgetDevComponent extends VideoWidgetComponent {
  constructor(public widgetService: WidgetService) { super() }
}