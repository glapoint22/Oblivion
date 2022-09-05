import { NotificationProfile } from "./notification-profile";

export class NotificationUser extends NotificationProfile {
    noncompliantStrikes!: number;
    blockNotificationSending!: boolean;
}