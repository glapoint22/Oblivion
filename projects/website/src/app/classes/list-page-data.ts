import { List } from "./list";
import { ListProduct } from "./list-product";

export class ListPageData{
    lists!: Array<List>;
    products!: Array<ListProduct>;
    selectedList!: List;
}