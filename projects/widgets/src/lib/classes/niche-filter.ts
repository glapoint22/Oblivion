import { SubnicheFilters } from "./subniche-filters";

export class NicheFilter {
    id!: string;
    name!: string;
    urlName!: string;
    subnicheFilters!: SubnicheFilters;
    visible!: boolean;
    showAllSubnicheFilters!: boolean;
}