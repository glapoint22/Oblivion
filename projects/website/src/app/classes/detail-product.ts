import { AdditionalInfo, Media, PricePoint, Subproduct, SummaryProduct } from "common";
import { Niche } from "./niche";
import { RelatedProducts } from "./related-products";

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