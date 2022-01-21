import { Component, Input, OnChanges } from '@angular/core';
import { MediaType } from '../../classes/enums';
import { Media } from '../../classes/media';
import { MediaPlayerComponent } from '../../components/media-player/media-player.component';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SpinnerService } from '../../services/spinner/spinner.service';

@Component({
  selector: 'media-slider',
  templateUrl: './media-slider.component.html',
  styleUrls: ['./media-slider.component.scss']
})
export class MediaSliderComponent implements OnChanges {
  @Input() media!: Array<Media>;
  public changeCount: number = 0;
  public mediaType = MediaType;

  constructor(private lazyLoadingService: LazyLoadingService, private spinnerService: SpinnerService) { }

  ngOnChanges(): void {
    this.changeCount++;
  }


  async onMediaClick(media: Media) {
    if (media.type != MediaType.Video) return;

    this.spinnerService.show = true;
    const { MediaPlayerComponent } = await import('../../components/media-player/media-player.component');
    const { MediaPlayerModule } = await import('../../components/media-player/media-player.module');

    this.lazyLoadingService.getComponentAsync(MediaPlayerComponent, MediaPlayerModule, this.lazyLoadingService.container)
      .then((mediaPlayer: MediaPlayerComponent) => {
        mediaPlayer.media = this.media;
        mediaPlayer.selectedVideo = media;
        mediaPlayer.selectedImage = this.media[0];
        this.spinnerService.show = false;
      });
  }
}