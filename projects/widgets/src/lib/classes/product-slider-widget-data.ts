import { SummaryProduct } from "common";
import { Caption } from "./caption";
import { Query } from "./query";
import { WidgetData } from "./widget-data";

export class ProductSliderWidgetData extends WidgetData {
    public caption!: Caption;
    public queries!: Array<Query>;
    public products!: Array<SummaryProduct>
}