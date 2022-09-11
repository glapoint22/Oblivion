import { NotificationProfile } from "./notification-profile";

export class NotificationUser extends NotificationProfile {
    userId!: string;
    noncompliantStrikes!: number;
    blockNotificationSending!: boolean;
}