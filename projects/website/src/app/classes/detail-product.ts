import { Media, SummaryProduct } from "common";
import { AdditionalInfo } from "./additional-info";
import { Niche } from "./niche";
import { PricePoint } from "./price-point";
import { RelatedProducts } from "./related-products";
import { Subproduct } from "./subproduct";

export class DetailProduct extends SummaryProduct {
    public description!: string;
    public hoplink!: string;
    public additionalInfo!: Array<AdditionalInfo>;
    public media!: Array<Media>;
    public components!: Array<Subproduct>;
    public bonuses!: Array<Subproduct>;
    public pricePoints!: Array<PricePoint>;
    public relatedProducts!: RelatedProducts;
    public breadcrumb!: Array<Niche>;
}