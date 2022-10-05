export interface NotificationProfilePopupUser {
    userId: string;
    nonAccountUserName?: string;
    noncompliantStrikes: number;
    blockNotificationSending: boolean;
    firstName: string;
    lastName: string;
    image: string;
    email: string;
    date: string;
}