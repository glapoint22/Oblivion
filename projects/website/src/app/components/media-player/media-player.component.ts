import { Component, ElementRef, ViewChild } from '@angular/core';
import { LazyLoad, LazyLoadingService, Media, MediaType, Video, VideoType } from 'common';
import { VideoApiService } from '../../services/video-api/video-api.service';

@Component({
  selector: 'media-player',
  templateUrl: './media-player.component.html',
  styleUrls: ['./media-player.component.scss']
})
export class MediaPlayerComponent extends LazyLoad {
  @ViewChild('iframe') iframe!: ElementRef<HTMLIFrameElement>;
  public media!: Array<Media>;
  public selectedVideo!: Media;
  public selectedImage!: Media;
  public isVideos: boolean = true;
  public mediaType = MediaType;

  private youTubePlayer: any;
  private vimeoPlayer: any;
  private wistiaPlayer: any;

  constructor
    (
      lazyLoadingService: LazyLoadingService,
      private videoApiService: VideoApiService
    ) { super(lazyLoadingService) }


  ngAfterViewInit(): void {
    super.ngAfterViewInit();


    this.setPlayer();
  }


  onThumbnailClick(media: Media) {
    if (media.type == MediaType.Video) {
      this.selectedVideo = media;
      this.setPlayer();
    } else {
      this.selectedImage = media;
    }
  }



  setPlayer() {
    const video = new Video({
      video: {
        id: this.selectedVideo.id,
        name: this.selectedVideo.name,
        thumbnail: this.selectedVideo.thumbnail,
        videoType: this.selectedVideo.videoType,
        videoId: this.selectedVideo.videoId
      }
    });

    this.iframe.nativeElement.src = video.src;

    switch (this.selectedVideo.videoType) {
      case VideoType.YouTube:
        if (!this.youTubePlayer) {
          this.youTubePlayer = new this.videoApiService.youTube.Player(this.iframe.nativeElement, {
            events: {
              'onReady': () => {
                if (!this.isVideos) {
                  this.youTubePlayer.pauseVideo();
                } else {
                  this.youTubePlayer.playVideo()
                }
              }
            }
          });
        }
        break;

      case VideoType.Vimeo:
        if (!this.vimeoPlayer) {
          this.vimeoPlayer = new this.videoApiService.vimeo.Player(this.iframe.nativeElement);

        }

        break;


      case VideoType.Wistia:
        this.iframe.nativeElement.name = 'wistia_embed';

        if (!this.wistiaPlayer) {
          this.videoApiService.wistia.push(
            {
              id: this.selectedVideo.videoId,
              onReady: (video: any) => {
                this.wistiaPlayer = video;
              }
            }
          );
        }

        break;
    }
  }

  playVideo() {
    switch (this.selectedVideo.videoType) {
      case VideoType.YouTube:
        this.youTubePlayer.playVideo();
        break;

      case VideoType.Vimeo:
        this.vimeoPlayer.play();
        break;

      case VideoType.Wistia:
        this.wistiaPlayer.play();
        break;

    }
  }

  pauseVideo() {
    switch (this.selectedVideo.videoType) {
      case VideoType.YouTube:
        this.youTubePlayer.pauseVideo();
        break;

      case VideoType.Vimeo:
        this.vimeoPlayer.pause();
        break;


      case VideoType.Wistia:
        this.wistiaPlayer.pause();
        break;
    }
  }


  onSpace(e: KeyboardEvent): void {
    e.preventDefault();
  }
}
