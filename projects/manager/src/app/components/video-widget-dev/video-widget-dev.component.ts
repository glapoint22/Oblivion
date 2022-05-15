import { Component } from '@angular/core';
import { LazyLoadingService, Media, MediaType, SpinnerAction, Video } from 'common';
import { VideoWidgetComponent, VideoWidgetData } from 'widgets';
import { WidgetService } from '../../services/widget/widget.service';
import { MediaBrowserComponent } from '../media-browser/media-browser.component';

@Component({
  selector: 'video-widget-dev',
  templateUrl: './video-widget-dev.component.html',
  styleUrls: ['./video-widget-dev.component.scss']
})
export class VideoWidgetDevComponent extends VideoWidgetComponent {

  constructor(public widgetService: WidgetService, private lazyLoadingService: LazyLoadingService) { super() }

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
          mediaBrowser.callback = (media: Media) => {
            const video = new Video();

            video.id = media.id;
            video.thumbnail = media.thumbnail;
            video.src = Media.getVideoSrc(media);

            videoWidgetData.video = video;
            super.setWidget(videoWidgetData);
            this.iframe.nativeElement.src = this.video.src;
          }
        });
    }
  }
}