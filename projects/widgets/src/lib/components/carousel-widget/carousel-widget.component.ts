import { Component, HostListener } from '@angular/core';
import { LinkType } from 'common';
import { CarouselBanner } from '../../classes/carousel-banner';
import { CarouselWidgetData } from '../../classes/carousel-widget-data';
import { Widget } from '../../classes/widget';
import { WidgetType } from '../../classes/widget-enums';

@Component({
  selector: 'carousel-widget',
  templateUrl: './carousel-widget.component.html',
  styleUrls: ['./carousel-widget.component.scss']
})
export class CarouselWidgetComponent extends Widget {
  public banners: Array<CarouselBanner> = [];
  public linkType = LinkType;
  public changeCount: number = 0;
  private setChangeCount!: boolean;

  ngOnInit() {
    this.type = WidgetType.Carousel
  }

  setWidget(carouselWidgetData: CarouselWidgetData): void {
    if (carouselWidgetData.banners && carouselWidgetData.banners.length > 0) {
      this.banners = carouselWidgetData.banners;
    }

    super.setWidget(carouselWidgetData);
  }

  ngAfterViewChecked() {
    if (this.setChangeCount) {
      window.setTimeout(() => {
        this.setChangeCount = false;
        this.changeCount++;
      });

    }
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.setChangeCount = true;
  }
}