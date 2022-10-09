import { NotificationEmployee } from "./notification-employee";
import { NotificationUser } from "./notification-user";

export class MessageNotification extends NotificationUser {
    notificationId!: number;
    nonAccountName!: string;
    employeeMessage!: NotificationEmployee;
}