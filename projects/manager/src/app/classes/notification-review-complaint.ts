import { NotificationEmployee } from "./notification-employee";
import { NotificationReviewUser } from "./notification-review-user";
import { NotificationReviewWriter } from "./notification-review-writer";

export class NotificationReviewComplaint {
    user: Array<NotificationReviewUser> = new Array<NotificationReviewUser>();
    employee: NotificationEmployee = new NotificationEmployee();
    reviewWriter: NotificationReviewWriter = new NotificationReviewWriter();
}