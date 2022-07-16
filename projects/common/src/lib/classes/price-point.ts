import { ShippingType } from "./enums";
import { Image } from "./image";
import { RecurringPayment } from "./recurring-payment";

export class PricePoint {
    id!: number;
    header!: string;
    quantity!: string;
    image!: Image;
    unitPrice!: string;
    unit!: string;
    strikethroughPrice!: string;
    price!: string;
    shippingType!: ShippingType;
    recurringPayment: RecurringPayment = new RecurringPayment();
}