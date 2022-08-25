import { NotificationEmployee } from "./notification-employee";
import { NotificationProductUser } from "./notification-product-user";

export class NotificationProduct {
    user: Array<NotificationProductUser> = new Array<NotificationProductUser>();
    employee: NotificationEmployee = new NotificationEmployee();
}