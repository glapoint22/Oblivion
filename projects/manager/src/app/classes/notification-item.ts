import { ImageItem } from "./image-item";

export class NotificationItem extends ImageItem {
  isNew!: boolean;
  productId!: number;
  productName!: string;
  type!: number;
  email!: string;
  count!: number;
  archiveDate!: Date;
}