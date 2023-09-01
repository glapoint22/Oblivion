import { Component } from '@angular/core';
import { Widget } from '../../classes/widget';
import { CarouselBanner } from '../../classes/carousel-banner';
import { LinkType } from 'common';
import { WidgetType } from '../../classes/widget-enums';
import { ImageSetWidgetData } from '../../classes/image-set-widget-data';

@Component({
  selector: 'image-set-widget',
  templateUrl: './image-set-widget.component.html',
  styleUrls: ['./image-set-widget.component.scss']
})
export class ImageSetWidgetComponent extends Widget {

  public images: Array<CarouselBanner> = [];
  public linkType = LinkType;



  // ----------------------------------------------------------- Ng On Init --------------------------------------------------------------
  ngOnInit() {
    this.type = WidgetType.ImageSet;
  }



  // ----------------------------------------------------------- Set Widget --------------------------------------------------------------
  setWidget(imageSetWidgetData: ImageSetWidgetData): void {
    if (imageSetWidgetData.images && imageSetWidgetData.images.length > 0) {
      this.images = imageSetWidgetData.images;
    }

    super.setWidget(imageSetWidgetData);
  }




  // ------------------------------------------------------------ Get Data -----------------------------------------------------------
  getData(): ImageSetWidgetData {
    const imageSetWidgetData = super.getData() as ImageSetWidgetData;

    imageSetWidgetData.images = [];

    this.images.forEach((image: CarouselBanner) => {
      const newBanner = new CarouselBanner();

      newBanner.image.setData(image.image);
      newBanner.link.setData(image.link);
      imageSetWidgetData.images.push(newBanner);
    });

    return imageSetWidgetData;
  }
}