import { NotificationProfile } from "./notification-profile";

export class NotificationSecurity extends NotificationProfile {
    noncompliantStrikes!: number;
    blockNotificationSending!: boolean;
}