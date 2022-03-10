import { ElementRef } from "@angular/core";
import { ItemSelectType } from "./enums";

export class ListItem {
    id!: number;
    name!: string;
    selected?: boolean;
    selectType?: ItemSelectType;
    htmlItem?: ElementRef<HTMLElement>;
    hierarchyGroupID?: number;
}