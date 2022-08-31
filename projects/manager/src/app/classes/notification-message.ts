import { NotificationEmployee } from "./notification-employee";
import { NotificationMessageUser } from "./notification-message-user";

export class NotificationMessage {
    users: Array<NotificationMessageUser> = new Array<NotificationMessageUser>();
    employee: Array<NotificationEmployee> = new Array<NotificationEmployee>();
}