import { NichesFilter } from "./niches-filter";
import { PriceFilter } from "./price-filter";
import { QueryFilter } from "./query-filter";

export class Filters {
    nichesFilter!: NichesFilter;
    priceFilter!: PriceFilter;
    ratingFilter!: QueryFilter;
    customFilters!: Array<QueryFilter>;
}