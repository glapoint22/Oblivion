import { RecurringPayment, ShippingType } from "common";

export class Product {
    public id!: number;
    public name!: string;
    public shippingType!: ShippingType;
    public minPrice!: number;
    public maxPrice!: number;
    public recurringPayment!: RecurringPayment;
    public hoplink!: string;
    public description!: string;
}