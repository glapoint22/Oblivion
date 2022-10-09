export interface NotificationProfilePopupUser {
    userId: string;
    nonAccountName?: string;
    noncompliantStrikes: number;
    blockNotificationSending: boolean;
    firstName: string;
    lastName: string;
    image: string;
    email: string;
    date: string;
}