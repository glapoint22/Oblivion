import { NotificationEmployee } from "./notification-employee";
import { NotificationUser } from "./notification-user";

export class NotificationMessage extends NotificationUser {
    notificationId!: number;
    userName!: string;
    employeeMessage!: NotificationEmployee;
}