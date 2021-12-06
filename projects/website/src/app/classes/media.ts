import { MediaType } from "./enums";
import { Image } from "./image";

export class Media {
    public type!: MediaType;
    public name!: string;
    public image!: Image;
    public videoUrl!: string;
}