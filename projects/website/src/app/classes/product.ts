import { Collaborator } from "./collaborator";
import { Image } from "./image";

export class Product {
    public id!: number;
    public urlId!: string;
    public title!: string;
    public rating!: number;
    public totalReviews!: number;
    public minPrice!: number;
    public maxPrice!: number;
    public dateAdded!: string;
    public collaborator!: Collaborator;
    public hoplink!: string;
    public image!: Image;
    public urlTitle!: string; 
}