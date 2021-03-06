import { MediaType, VideoType } from "./enums";

export class Media {
    public id!: number;
    public type!: MediaType;
    public name!: string;
    public src!: string;
    public thumbnail!: string;
    public videoId!: string;
    public videoType!: VideoType;
}