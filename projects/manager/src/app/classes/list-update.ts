import { ListUpdateType } from "./enums";
import { ListItem } from "./list-item";

export class ListUpdate extends ListItem {
    public index?: number;
    public type?: ListUpdateType;
    public deletedItems?: Array<ListItem>;
    public addDisabled?: boolean;
    public editDisabled?: boolean;
    public deleteDisabled?: boolean;
    public isChecked?: boolean;
    public arrowDown?: boolean;
  }