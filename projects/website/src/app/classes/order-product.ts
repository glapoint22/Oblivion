import { Image } from "common";

export class OrderProduct {
    public name!: string;
    public quantity!: number;
    public price!: number;
    public image!: Image;
    public rebillFrequency!: string;
    public rebillAmount!: number;
    public paymentsRemaining!: number;
    public urlName!: string;
    public productId!: string;
    public disabled!: boolean;
}