import { ParamMap } from "@angular/router";

export class QueryParams {
    public search!: string | null;
    public filters!: string | null;
    public categoryId!: string | null;
    public nicheId!: string | null;
    public sort!: string | null;
    public page: number = 1;
    public limit!: number;
    // public queries!: Array<Query>;
    public id!: string | null;

    set(params: ParamMap) {
        this.search = params.get('search');
        this.filters = params.get('filters');
        this.categoryId = params.get('categoryId');
        this.nicheId = params.get('nicheId');
        this.sort = params.get('sort');
        this.page = params.has('page') ? Math.max(1, Number.parseInt(params.get('page') as string)) : 1;
        this.id = params.get('id');
    }
}