import { ImageSizeType } from "./enums";

export class Image {
    public id!: string;
    public name!: string;
    public src!: string;
    public thumbnail!: string;
    public imageSizeType!: ImageSizeType;

    setData(image: Image) {
        if (image) {
            this.id = image.id;
            this.src = image.src;
            this.name = image.name;
            this.thumbnail = image.thumbnail;
            this.imageSizeType = image.imageSizeType;
        }
    }



    getData(): Image {
        if (!this.src) return null!;
        const image = new Image();

        image.id = this.id;
        image.name = this.name;
        image.src = this.src;
        image.thumbnail = this.thumbnail;
        image.imageSizeType = this.imageSizeType;

        return image;
    }
}