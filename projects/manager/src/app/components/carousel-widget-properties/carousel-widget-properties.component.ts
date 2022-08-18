import { Component } from '@angular/core';
import { DataService } from 'common';
import { CarouselBanner } from 'widgets';
import { WidgetProperties } from '../../classes/widget-properties';
import { WidgetService } from '../../services/widget/widget.service';
import { CarouselWidgetDevComponent } from '../carousel-widget-dev/carousel-widget-dev.component';
import { CounterComponent } from '../counter/counter.component';

@Component({
  selector: 'carousel-widget-properties',
  templateUrl: './carousel-widget-properties.component.html',
  styleUrls: ['./carousel-widget-properties.component.scss']
})
export class CarouselWidgetPropertiesComponent extends WidgetProperties<CarouselWidgetDevComponent> {

  constructor(widgetService: WidgetService, private dataService: DataService) { super(widgetService) }


  // --------------------------------------------------------------------- Add Banner --------------------------------------------------------
  addBanner(counter: CounterComponent) {
    this.widget.banners.push(new CarouselBanner());
    counter.set(this.widget.banners.length);
    this.widget.currentBannerIndex = this.widget.banners.length - 1;
    this.update();
  }


  // --------------------------------------------------------------------- Delete Banner --------------------------------------------------------
  deleteBanner(counter: CounterComponent) {
    if (this.widget.banners[this.widget.currentBannerIndex].image && this.widget.banners[this.widget.currentBannerIndex].image.src) {
      this.dataService.post('api/Media/MediaReferences/Remove', [this.widget.banners[this.widget.currentBannerIndex].image.referenceId]).subscribe();
    }


    // Remove the banner
    this.widget.banners.splice(this.widget.currentBannerIndex, 1);

    // If we still have banners left
    if (this.widget.banners.length > 0) {
      this.widget.currentBannerIndex = Math.min(this.widget.banners.length - 1, this.widget.currentBannerIndex);
      counter.set(this.widget.currentBannerIndex + 1);
    }

    this.update();
  }
}
