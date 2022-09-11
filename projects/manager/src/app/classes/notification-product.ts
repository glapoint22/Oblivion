import { NotificationProfile } from "./notification-profile";
import { NotificationUser } from "./notification-user";

export class NotificationProduct {
    productId!: number;
    productHoplink!: string;
    productDisabled!: boolean;
    users: Array<NotificationUser> = new Array<NotificationUser>();
    employees: Array<NotificationProfile> = new Array<NotificationProfile>();
}