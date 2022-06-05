import { Image } from "common";

export class BackgroundImage extends Image {
    public position!: string;
    public repeat!: string;
    public attachment!: string;

    getData(): BackgroundImage {
        if (!this.src) return null!;
        const backgroundImage = new BackgroundImage();

        backgroundImage.src = this.src;
        backgroundImage.name = this.name;
        backgroundImage.thumbnail = this.thumbnail;
        backgroundImage.position = this.position;
        backgroundImage.repeat = this.repeat;
        backgroundImage.attachment = this.attachment;

        return backgroundImage;
    }
}