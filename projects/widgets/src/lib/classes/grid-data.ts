import { SummaryProduct } from "common";
import { Filters } from "./filters";

export class GridData {
    public products!: Array<SummaryProduct>;
    public totalProducts!: number;
    public filters!: Filters;
    public pageCount!: number;
    public productCountStart!: number;
    public productCountEnd!: number;
}