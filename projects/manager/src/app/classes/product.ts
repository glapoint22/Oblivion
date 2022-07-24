import { IProduct, PricePoint, RecurringPayment, ShippingType, Subproduct } from "common";

export class Product implements IProduct {
    public id!: number;
    public name!: string;
    public shippingType!: ShippingType;
    public minPrice!: number;
    public maxPrice!: number;
    public recurringPayment!: RecurringPayment;
    public hoplink!: string;
    public pricePoints: Array<PricePoint> = new Array<PricePoint>();
    public description!: string;
    public components!: Array<Subproduct>;
    public bonuses!: Array<Subproduct>;
}