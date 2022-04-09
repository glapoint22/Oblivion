import { ElementRef } from "@angular/core";

export class MultiColumnItemValue {
    name!: string;
    width!: string;
    allowEdit?: boolean;
    htmlValue?: ElementRef<HTMLElement>;
}