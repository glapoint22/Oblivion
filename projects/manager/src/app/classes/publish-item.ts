import { BuilderType, PublishStatus } from "./enums";
import { ImageItem } from "./image-item";

export class PublishItem extends ImageItem {
    productId!: number;
    pageId!: number;
    emailId!: number;
    publishType!: BuilderType;
    status!: PublishStatus;
    userName!: string;
    userImage!: string;
    publishSuccessful!: boolean;
}