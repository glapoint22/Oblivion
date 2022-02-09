import { Component, Input, OnChanges } from '@angular/core';
import { MediaType, SpinnerAction } from '../../classes/enums';
import { Media } from '../../classes/media';
import { MediaPlayerComponent } from '../../components/media-player/media-player.component';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';

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
    if (media.type != MediaType.Video) return;

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
        mediaPlayer.selectedVideo = media;
        mediaPlayer.selectedImage = this.media[0];
      });
  }
}