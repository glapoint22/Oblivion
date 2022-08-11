import { ImageSizeType } from "common";
import { BuilderType, ImageLocation } from "./enums";

export class ImageReference {
    public imageId!: number;
    public imageSizeType!: ImageSizeType;
    public builder!: BuilderType;
    public host!: string;
    public location!: ImageLocation;
}