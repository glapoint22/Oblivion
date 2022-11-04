import { Component, Input } from '@angular/core';
import { Image, ImageSizeType, MediaType, SpinnerAction, Subproduct } from 'common';
import { MediaBrowserComponent } from '../../../media-browser/media-browser.component';
import { SubproductsComponent } from '../subproducts.component';

@Component({
  selector: 'subproduct-image',
  templateUrl: './subproduct-image.component.html',
  styleUrls: ['./subproduct-image.component.scss']
})
export class SubproductImageComponent extends SubproductsComponent {
  @Input() subproduct!: Subproduct;


  // ================================================================( OPEN MEDIA BROWSER )================================================================= \\

  public async openMediaBrowser(subproduct: Subproduct): Promise<void> {
    this.lazyLoadingService.load(async () => {
      const { MediaBrowserComponent } = await import('../../../media-browser/media-browser.component');
      const { MediaBrowserModule } = await import('../../../media-browser/media-browser.module');
      return {
        component: MediaBrowserComponent,
        module: MediaBrowserModule
      }
    }, SpinnerAction.None)
      .then((mediaBrowser: MediaBrowserComponent) => {
        // Initialize the media browser
        mediaBrowser.init(MediaType.Image, subproduct.image, ImageSizeType.Small, subproduct.name);

        // Callback
        mediaBrowser.callback = (image: Image) => {
          if (image) {
            subproduct.image.id = image.id;
            subproduct.image.name = image.name;
            subproduct.image.src = image.src;
            this.updateSubproduct(subproduct);
          }
        }
      });
  }



  // ===================================================================( REMOVE IMAGE )==================================================================== \\

  public removeImage(subproduct: Subproduct) {
    // Remove the image
    this.dataService.delete('api/Products/Subproduct/Image', { subproductId: subproduct.id }).subscribe();
    subproduct.image.src = null!;
  }
}