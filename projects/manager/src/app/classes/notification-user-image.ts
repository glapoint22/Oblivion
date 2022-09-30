import { NotificationEmployee } from "./notification-employee";
import { NotificationUser } from "./notification-user";

export class NotificationUserImage extends NotificationUser {
    notificationId!: number;
    userImage!: string;
    employeeIndex!: number;
    employeeNotes: Array<NotificationEmployee> = new Array<NotificationEmployee>();
}