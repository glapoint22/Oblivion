import { UserAccountNotification } from "./user-account-notification";

export class ReviewNotification extends UserAccountNotification {
    reviewId!: string;
    title!: string;
    text!: string;
}