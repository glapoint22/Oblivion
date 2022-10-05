import { NotificationUser } from "./notification-user";
import { NotificationReviewWriter } from "./notification-review-writer";
import { NotificationEmployee } from "./notification-employee";

export class NotificationReview {
    reviewId!: number;
    reviewDeleted!: boolean;
    users!: Array<NotificationUser>;
    reviewWriter!: NotificationReviewWriter;
    employees!: Array<NotificationEmployee>;
}