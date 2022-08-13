import { Component } from '@angular/core';
import { CarouselBanner, CarouselWidgetComponent } from 'widgets';
import { BuilderType, ImageLocation, WidgetInspectorView } from '../../classes/enums';
import { ImageReference } from '../../classes/image-reference';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'carousel-widget-dev',
  templateUrl: './carousel-widget-dev.component.html',
  styleUrls: ['./carousel-widget-dev.component.scss']
})
export class CarouselWidgetDevComponent extends CarouselWidgetComponent {
  public currentBannerIndex: number = 0;
  public widgetInspectorView = WidgetInspectorView;

  constructor(public widgetService: WidgetService) { super() }

  // ------------------------------------------------------------------------ Get Image Reference --------------------------------------------------
  public getImageReference(banner: CarouselBanner) {
    return {
      imageId: banner.image.id,
      imageSizeType: banner.image.imageSizeType,
      builder: BuilderType.Page,
      hostId: this.widgetService.page.id,
      location: ImageLocation.CarouselWidgetBanner
    }
  }

  // ------------------------------------------------------------------------ Get Image References --------------------------------------------------
  public getImageReferences(): Array<ImageReference> {
    const imageReferences: Array<ImageReference> = new Array<ImageReference>();

    this.banners.forEach((banner: CarouselBanner) => {
      if (banner.image && banner.image.src) {
        imageReferences.push(this.getImageReference(banner));
      }
    });

    return imageReferences;
  }
}