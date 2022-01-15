import { Filters } from "./filters";
import { Product } from "./product";

export class GridWidget {
    public products!: Array<Product>;
    public totalProducts!: number;
    public filters!: Filters;
    public pageCount!: number;
    public productCountStart!: number;
    public productCountEnd!: number;
}