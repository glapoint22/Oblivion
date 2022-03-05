import { ListItem } from "./list-item";

export class Hierarchy extends ListItem {
    levelID!: number;
    hidden?: boolean;
    arrowDown?: boolean;
}