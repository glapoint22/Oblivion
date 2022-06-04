import { SummaryProduct } from "common";
import { Caption } from "./caption";
import { WidgetData } from "./widget-data";

export class ProductSliderWidgetData extends WidgetData {
    public caption!: Caption;
    public products!: Array<SummaryProduct>
}