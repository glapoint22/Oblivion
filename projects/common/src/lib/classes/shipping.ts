import { ShippingType } from "./enums";

export class Shipping {
    public static getShippingText(shippingType: ShippingType, value?: string): string {
        let text: string;

        switch (shippingType) {
            case ShippingType.FreeShipping:
                text = 'Free Shipping';
                break;

            case ShippingType.FreeUsShipping:
                text = 'Free US Shipping';
                break;

            case ShippingType.PlusShipping:
                text = 'Plus Shipping';
                break;

            case ShippingType.JustPayShipping:
                text = 'Just Pay Shipping';
                break;

                case ShippingType.Value:
                text = value!;
                break;

            default:
                text = '';
                break;
        }

        return text;
    }
}