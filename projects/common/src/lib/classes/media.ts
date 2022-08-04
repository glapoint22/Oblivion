import { ImageSizeType, MediaType, VideoType } from "./enums";
import { ImageSize } from "./image-size";

export class Media {
  public id!: number;
  public type!: MediaType;
  public name!: string;
  public src!: string;
  public videoId!: string;
  public videoType!: VideoType;

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
  public imageLgWidth!: number;
  public imageLgHeight!: number;



  public imageAnySize!: string;
  public imageAnySizeWidth!: number;
  public imageAnySizeHeight!: number;


  constructor(media: Media) {
    this.id = media.id;
    this.type = media.type;
    this.name = media.name;
    this.src = media.src;
    this.videoId = media.videoId;
    this.videoType = media.videoType;
    this.thumbnail = media.thumbnail;
    this.thumbnailWidth = media.thumbnailWidth;
    this.thumbnailHeight = media.thumbnailHeight;
    this.imageSm = media.imageSm;
    this.imageSmWidth = media.imageSmWidth;
    this.imageSmHeight = media.imageSmHeight;
    this.imageMd = media.imageMd;
    this.imageMdWidth = media.imageMdWidth;
    this.imageMdHeight = media.imageMdHeight;
    this.imageLg = media.imageLg;
    this.imageLgWidth = media.imageLgWidth;
    this.imageLgHeight = media.imageLgHeight;
    this.imageAnySize = media.imageAnySize;
    this.imageAnySizeWidth = media.imageAnySizeWidth;
    this.imageAnySizeHeight = media.imageAnySizeHeight;
  }


  getImageSizes(): Array<ImageSize> {
    const imageSizes: Array<ImageSize> = [];

    // Thumbnail
    if (this.thumbnail && !imageSizes.some(x => x.width == this.thumbnailWidth && x.height == this.thumbnailHeight)) {
      imageSizes.push({
        src: this.thumbnail,
        width: this.thumbnailWidth,
        height: this.thumbnailHeight,
        imageSizeType: ImageSizeType.Thumbnail
      });
    }

    // Small
    if (this.imageSm && !imageSizes.some(x => x.width == this.imageSmWidth && x.height == this.imageSmHeight)) {
      imageSizes.push({
        src: this.imageSm,
        width: this.imageSmWidth,
        height: this.imageSmHeight,
        imageSizeType: ImageSizeType.Small
      });
    }


    // Medium
    if (this.imageMd && !imageSizes.some(x => x.width == this.imageMdWidth && x.height == this.imageMdHeight)) {
      imageSizes.push({
        src: this.imageMd,
        width: this.imageMdWidth,
        height: this.imageMdHeight,
        imageSizeType: ImageSizeType.Medium
      });
    }


    // Large
    if (this.imageLg && !imageSizes.some(x => x.width == this.imageLgWidth && x.height == this.imageLgHeight)) {
      imageSizes.push({
        src: this.imageLg,
        width: this.imageLgWidth,
        height: this.imageLgHeight,
        imageSizeType: ImageSizeType.Large
      });
    }

    // Any Size
    if (this.imageAnySize && !imageSizes.some(x => x.width == this.imageAnySizeWidth && x.height == this.imageAnySizeHeight)) {
      imageSizes.push({
        src: this.imageAnySize,
        width: this.imageAnySizeWidth,
        height: this.imageAnySizeHeight,
        imageSizeType: ImageSizeType.AnySize
      });
    }

    return imageSizes;
  }
}