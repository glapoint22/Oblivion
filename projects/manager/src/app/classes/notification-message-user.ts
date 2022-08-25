import { Notification } from "./notification";

export class NotificationMessageUser extends Notification {
    notificationId!: number;
    name!: string;
    message!: string;
}