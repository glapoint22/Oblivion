import { Component } from '@angular/core';
import { VideoWidgetComponent } from 'widgets';
import { WidgetHandle, WidgetInspectorView } from '../../classes/enums';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'video-widget-dev',
  templateUrl: './video-widget-dev.component.html',
  styleUrls: ['./video-widget-dev.component.scss']
})
export class VideoWidgetDevComponent extends VideoWidgetComponent {
  public widgetHandle = WidgetHandle;
  public widgetInspectorView = WidgetInspectorView;

  constructor(public widgetService: WidgetService) { super() }


  ngAfterViewChecked() {
    if (this.video && this.video.src && this.iframe.nativeElement.src != this.video.src) {
      this.iframe.nativeElement.src = this.video.src;
    }
  }
}