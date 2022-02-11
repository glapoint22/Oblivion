import { Filters } from "./filters";
import { SummaryProduct } from "./summary-product";

export class GridData {
    public products!: Array<SummaryProduct>;
    public totalProducts!: number;
    public filters!: Filters;
    public pageCount!: number;
    public productCountStart!: number;
    public productCountEnd!: number;
}