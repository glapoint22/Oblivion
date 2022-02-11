import { Image } from "./image";

export class SummaryProduct {
    public id!: number;
    public name!: string;
    public image!: Image;
    public totalReviews!: number;
    public rating!: number;
    public minPrice!: number;
    public maxPrice!: number;
    public urlId!: string;
    public urlName!: string;
    public oneStar!: number;
    public twoStars!: number;
    public threeStars!: number;
    public fourStars!: number;
    public fiveStars!: number;
}