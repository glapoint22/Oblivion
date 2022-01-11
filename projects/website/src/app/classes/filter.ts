import { Directive, ElementRef, Input, OnInit, QueryList, ViewChildren } from "@angular/core";
import { Params, Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { FilterParam } from "./filter-param";
import { PriceFilter } from "./price-filter";
import { QueryFilter } from "./query-filter";

@Directive()
export class Filter<T extends QueryFilter | PriceFilter> implements OnInit {
    @Input() filter!: T;
    @Input() filterParmsSubject!: BehaviorSubject<Array<FilterParam>>;
    @Input() caption!: string;
    @ViewChildren('checkbox') checkboxes!: QueryList<ElementRef<HTMLInputElement>>;
    public filterParams: Array<FilterParam> = [];

    constructor(private router: Router) { }

    ngOnInit() {
        this.filterParmsSubject
            .subscribe((filterParams: Array<FilterParam>) => {
                this.filterParams = filterParams;
                this.setFilter();
            });
    }



    onFilterClick(value: string) {
        const filterParam = this.filterParams.find(x => x.caption == this.caption);

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
                caption: this.caption,
                options: [value]
            });
        }

        const filterString = this.buildFilterString();

        this.updateUrl(filterString);
    }



    buildFilterString(): string {
        let filterString: string = '';

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
        let params: Params = {
            filters: filterString != '' ? filterString : null,
            page: null
        }

        this.router.navigate([location.pathname], { queryParams: params, queryParamsHandling: 'merge' });
    }


    setFilter() {
        const filterParam = this.filterParams.find(x => x.caption == this.caption);

        if (filterParam) {
            setTimeout(() => {
                this.checkboxes.forEach((checkbox: ElementRef<HTMLInputElement>) => {
                    checkbox.nativeElement.checked = filterParam.options.some(x => x == checkbox.nativeElement.value);
                });
            });
        }
    }
}