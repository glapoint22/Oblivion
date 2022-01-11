import { ParamMap } from "@angular/router";
import { Query } from "./query";

export class QueryParams {
    search!: string | null;
    filters!: string | null;
    categoryId!: string | null;
    nicheId!: string | null;
    sort!: string | null;
    page: number = 1;
    limit!: number;
    queries!: Array<Query>;
    id!: string | null;

    set(queryParams: ParamMap, params?: ParamMap) {
        this.search = queryParams.get('search');
        this.filters = queryParams.get('filters');
        this.categoryId = queryParams.get('categoryId');
        this.nicheId = queryParams.get('nicheId');
        this.sort = queryParams.get('sort');
        this.page = queryParams.has('page') ? Math.max(1, Number.parseInt(queryParams.get('page') as string)) : 1;
        this.id = params ? params.get('id') : null;
    }
}