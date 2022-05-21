import { Component } from '@angular/core';
import { CarouselBanner } from 'widgets';
import { WidgetProperties } from '../../classes/widget-properties';
import { CarouselWidgetDevComponent } from '../carousel-widget-dev/carousel-widget-dev.component';
import { CounterComponent } from '../counter/counter.component';

@Component({
  selector: 'carousel-widget-properties',
  templateUrl: './carousel-widget-properties.component.html',
  styleUrls: ['./carousel-widget-properties.component.scss']
})
export class CarouselWidgetPropertiesComponent extends WidgetProperties<CarouselWidgetDevComponent> {
  

  // --------------------------------------------------------------------- Add Banner --------------------------------------------------------
  addBanner(counter: CounterComponent) {
    this.widget.banners.push(new CarouselBanner());
    counter.set(this.widget.banners.length);
    this.widget.currentBannerIndex = this.widget.banners.length - 1;
  }


  // --------------------------------------------------------------------- Delete Banner --------------------------------------------------------
  deleteBanner(counter: CounterComponent) {
    // Remove the banner
    this.widget.banners.splice(this.widget.currentBannerIndex, 1);

    // If we still have banners left
    if (this.widget.banners.length > 0) {
      this.widget.currentBannerIndex = Math.min(this.widget.banners.length - 1, this.widget.currentBannerIndex);
      counter.set(this.widget.currentBannerIndex + 1);
    }
  }
}
