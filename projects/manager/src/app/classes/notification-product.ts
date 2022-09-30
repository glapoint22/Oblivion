import { NotificationEmployee } from "./notification-employee";
import { NotificationUser } from "./notification-user";

export class NotificationProduct {
    productHoplink!: string;
    productDisabled!: boolean;
    users: Array<NotificationUser> = new Array<NotificationUser>();
    employees: Array<NotificationEmployee> = new Array<NotificationEmployee>();
}