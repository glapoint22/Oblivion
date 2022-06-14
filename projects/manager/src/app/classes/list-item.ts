import { ElementRef } from "@angular/core";
import { CaseType, ItemSelectType } from "./enums";
import { Item } from "./item";

export class ListItem extends Item {
    index?: number;
    selected?: boolean;
    hierarchyGroupID?: number;
    selectType?: ItemSelectType;
    htmlItem?: ElementRef<HTMLElement>;
    color?: string;
    opacity?: number;
    selectable?: boolean;
    editable?: boolean;
    case?: CaseType;
}