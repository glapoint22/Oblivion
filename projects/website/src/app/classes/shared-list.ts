import { ListProduct } from "./list-product";

export class SharedList {
    public id!: string;
    public name!: string;
    public products!: Array<ListProduct>;
}