import { NotificationEmployee } from "./notification-employee";

export class NotificationUser extends NotificationEmployee {
    userId!: string;
    noncompliantStrikes!: number;
    blockNotificationSending!: boolean;
}