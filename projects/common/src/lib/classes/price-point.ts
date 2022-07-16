import { AdditionalInfo } from "./additional-info";
import { Image } from "./image";

export class PricePoint {
    id!: number;
    header!: string;
    quantity!: string;
    image!: Image;
    unitPrice!: string;
    unit!: string;
    strikethroughPrice!: string;
    price!: string;
    additionalInfo!: Array<AdditionalInfo>;
}