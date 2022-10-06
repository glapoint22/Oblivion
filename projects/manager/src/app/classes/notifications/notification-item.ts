import { ImageItem } from "../image-item";

export class NotificationItem extends ImageItem {
  notificationGroupId!: number;
  notificationType!: number;
  email!: string;
  productId!: number;
  productName!: string;
  userName!: string;
  userImage!: string;
  isNew!: boolean;
  creationDate!: string;
  count!: number;
}