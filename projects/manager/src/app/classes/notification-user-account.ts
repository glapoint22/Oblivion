import { NotificationEmployee } from "./notification-employee";
import { NotificationUser } from "./notification-user";

export class NotificationUserAccount extends NotificationUser {
    notificationId!: number;
    employeeIndex!: number;
    employeeNotes!: Array<NotificationEmployee>;
}