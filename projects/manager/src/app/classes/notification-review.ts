import { NotificationEmployee } from "./notification-employee";
import { NotificationUser } from "./notification-user";
import { NotificationReviewWriter } from "./notification-review-writer";

export class NotificationReview {
    users: Array<NotificationUser> = new Array<NotificationUser>();
    reviewWriter: NotificationReviewWriter = new NotificationReviewWriter();
    employees: Array<NotificationEmployee> = new Array<NotificationEmployee>();
}