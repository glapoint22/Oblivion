import { MediaType, VideoType } from "./enums";

export class Media {
    public type!: MediaType;
    public name!: string;
    public image!: string;
    public videoId!: string;
    public videoType!: VideoType;
    public thumbnail!: string;
}