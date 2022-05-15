import { MediaType, VideoType } from "./enums";

export class Media {
    public id!: number;
    public type!: MediaType;
    public name!: string;
    public image!: string;
    public thumbnail!: string;
    public videoId!: string;
    public videoType!: VideoType;


    public static getVideoSrc(media: Media): string {
        let videoSrc!: string;

        switch (media.videoType) {
            case VideoType.YouTube:
                videoSrc = 'https://www.youtube.com/embed/' + media.videoId + '?enablejsapi=1';
                break;

            case VideoType.Vimeo:
                videoSrc = 'https://player.vimeo.com/video/' + media.videoId + '?autoplay=true';
                break;


            case VideoType.Wistia:
                videoSrc = '//fast.wistia.net/embed/iframe/' + media.videoId +
                    '?autoPlay=true&playbar=true&playerColor=000000&fullscreenButton=true';
                break;
        }

        return videoSrc;
    }
}