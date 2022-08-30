import { NotificationMessageEmployee } from "./notification-message-employee";
import { NotificationMessageUser } from "./notification-message-user";

export class NotificationMessage {
    users: Array<NotificationMessageUser> = new Array<NotificationMessageUser>();
    employee: Array<NotificationMessageEmployee> = new Array<NotificationMessageEmployee>();
}