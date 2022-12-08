import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { DataService, Image, ImageSizeType, LazyLoadingService, MediaType, SpinnerAction, Video } from 'common';
import { ProductMedia } from 'projects/manager/src/app/classes/product-media';
import { ProductService } from 'projects/manager/src/app/services/product/product.service';
import { MediaBrowserComponent } from '../../../media-browser/media-browser.component';
import { MediaSelectorPopupComponent } from '../../../media-selector-popup/media-selector-popup.component';
import { MediaComponent } from '../media/media.component';

@Component({
  selector: 'product-media-display',
  templateUrl: './product-media-display.component.html',
  styleUrls: ['../media/media.component.scss', './product-media-display.component.scss']
})
export class ProductMediaDisplayComponent extends MediaComponent {
  private mediaSelectorPopup!: MediaSelectorPopupComponent;
  public mediaSelectorPopupOpen!: boolean;
  public MediaType = MediaType;

  @ViewChild('mediaSelectorPopupContainer', { read: ViewContainerRef }) mediaSelectorPopupContainer!: ViewContainerRef;

  constructor(dataService: DataService, productService: ProductService, private lazyLoadingService: LazyLoadingService) {
    super(dataService, productService);
  }



  // ====================================================================( NG ON INIT )===================================================================== \\

  ngOnInit(): void {
    if (this.product && this.product.media && this.product.media.length > 0) {
      super.ngOnInit();

      if (this.productForm.selectedProductMedia.type == MediaType.Video) {
        this.setVideo(this.productForm.selectedProductMedia);
      }
    }
  }



  // ================================================================( OPEN MEDIA BROWSER )================================================================= \\

  public async openMediaBrowser(mediaType?: MediaType): Promise<void> {
    this.lazyLoadingService.load(async () => {
      const { MediaBrowserComponent } = await import('../../../media-browser/media-browser.component');
      const { MediaBrowserModule } = await import('../../../media-browser/media-browser.module');
      return {
        component: MediaBrowserComponent,
        module: MediaBrowserModule
      }
    }, SpinnerAction.None)
      .then((mediaBrowser: MediaBrowserComponent) => {
        let media!: Image | Video;
        let productName!: string;
        let newMedia: boolean;

        // If mediaType is undefined, that means we have selected media
        if (mediaType == undefined) {

          // Selected media is image
          if (this.productForm.selectedProductMedia.type == MediaType.Image) {
            mediaType = MediaType.Image;
            media = new Image();
            media.id = this.productForm.selectedProductMedia.id;
            media.name = this.productForm.selectedProductMedia.name;
            media.src = this.productForm.selectedProductMedia.imageMd;
            media.thumbnail = this.productForm.selectedProductMedia.thumbnail;
            media.imageSizeType = ImageSizeType.Medium;
          }

          // Selected media is video
          else {
            mediaType = MediaType.Video;
            media = new Video({
              video: {
                id: this.productForm.selectedProductMedia.id,
                name: this.productForm.selectedProductMedia.name,
                thumbnail: this.productForm.selectedProductMedia.thumbnail,
                videoType: this.productForm.selectedProductMedia.videoType,
                videoId: this.productForm.selectedProductMedia.videoId
              }
            });
          }
        }

        // We are getting new media
        else {
          if (!this.product.media || this.product.media.length == 0) {
            productName = this.product.name;
          }
          newMedia = true;
        }


        // Initialize the media browser
        mediaBrowser.init(mediaType, media, ImageSizeType.Medium, productName);

        // Callback
        mediaBrowser.callback = (callbackMedia: Image | Video) => {
          // If we have new media
          if (newMedia) {
            const mediaListItemElement = document.getElementById('media-list-item') as HTMLElement;

            // Create new product media
            this.productForm.selectedProductMedia = new ProductMedia();
            this.productForm.selectedProductMedia.type = !mediaType ? MediaType.Image : mediaType;
            this.productForm.selectedProductMedia.index = this.product.media.length;
            this.productForm.selectedProductMedia.top = this.productForm.selectedProductMedia.index * this.productMediaSpacing;
            this.product.media.push(this.productForm.selectedProductMedia);

            // Scroll down to the new product media
            window.setTimeout(() => mediaListItemElement.scrollTo(0, mediaListItemElement.scrollHeight));
          }

          // Assign the properties
          this.productForm.selectedProductMedia.name = callbackMedia.name;
          this.productForm.selectedProductMedia.id = callbackMedia.id;
          this.productForm.selectedProductMedia.thumbnail = callbackMedia.thumbnail;

          // Image
          if (this.productForm.selectedProductMedia.type == MediaType.Image) {
            this.productForm.selectedProductMedia.imageMd = callbackMedia.src;
          }

          // Video
          else {
            const video = callbackMedia as Video;

            // Assign the video properties
            this.productForm.selectedProductMedia.videoType = video.videoType;
            this.productForm.selectedProductMedia.videoId = video.videoId;

            // Set the iframe with the video
            this.setVideo(this.productForm.selectedProductMedia);
          }

          // Update the database
          this.dataService.put<number>('api/Products/Media', {
            productId: this.product.id,
            productMediaId: this.productForm.selectedProductMedia.productMediaId,
            mediaId: this.productForm.selectedProductMedia.id
          }, {
            authorization: true
          }).subscribe((productMediaId: number) => {
            this.productForm.selectedProductMedia.productMediaId = productMediaId;
          });
        }
      });
  }



