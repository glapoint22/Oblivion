import { NotificationEmployee } from "./notification-employee";
import { NotificationUser } from "./notification-user";

export class NotificationProduct {
    users: Array<NotificationUser> = new Array<NotificationUser>();
    employee: NotificationEmployee = new NotificationEmployee();
}