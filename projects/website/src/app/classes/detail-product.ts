import { Media, RecurringPayment, ShippingType, SummaryProduct } from "common";
import { Niche } from "./niche";

export class DetailProduct extends SummaryProduct {
    public description!: string;
    public hoplink!: string;
    public shippingType!: ShippingType;
    public recurringPayment!: RecurringPayment;
    public media!: Array<Media>;
    public breadcrumb!: Array<Niche>;
    public currency!: string;
}