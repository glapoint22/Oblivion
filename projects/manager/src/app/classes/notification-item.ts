import { ImageItem } from "./image-item";

export class NotificationItem extends ImageItem {
  notificationGroupId!: number;
  notificationType!: number;
  productName!: string;
  isNew!: boolean;
  creationDate!: string;
  count!: number;
}