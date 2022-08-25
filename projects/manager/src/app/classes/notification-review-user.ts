import { NotificationSecurity } from "./notification-security";

export class NotificationReviewUser extends NotificationSecurity {
    notificationId!: number;
    complaint!: string;
}