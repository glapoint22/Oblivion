import { NotificationUser } from "./notification-user";
import { NotificationReviewWriter } from "./notification-review-writer";
import { NotificationProfile } from "./notification-profile";

export class NotificationReview {
    users: Array<NotificationUser> = new Array<NotificationUser>();
    reviewWriter: NotificationReviewWriter = new NotificationReviewWriter();
    employees: Array<NotificationProfile> = new Array<NotificationProfile>();
}