import { Product } from "./product";

export class SharedList {
    public id!: string;
    public name!: string;
    public products!: Array<Product>;
}