import { IProduct, PricePoint, RecurringPayment, ShippingType, Subproduct } from "common";
import { Item } from "./item";
import { NotificationItem } from "./notifications/notification-item";
import { ProductMedia } from "./product-media";
import { Vendor } from "./vendor";

export class Product implements IProduct {
    public id!: number;
    public niche: Item = new Item();
    public subniche: Item = new Item();
    public vendor!: Vendor;
    public name!: string;
    public shippingType: ShippingType = ShippingType.None;
    public minPrice!: number;
    public maxPrice!: number;
    public recurringPayment: RecurringPayment = new RecurringPayment();
    public hoplink!: string;
    public pricePoints: Array<PricePoint> = new Array<PricePoint>();
    public description!: string;
    public components!: Array<Subproduct>;
    public bonuses!: Array<Subproduct>;
    public media!: Array<ProductMedia>;
    public notificationItems: Array<NotificationItem> = new Array<NotificationItem>();
    public currency!: string;
}