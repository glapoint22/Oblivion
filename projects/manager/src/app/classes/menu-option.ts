import { MenuOptionType } from "./enums";

export class MenuOption {
    type!: MenuOptionType;
    name?: string;
    shortcut?: string;
    optionFunction?: Function;
    optionFunctionParameters?: Array<any>;
    isDisabled?: boolean;
}