import { NotificationEmployee } from "./notification-employee";
import { NotificationUser } from "./notification-user";
import { NotificationReviewWriter } from "./notification-review-writer";

export class NotificationReviewComplaint {
    users: Array<NotificationUser> = new Array<NotificationUser>();
    employee: NotificationEmployee = new NotificationEmployee();
    reviewWriter: NotificationReviewWriter = new NotificationReviewWriter();
}