import { ShippingType } from "./enums";
import { RecurringPayment } from "./recurring-payment";

export class AdditionalInfo {
    public id!: number;
    public isRecurring!: boolean;
    public shippingType: ShippingType = ShippingType.None;
    public recurringPayment: RecurringPayment = new RecurringPayment();
}