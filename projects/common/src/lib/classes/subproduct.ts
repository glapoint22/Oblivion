import { IProduct } from "./i-product";
import { Image } from "./image";

export class Subproduct implements IProduct {
    public id!: number;
    public name!: string;
    public description!: string;
    public image!: Image;
    public value!: number;
}