import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LazyLoadingService, MediaType, SpinnerAction, Video } from 'common';
import { MediaReference } from '../../classes/media-reference';
import { MediaBrowserComponent } from '../media-browser/media-browser.component';

@Component({
  selector: 'video-properties-editor',
  templateUrl: './video-properties-editor.component.html',
  styleUrls: ['./video-properties-editor.component.scss']
})
export class VideoPropertiesEditorComponent {
  @Input() video!: Video;
  @Input() mediaReference!: MediaReference;
  @Output() onChange: EventEmitter<void> = new EventEmitter();

  constructor(private lazyLoadingService: LazyLoadingService) { }

  public openMediaBrowser(): void {
    this.lazyLoadingService.load(async () => {
      const { MediaBrowserComponent } = await import('../media-browser/media-browser.component');
      const { MediaBrowserModule } = await import('../media-browser/media-browser.module');
      return {
        component: MediaBrowserComponent,
        module: MediaBrowserModule
      }
    }, SpinnerAction.None)
      .then((mediaBrowser: MediaBrowserComponent) => {
        mediaBrowser.init(MediaType.Video, this.video, this.mediaReference);

        mediaBrowser.callback = (video: Video) => {
          if (video) {
            this.video.id = video.id;
            this.video.name = video.name;
            this.video.src = video.src;
            this.video.thumbnail = video.thumbnail;
            this.video.videoId = video.videoId;
            this.video.videoType = video.videoType;
            this.video.referenceId = video.referenceId;
            this.onChange.emit();
          }
        }
      });
  }
}