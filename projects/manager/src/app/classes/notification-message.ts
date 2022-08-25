import { NotificationMessageEmployee } from "./notification-message-employee";
import { NotificationMessageUser } from "./notification-message-user";

export class NotificationMessage {
    user: Array<NotificationMessageUser> = new Array<NotificationMessageUser>();
    employee: NotificationMessageEmployee = new NotificationMessageEmployee();
}