import { Directive, ElementRef, Input, OnChanges, QueryList, ViewChildren } from "@angular/core";
import { Params, Router } from "@angular/router";
import { FilterParam } from "./filter-param";
import { PriceFilter } from "./price-filter";
import { QueryFilter } from "./query-filter";
import { QueryFilterOption } from "./query-filter-option";

@Directive()
export class Filter<T extends QueryFilter | PriceFilter> implements OnChanges {
    @Input() filter!: T;
    @Input() filterParams!: Array<FilterParam>;
    @ViewChildren('checkbox') checkboxes!: QueryList<ElementRef<HTMLInputElement>>;

    constructor(private router: Router) { }

    ngOnChanges(): void {
        this.setFilter();
    }

    onFilterClick(value: string) {
        const filterParam = this.filterParams.find(x => x.caption == this.filter.caption);

        if (filterParam) {
            const optionIndex = filterParam.options.findIndex(x => x == value);
            if (optionIndex != -1) {
                // Remove option
                filterParam.options.splice(optionIndex, 1);
                if (filterParam.options.length == 0) {
                    const filterParmIndex = this.filterParams.findIndex(x => x == filterParam);
                    this.filterParams.splice(filterParmIndex, 1);
                }
            } else {
                // Add option
                filterParam.options.push(value);
            }
        } else {
            // Add filter param
            this.filterParams.push({
                caption: this.filter.caption,
                options: [value]
            });
        }

        // This is used for the url
        const filterString = this.buildFilterString();

        // Update the url with the new filter string
        this.updateUrl(filterString);
    }



    buildFilterString(): string {
        let filterString: string = '';

        // Build a string of filters
        // Used for the url
        this.filterParams.forEach((filterParm: FilterParam) => {
            filterString += filterParm.caption + '|';

            filterParm.options.forEach((value: string, index: number, array: Array<string>) => {
                filterString += value;

                if (index == array.length - 1) {
                    filterString += '|';
                } else {
                    filterString += ',';
                }
            });
        });

        return encodeURIComponent(filterString);
    }



    updateUrl(filterString: string) {
        // Update the url with the filter string
        const params: Params = {
            filters: filterString != '' ? filterString : null,
            page: null
        }

        this.router.navigate([location.pathname], { queryParams: params, queryParamsHandling: 'merge' });
    }


    setFilter() {
        const filterParam = this.filterParams.find(x => x.caption == this.filter.caption);

        setTimeout(() => {
            this.checkboxes.forEach((checkbox: ElementRef<HTMLInputElement>) => {
                checkbox.nativeElement.checked = filterParam ? filterParam.options.some(x => x == checkbox.nativeElement.value) : false;
            });
        });
    }


    trackFilterOption(index: number, filterOption: QueryFilterOption) {
        return filterOption.id;
    }
}