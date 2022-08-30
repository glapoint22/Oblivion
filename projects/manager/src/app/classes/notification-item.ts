import { NotificationState } from "./enums";
import { ImageItem } from "./image-item";

export class NotificationItem extends ImageItem {
  productId!: number;
  productName!: string;
  type!: number;
  email!: string;
  state!: NotificationState;
  count!: number;
}