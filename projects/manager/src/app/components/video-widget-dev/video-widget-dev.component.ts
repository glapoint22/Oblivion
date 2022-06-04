import { Component } from '@angular/core';
import { LazyLoadingService, MediaType, SpinnerAction, Video } from 'common';
import { VideoWidgetComponent, VideoWidgetData } from 'widgets';
import { WidgetHandle } from '../../classes/enums';
import { WidgetService } from '../../services/widget/widget.service';
import { MediaBrowserComponent } from '../media-browser/media-browser.component';

@Component({
  selector: 'video-widget-dev',
  templateUrl: './video-widget-dev.component.html',
  styleUrls: ['./video-widget-dev.component.scss']
})
export class VideoWidgetDevComponent extends VideoWidgetComponent {
  public widgetHandle = WidgetHandle;

  constructor(public widgetService: WidgetService, private lazyLoadingService: LazyLoadingService) { super() }

  ngOnInit(): void {
    this.width = 500;
    super.ngOnInit();
  }


  setWidget(videoWidgetData: VideoWidgetData): void {
    if (videoWidgetData && videoWidgetData.video && videoWidgetData.video.src) {
      super.setWidget(videoWidgetData);
    } else {
      this.lazyLoadingService.load(async () => {
        const { MediaBrowserComponent } = await import('../media-browser/media-browser.component');
        const { MediaBrowserModule } = await import('../media-browser/media-browser.module');
        return {
          component: MediaBrowserComponent,
          module: MediaBrowserModule
        }
      }, SpinnerAction.None)
        .then((mediaBrowser: MediaBrowserComponent) => {
          mediaBrowser.currentMediaType = MediaType.Video;

          mediaBrowser.callback = (video: Video) => {
            if (video) {
              videoWidgetData.video = video;
              super.setWidget(videoWidgetData);
              this.iframe.nativeElement.src = this.video.src;
            } else {
              this.widgetService.selectedColumn.deleteColumn();
            }
          }
        });
    }
  }


  ngAfterViewChecked() {
    if (this.video && this.video.src && this.iframe.nativeElement.src != this.video.src) {
      this.iframe.nativeElement.src = this.video.src;
    }
  }
}