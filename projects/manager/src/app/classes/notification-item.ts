import { ImageItem } from "./image-item";

export class NotificationItem extends ImageItem {
  notificationGroupId!: number;
  notificationType!: number;
  isNew!: boolean;
  count!: number;
}