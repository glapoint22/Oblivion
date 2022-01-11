import { Filters } from "./filters";
import { Product } from "./product";

export class GridData {
    public products!: Array<Product>;
    public totalProducts!: number;
    public filters!: Filters;
    public pageCount!: number;
    public sortOptions: any;
    public productCountStart!: number;
    public productCountEnd!: number;
}