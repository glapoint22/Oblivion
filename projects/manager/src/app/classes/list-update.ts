import { ListUpdateType } from "./enums";
import { ListItem } from "./list-item";

export class ListUpdate {
  id?: number;
  name?: string;
  oldName?: string;
  index?: number;
  type?: ListUpdateType;
  deletedItems?: Array<ListItem>;
  selectedItems?: Array<ListItem>;
  addDisabled?: boolean;
  editDisabled?: boolean;
  deleteDisabled?: boolean;
  rightClick?: boolean;
  items?: Array<string>;
}