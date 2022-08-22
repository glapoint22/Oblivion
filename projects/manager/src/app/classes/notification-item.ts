import { ImageItem } from "./image-item";

export class NotificationItem extends ImageItem {
    type!: number;
    email!: string;
    count!: number;
  }