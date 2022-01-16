import { Caption } from "./caption";
import { Product } from "./product";
import { Query } from "./query";
import { WidgetData } from "./widget-data";

export class ProductSliderWidgetData extends WidgetData {
    public caption!: Caption;
    public queries!: Array<Query>;
    public products!: Array<Product>
}