  // ===============================================================( REMOVE PRODUCT MEDIA )================================================================ \\

  public removeProductMedia() {
    // Remove the image
    this.dataService.delete('api/Products/Media', { id: this.productForm.selectedProductMedia.productMediaId }, {
      authorization: true
    })
      .subscribe(() => {
        let arrayIndex = this.product.media.findIndex(x => this.productForm.selectedProductMedia == x);
        let index = this.productForm.selectedProductMedia.index + 1;
        let selectedProductMedia!: ProductMedia;

        this.product.media.splice(arrayIndex, 1);

        // Reorder the media
        do {
          selectedProductMedia = this.product.media.find(x => x.index == index)!;

          if (selectedProductMedia) {
            selectedProductMedia.index--;
            selectedProductMedia.top = this.productMediaSpacing * selectedProductMedia.index;
            selectedProductMedia.transition = 'all 0ms ease 0s';
            index++;
          }

        } while (selectedProductMedia);

        // Get the next selected media
        if (this.productForm.selectedProductMedia.index == this.product.media.length) {
          selectedProductMedia = this.product.media.find(x => x.index == this.productForm.selectedProductMedia.index - 1)!;
        } else {
          selectedProductMedia = this.product.media.find(x => x.index == this.productForm.selectedProductMedia.index)!;
        }

        // Select the media
        if (selectedProductMedia) {
          this.onMediaSelect(selectedProductMedia);
        } else {
          this.productForm.selectedProductMedia = null!;
        }

        // Update the indices
        if (this.product.media.length > 0) {
          this.updateIndices();
        }

      });
  }



  // ============================================================( OPEN MEDIA SELECTOR POPUP )============================================================== \\

  openMediaSelectorPopup() {
    if (this.mediaSelectorPopupOpen) {
      this.mediaSelectorPopup.close();
      return;
    }

    this.lazyLoadingService.load(async () => {
      const { MediaSelectorPopupComponent } = await import('../../../media-selector-popup/media-selector-popup.component');
      const { MediaSelectorPopupModule } = await import('../../../media-selector-popup/media-selector-popup.module');
      return {
        component: MediaSelectorPopupComponent,
        module: MediaSelectorPopupModule
      }
    }, SpinnerAction.None, this.mediaSelectorPopupContainer)
      .then((mediaSelectorPopup: MediaSelectorPopupComponent) => {
        this.mediaSelectorPopupOpen = true;
        this.mediaSelectorPopup = mediaSelectorPopup;

        mediaSelectorPopup.callback = (mediaType: MediaType) => {
          this.openMediaBrowser(mediaType);
          mediaSelectorPopup.close();
        }

        const onMediaSelectorPopupCloseListener = this.mediaSelectorPopup.onClose.subscribe(() => {
          onMediaSelectorPopupCloseListener.unsubscribe();
          this.mediaSelectorPopupOpen = false;
        });
      });
  }
}