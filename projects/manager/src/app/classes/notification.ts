import { NotificationProfile } from "./notification-profile";
import { NotificationReviewWriter } from "./notification-review-writer";
import { NotificationUser } from "./notification-user";

export interface Notification {
    notificationId?: number;
    userName?: string;
    employeeMessageId?: number;
    employeeFirstName?: string;
    employeeLastName?: string;
    employeeImage?: string;
    employeeMessageDate?: string;
    employeeMessage?: string;
    reviewId?: number;
    reviewDeleted?: boolean;
    users?: Array<NotificationUser>;
    reviewWriter?: NotificationReviewWriter;
    employees?: Array<NotificationProfile>;
    productId?: number;
    productHoplink?: string;
    productDisabled?: boolean;
}