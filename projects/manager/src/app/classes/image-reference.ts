import { ImageSizeType } from "common";
import { BuilderType, ImageLocation } from "./enums";

export class ImageReference {
    public imageSizeType!: ImageSizeType;
    public builderType!: BuilderType;
    public host!: string;
    public imageLocation!: ImageLocation;
}