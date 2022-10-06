import { NotificationEmployee } from "./notification-employee";
import { NotificationUser } from "./notification-user";

export class ProductNotification {
    productHoplink!: string;
    productDisabled!: boolean;
    users!: Array<NotificationUser>;
    employeeNotes!: Array<NotificationEmployee>;
}