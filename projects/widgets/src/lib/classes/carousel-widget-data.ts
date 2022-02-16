import { CarouselBanner } from "./carousel-banner";
import { WidgetData } from "./widget-data";

export class CarouselWidgetData extends WidgetData {
    public banners!: Array<CarouselBanner>;
}