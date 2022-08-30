import { NotificationEmployeeDetails } from "./notification-employee-details";
import { NotificationProductUser } from "./notification-product-user";

export class NotificationProduct {
    users: Array<NotificationProductUser> = new Array<NotificationProductUser>();
    employee: NotificationEmployeeDetails = new NotificationEmployeeDetails();
}