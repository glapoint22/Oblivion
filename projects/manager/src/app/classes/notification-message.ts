import { NotificationUser } from "./notification-user";

export class NotificationMessage extends NotificationUser {
    messageId!: number;
    senderName!: string;
    employeeReplyId!: number;
    employeeFirstName!: string;
    employeeLastName!: string;
    employeeImage!: string;
    replyDate!: string;
    reply!: string;
}