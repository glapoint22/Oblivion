import { Type } from "@angular/core";
import { LazyLoad } from "./lazy-load";

export class LazyLoadResult<T1 extends LazyLoad, T2> {
    component!: Type<T1>;
    module!: Type<T2>;
}