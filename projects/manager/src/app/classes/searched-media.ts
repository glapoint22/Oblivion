import { VideoType } from "common";

export class SearchedMedia {
    public id!: number;
    public name!: string;

    public thumbnail!: string;
    public thumbnailWidth!: number;
    public thumbnailHeight!: number;


    public imageSm!: string;
    public imageSmWidth!: number;
    public imageSmHeight!: number;


    public imageMd!: string;
    public imageMdWidth!: number;
    public imageMdHeight!: number;


    public imageLg!: string;
    public imageLgWidth!: string;
    public imageLgHeight!: string;



    public imageAnySize!: string;
    public imageAnySizeWidth!: number;
    public imageAnySizeHeight!: number;

    public videoId!: string;
    public videoType!: VideoType;
}