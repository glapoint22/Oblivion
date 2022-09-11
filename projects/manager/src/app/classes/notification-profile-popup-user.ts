export interface NotificationProfilePopupUser {
    userId: string;
    userName?: string;
    noncompliantStrikes: number;
    blockNotificationSending: boolean;
    firstName: string;
    lastName: string;
    image: string;
    email: string;
}