import { Menu } from "./menu";
import { Prompt } from "./prompt";

export class ListOptions {
    editable?: boolean;
    selectable?: boolean;
    unselectable?: boolean;
    deletable?: boolean;
    deletePrompt?: Prompt;
    multiselectable?: boolean;
    sortable?: boolean;
    menu?: Menu;
}