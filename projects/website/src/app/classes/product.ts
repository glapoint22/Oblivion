import { AdditionalInfo } from "./additional-info";
import { Collaborator } from "./collaborator";
import { Image } from "./image";
import { Media } from "./media";
import { Review } from "./review";
import { Subproduct } from "./subproduct";

export class Product {
    public id!: number;
    public urlId!: string;
    public title!: string;
    public description!: string;
    public rating!: number;
    public totalReviews!: number;
    public minPrice!: number;
    public maxPrice!: number;
    public dateAdded!: string;
    public collaborator!: Collaborator;
    public hoplink!: string;
    public image!: Image;
    public urlTitle!: string;
    public additionalInfo!: Array<AdditionalInfo>;
    public media!: Array<Media>;
    public components!: Array<Subproduct>;
    public bonuses!: Array<Subproduct>;
    public oneStar!: number;
    public twoStars!: number;
    public threeStars!: number;
    public fourStars!: number;
    public fiveStars!: number;
    public reviews!: Array<Review>;
}