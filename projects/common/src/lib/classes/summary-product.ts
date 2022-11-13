import { Image } from "./image";

export class SummaryProduct {
    public id!: string;
    public name!: string;
    public image!: Image;
    public totalReviews!: number;
    public rating!: number;
    public minPrice!: number;
    public maxPrice!: number;
    public urlName!: string;
    public oneStar!: number;
    public twoStars!: number;
    public threeStars!: number;
    public fourStars!: number;
    public fiveStars!: number;
}