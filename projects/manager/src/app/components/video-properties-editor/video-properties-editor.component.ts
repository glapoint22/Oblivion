import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LazyLoadingService, MediaType, SpinnerAction, Video } from 'common';
import { MediaBrowserComponent } from '../media-browser/media-browser.component';

@Component({
  selector: 'video-properties-editor',
  templateUrl: './video-properties-editor.component.html',
  styleUrls: ['./video-properties-editor.component.scss']
})
export class VideoPropertiesEditorComponent {
  @Input() video!: Video;
  @Output() onChange: EventEmitter<void> = new EventEmitter();

  constructor(private lazyLoadingService: LazyLoadingService) { }

  public openMediaBrowser(editMode?: boolean): void {
    this.lazyLoadingService.load(async () => {
      const { MediaBrowserComponent } = await import('../media-browser/media-browser.component');
      const { MediaBrowserModule } = await import('../media-browser/media-browser.module');
      return {
        component: MediaBrowserComponent,
        module: MediaBrowserModule
      }
    }, SpinnerAction.None)
      .then((mediaBrowser: MediaBrowserComponent) => {
        // mediaBrowser.init(MediaType.Video, this.video);
      //   mediaBrowser.currentMediaType = MediaType.Video;

      //   if (editMode) {
      //     mediaBrowser.editedVideo = this.video;
      //     mediaBrowser.displayEditedVideo(this.video);
      //   }

      //   mediaBrowser.callback = (video: Video) => {
      //     if (video) {
      //       this.video.id = video.id;
      //       this.video.name = video.name;
      //       this.video.src = video.src;
      //       this.video.thumbnail = video.thumbnail;
      //       this.video.videoId = video.videoId;
      //       this.video.videoType = video.videoType;
      //       this.onChange.emit();
      //     }
      //   }
      });
  }
}
