import { Component, ElementRef, ViewChild } from '@angular/core';
import { Video } from 'common';
import { Border } from '../../classes/border';
import { Corners } from '../../classes/corners';
import { Shadow } from '../../classes/shadow';
import { VideoWidgetData } from '../../classes/video-widget-data';
import { Widget } from '../../classes/widget';
import { WidgetType } from '../../classes/widget-enums';

@Component({
  selector: 'video-widget',
  templateUrl: './video-widget.component.html',
  styleUrls: ['./video-widget.component.scss']
})
export class VideoWidgetComponent extends Widget {
  @ViewChild('iframe') iframe!: ElementRef<HTMLIFrameElement>;
  public border: Border = new Border();
  public corners: Corners = new Corners();
  public shadow: Shadow = new Shadow();
  public video: Video = new Video();


  // --------------------------------------------------------------- Ng On Init ---------------------------------------------------------------
  ngOnInit() {
    this.type = WidgetType.Video;
  }




  // ------------------------------------------------------------ Ng After View Init -----------------------------------------------------------
  ngAfterViewInit(): void {
    super.ngAfterViewInit();

    // Set the video src
    if (this.video.src) this.iframe.nativeElement.src = this.video.src;
  }



  // ------------------------------------------------------------ Set Widget -----------------------------------------------------------
  setWidget(videoWidgetData: VideoWidgetData) {
    this.border.setData(videoWidgetData.border);
    this.corners.setData(videoWidgetData.corners);
    this.shadow.setData(videoWidgetData.shadow);
    this.video.setData(videoWidgetData.video);

    super.setWidget(videoWidgetData);
  }



  // ------------------------------------------------------------ Get Data -----------------------------------------------------------
  getData(): VideoWidgetData {
    throw new Error('Method not implemented.');
  }
}