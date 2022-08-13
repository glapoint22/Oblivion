import { Menu } from "./menu";
import { Prompt } from "./prompt";

export class ListOptions {
    menu?: Menu;
    editable?: boolean;
    sortable?: boolean;
    deletable?: boolean;
    selectable?: boolean;
    deletePrompt?: Prompt;
    unselectable?: boolean;
    verifyAddEdit?: boolean;
    duplicatePrompt?: Prompt;
    multiselectable?: boolean;
}