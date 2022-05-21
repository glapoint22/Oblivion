import { VideoType } from "./enums";

export class Video {
    public id!: number;
    public name!: string;
    public thumbnail!: string;
    public src!: string;
    public videoType!: VideoType;
    public videoId!: string;

    constructor(options?: {
        url?: string,
        video?: {
            id: number,
            name: string,
            thumbnail: string,
            videoType: VideoType,
            videoId: string;
        }
    }) {
        if (options && options.url) {
            this.setVideo(options.url);
            if (this.videoId) this.setSrc();
        } else if (options && options.video) {
            this.id = options.video.id;
            this.name = options.video.name;
            this.thumbnail = options.video.thumbnail;
            this.videoType = options.video.videoType;
            this.videoId = options.video.videoId;
            this.setSrc();
        }
    }



    public setData(video: Video) {
        if (video) {
            this.id = video.id;
            this.name = video.name;
            this.src = video.src;
            this.thumbnail = video.thumbnail;
        }
    }




    private setVideo(url: string) {
        let pattern!: RegExp;
        let result!: RegExpExecArray;

        // YouTube
        pattern = /(?:https?:\/\/)?(?:(?:(?:www\.?)?youtube\.com(?:\/(?:(?:watch\?.*?(?:v=([^&\s]+)).*)|(?:v\/(.*))|(?:embed\/(.+))))?)|(?:youtu\.be\/(.*)?))/;
        result = pattern.exec(url)!;
        this.videoType = VideoType.YouTube;

        // Vimeo
        if (!result) {
            pattern = /(?:(?:https?:)?\/\/(?:[\w]+\.)*vimeo\.com(?:[\/\w:]*(?:\/videos)?)?\/([0-9]+)[^\s]*)/;
            result = pattern.exec(url)!;
            this.videoType = VideoType.Vimeo;
        }


        // Wistia
        if (!result) {
            pattern = /wvideo=([a-zA-Z0-9]+)|\/\/fast\.wistia\.net\/embed\/iframe\/([a-zA-Z0-9]+)/;
            result = pattern.exec(url)!;
            this.videoType = VideoType.Wistia;
        }


        if (result) {
            // Get the video Id from the regex result
            for (let i = 1; i < result.length; i++) {
                if (result[i] != undefined) {
                    this.videoId = result[i];
                    break;
                }
            }
        }
    }




    private setSrc() {
        switch (this.videoType) {
            case VideoType.YouTube:
                this.src = 'https://www.youtube.com/embed/' + this.videoId + '?enablejsapi=1';
                break;

            case VideoType.Vimeo:
                this.src = 'https://player.vimeo.com/video/' + this.videoId + '?autoplay=true';
                break;


            case VideoType.Wistia:
                this.src = '//fast.wistia.net/embed/iframe/' + this.videoId +
                    '?autoPlay=true&playbar=true&playerColor=000000&fullscreenButton=true';
                break;
        }
    }
}