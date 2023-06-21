import { ShippingType } from "./enums";
import { Image } from "./image";

export class PricePoint {
    id!: number;
    header!: string;
    subheader!: string;
    quantity!: string;
    image: Image = new Image();
    price!: string;
    shippingType: ShippingType = ShippingType.None;
    text!: string;
    info!: number;
    shippingValue!: string;
}