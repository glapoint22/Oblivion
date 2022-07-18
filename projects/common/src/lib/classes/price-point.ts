import { ShippingType } from "./enums";
import { Image } from "./image";
import { RecurringPayment } from "./recurring-payment";

export class PricePoint {
    id!: number;
    header!: string;
    quantity!: string;
    image: Image = new Image();
    unitPrice!: string;
    unit!: string;
    strikethroughPrice!: string;
    price!: string;
    shippingType: ShippingType = ShippingType.None;
    recurringPayment: RecurringPayment = new RecurringPayment();
}