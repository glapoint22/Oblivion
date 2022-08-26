import { NotificationIdentity } from "./notification-identity";

export class NotificationMessageUser extends NotificationIdentity {
    name!: string;
    message!: string;
}