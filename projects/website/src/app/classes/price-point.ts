import { Image } from "common";
import { AdditionalInfo } from "./additional-info";
export class PricePoint {
    header!: string;
    quantity!: string;
    image!: Image;
    unitPrice!: string;
    unit!: string;
    strikethroughPrice!: string;
    price!: string;
    additionalInfo!: Array<AdditionalInfo>;
}