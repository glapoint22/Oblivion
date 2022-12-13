import { Component, Input, OnChanges } from '@angular/core';
import { LazyLoadingService, Media, MediaType, SpinnerAction } from 'common';
import { MediaPlayerComponent } from '../../components/media-player/media-player.component';

@Component({
  selector: 'media-slider',
  templateUrl: './media-slider.component.html',
  styleUrls: ['./media-slider.component.scss']
})
export class MediaSliderComponent implements OnChanges {
  @Input() media!: Array<Media>;
  @Input() clientWidth!: number;
  public changeCount: number = 0;
  public mediaType = MediaType;

  constructor(private lazyLoadingService: LazyLoadingService) { }

  ngOnChanges(): void {
    this.changeCount++;
  }


  async onMediaClick(media: Media) {

    this.lazyLoadingService.load(async () => {
      const { MediaPlayerComponent } = await import('../../components/media-player/media-player.component');
      const { MediaPlayerModule } = await import('../../components/media-player/media-player.module');
  
      return {
        component: MediaPlayerComponent,
        module: MediaPlayerModule
      }
    }, SpinnerAction.StartEnd)
      .then((mediaPlayer: MediaPlayerComponent) => {
        mediaPlayer.media = this.media;
  
  
        mediaPlayer.selectedMedia = media;
  
  
        if (media.type == MediaType.Video) {
          mediaPlayer.isVideos = true;
          mediaPlayer.selectedVideo = media;
          mediaPlayer.selectedImage = this.media[0];
        }else {
          mediaPlayer.isVideos = false;
          mediaPlayer.selectedImage = media;
          mediaPlayer.selectedVideo = this.media.find(x => x.type == MediaType.Video)!;
        }
      });
  }
}