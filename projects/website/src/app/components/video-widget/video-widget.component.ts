import { Component, ElementRef, ViewChild } from '@angular/core';
import { Border } from '../../classes/border';
import { Corners } from '../../classes/corners';
import { Shadow } from '../../classes/shadow';
import { Video } from '../../classes/video';
import { VideoWidgetData } from '../../classes/video-widget-data';
import { Widget } from '../../classes/widget';

@Component({
  selector: 'video-widget',
  templateUrl: './video-widget.component.html',
  styleUrls: ['./video-widget.component.scss']
})
export class VideoWidgetComponent extends Widget {
  @ViewChild('iframe', { static: false }) iframe!: ElementRef<HTMLIFrameElement>;
  public border!: Border;
  public corners!: Corners;
  public shadow!: Shadow;
  private video!: Video;

  ngAfterViewInit(): void {
    super.ngAfterViewInit();

    // Set the video src
    this.iframe.nativeElement.src = this.video.url;
  }

  setWidget(videoWidgetData: VideoWidgetData) {
    this.border = videoWidgetData.border;
    this.corners = videoWidgetData.corners;
    this.shadow = videoWidgetData.shadow;
    this.video = videoWidgetData.video;

    super.setWidget(videoWidgetData);
  }
}