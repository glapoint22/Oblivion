import { Component } from '@angular/core';
import { CarouselBanner } from '../../classes/carousel-banner';
import { CarouselWidgetData } from '../../classes/carousel-widget-data';
import { LinkOption } from '../../classes/enums';
import { Widget } from '../../classes/widget';

@Component({
  selector: 'carousel-widget',
  templateUrl: './carousel-widget.component.html',
  styleUrls: ['./carousel-widget.component.scss']
})
export class CarouselWidgetComponent extends Widget {
  public banners!: Array<CarouselBanner>;
  public linkOption = LinkOption;
  
  setWidget(carouselWidgetData: CarouselWidgetData): void {
      this.banners = carouselWidgetData.banners;
      super.setWidget(carouselWidgetData);
  }
}