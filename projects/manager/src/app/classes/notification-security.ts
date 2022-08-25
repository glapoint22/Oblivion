import { NotificationPerson } from "./notification-person";

export class NotificationSecurity extends NotificationPerson {
    noncompliantStrikes!: string;
    blockNotificationSending!: boolean;
}