import { ListUpdateType } from "./enums";

export class ItemsUpdate {
    id?: number;
    name?: string;
    index?: number;
    type?: ListUpdateType;
    deletedItems?: Array<any>;
    selectedItems?: Array<any>;
    addDisabled?: boolean;
    editDisabled?: boolean;
    deleteDisabled?: boolean;
    rightClick?: boolean;
}