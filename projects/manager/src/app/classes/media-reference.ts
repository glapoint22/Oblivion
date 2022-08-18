import { ImageSizeType } from "common";
import { BuilderType, MediaLocation } from "./enums";

export class MediaReference {
    public mediaId!: number;
    public imageSizeType!: ImageSizeType;
    public builder!: BuilderType;
    public host?: string;
    public hostId!: number;
    public location!: MediaLocation;
}