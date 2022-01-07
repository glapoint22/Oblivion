import { AdditionalInfo } from "./additional-info";
import { Collaborator } from "./collaborator";
import { Image } from "./image";
import { Media } from "./media";
import { Niche } from "./niche";
import { PricePoint } from "./price-point";
import { RelatedProducts } from "./related-products";
import { Subproduct } from "./subproduct";

export class Product {
    public id!: number;
    public urlId!: string;
    public name!: string;
    public description!: string;
    public rating!: number;
    public totalReviews!: number;
    public minPrice!: number;
    public maxPrice!: number;
    public dateAdded!: string;
    public collaborator!: Collaborator;
    public hoplink!: string;
    public image!: Image;
    public urlName!: string;
    public additionalInfo!: Array<AdditionalInfo>;
    public media!: Array<Media>;
    public components!: Array<Subproduct>;
    public bonuses!: Array<Subproduct>;
    public oneStar!: number;
    public twoStars!: number;
    public threeStars!: number;
    public fourStars!: number;
    public fiveStars!: number;
    public pricePoints!: Array<PricePoint>;
    public relatedProducts!: RelatedProducts;
    public breadcrumb!: Array<Niche>;
}