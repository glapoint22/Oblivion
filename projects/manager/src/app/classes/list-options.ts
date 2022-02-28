import { MenuOption } from "./menu-option";

export class ListOptions {
    currentObj?: Object;
    allowDelete?: boolean;
    onAddItem?: Function;
    onEditItem?: Function;
    onDeleteItem?: Function;
    noMultiSelect?: boolean;
    doubleClick?: boolean;
    menuOptions?: Array<MenuOption> = new Array<MenuOption>();
}