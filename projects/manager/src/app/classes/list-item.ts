import { ElementRef } from "@angular/core";
import { ListItemComponent } from "../components/items/list-item/list-item.component";
import { ItemSelectType } from "./enums";
import { Item } from "./item";

export class ListItem extends Item {
    index?: number;
    selected?: boolean;
    hierarchyGroupID?: number;
    selectType?: ItemSelectType;
    identity?: ListItemComponent;
    htmlItem?: ElementRef<HTMLElement>;
}