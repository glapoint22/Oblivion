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



  // ----------------------------------------------------------- Ng On Init --------------------------------------------------------------
  ngOnInit() {
    this.type = WidgetType.Carousel
  }



  // ----------------------------------------------------------- Set Widget --------------------------------------------------------------
  setWidget(carouselWidgetData: CarouselWidgetData): void {
    if (carouselWidgetData.banners && carouselWidgetData.banners.length > 0) {
      this.banners = carouselWidgetData.banners;
    }

    super.setWidget(carouselWidgetData);
  }




  // ------------------------------------------------------ Ng After View Checked --------------------------------------------------------
  ngAfterViewChecked() {
    if (this.setChangeCount) {
      window.setTimeout(() => {
        this.setChangeCount = false;
        this.changeCount++;
      });

    }
  }



  // --------------------------------------------------------- On Window Resize --------------------------------------------------------
  @HostListener('window:resize')
  onWindowResize() {
    this.setChangeCount = true;
  }



  // ------------------------------------------------------------ Get Data -----------------------------------------------------------
  getData(): CarouselWidgetData {
    const carouselWidgetData = super.getData() as CarouselWidgetData;

    carouselWidgetData.banners = [];

    this.banners.forEach((banner: CarouselBanner) => {
      const newBanner = new CarouselBanner();

      newBanner.image.setData(banner.image);
      newBanner.link.setData(banner.link);
      carouselWidgetData.banners.push(newBanner);
    });

    return carouselWidgetData;
  }
}