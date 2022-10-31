import { Component, Input } from '@angular/core';
import { Image, ImageSizeType, MediaType, PricePoint, SpinnerAction } from 'common';
import { MediaBrowserComponent } from 'projects/manager/src/app/components/media-browser/media-browser.component';
import { PricePointComponent } from '../price-point.component';

@Component({
  selector: 'price-point-image',
  templateUrl: './price-point-image.component.html',
  styleUrls: ['../../price-point/price-point.component.scss', './price-point-image.component.scss']
})
export class PricePointImageComponent extends PricePointComponent {
  @Input() pricePoint!: PricePoint;
  
  openMediaBrowser(pricePoint: PricePoint): void {
    this.lazyLoadingService.load(async () => {
      const { MediaBrowserComponent } = await import('../../../../../media-browser/media-browser.component');
      const { MediaBrowserModule } = await import('../../../../../media-browser/media-browser.module');
      return {
        component: MediaBrowserComponent,
        module: MediaBrowserModule
      }
    }, SpinnerAction.None)
      .then((mediaBrowser: MediaBrowserComponent) => {
        // Initialize the media browser
        mediaBrowser.init(MediaType.Image, pricePoint.image, ImageSizeType.Small);

        mediaBrowser.callback = (image: Image) => {
          if (image) {

            pricePoint.image.id = image.id;
            pricePoint.image.name = image.name;
            pricePoint.image.src = image.src;
            pricePoint.image.thumbnail = image.thumbnail;

            this.updatePricePoint(pricePoint);
          }
        }
      });
  }


  onImageDelete(pricePoint: PricePoint) {
    // Delay just in case the image is being deleted by the [Enter] key.
    // If the deleting is NOT delayed, then Media Browser will think
    // no image is present and open
    window.setTimeout(() => {
      pricePoint.image = new Image();
      this.updatePricePoint(pricePoint);
    })
  }
}