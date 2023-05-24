import { Params } from "@angular/router";

export class BreadcrumbLink {
    public name!: string;
    public route!: string;
    public queryParams?: Params;
}