import { ListUpdateType } from "./enums";
import { ListItem } from "./list-item";

export class ListUpdate {
  id?: number;
  name?: string;
  index?: number;
  type?: ListUpdateType;
  deletedItems?: Array<ListItem>;
  selectedItems?: Array<ListItem>;
  addDisabled?: boolean;
  editDisabled?: boolean;
  deleteDisabled?: boolean;
  isChecked?: boolean;
  arrowDown?: boolean;
  hasChildren?: boolean;
}