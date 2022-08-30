import { NotificationEmployeeDetails } from "./notification-employee-details";
import { NotificationReviewUser } from "./notification-review-user";
import { NotificationReviewWriter } from "./notification-review-writer";

export class NotificationReviewComplaint {
    users: Array<NotificationReviewUser> = new Array<NotificationReviewUser>();
    employee: NotificationEmployeeDetails = new NotificationEmployeeDetails();
    reviewWriter: NotificationReviewWriter = new NotificationReviewWriter();
}