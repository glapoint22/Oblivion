import { NotificationProfile } from "./notification-profile";
import { NotificationUser } from "./notification-user";

export class NotificationProduct {
    users: Array<NotificationUser> = new Array<NotificationUser>();
    employees: Array<NotificationProfile> = new Array<NotificationProfile>();
}