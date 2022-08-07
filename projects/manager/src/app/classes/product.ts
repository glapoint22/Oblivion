import { Image, IProduct, PricePoint, RecurringPayment, ShippingType, Subproduct } from "common";
import { Item } from "./item";

export class Product implements IProduct {
    public id!: number;
    public vendor: Item = new Item();
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
    public image: Image = new Image();
}