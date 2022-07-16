import { PricePoint, RecurringPayment, ShippingType } from "common";

export class Product {
    public id!: number;
    public name!: string;
    public shippingType!: ShippingType;
    public minPrice!: number;
    public maxPrice!: number;
    public recurringPayment!: RecurringPayment;
    public hoplink!: string;
    public pricePoints: Array<PricePoint> = new Array<PricePoint>();
}