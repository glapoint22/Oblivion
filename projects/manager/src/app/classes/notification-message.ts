import { NotificationUser } from "./notification-user";

export class NotificationMessage extends NotificationUser {
    notificationId!: number;
    userName!: string;
    employeeFirstName!: string;
    employeeLastName!: string;
    employeeImage!: string;
    employeeMessageDate!: string;
    employeeMessage!: string;
}