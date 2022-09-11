import { Menu } from "./menu";
import { Prompt } from "./prompt";

export class ListOptions {
    menu?: Menu;
    cursor?: string;
    editable?: boolean;
    sortable?: boolean;
    deletable?: boolean;
    selectable?: boolean;
    deletePrompt?: Prompt;
    unselectable?: boolean;
    showSelection?: boolean;
    verifyAddEdit?: boolean;
    duplicatePrompt?: Prompt;
    multiselectable?: boolean;
}