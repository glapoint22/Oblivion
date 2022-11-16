import { NicheFilters } from "./niche-filters";
import { PriceFilter } from "./price-filter";
import { QueryFilter } from "./query-filter";

export class Filters {
    nicheFilters!: NicheFilters;
    priceFilter!: PriceFilter;
    ratingFilter!: QueryFilter;
    customFilters!: Array<QueryFilter>;
}