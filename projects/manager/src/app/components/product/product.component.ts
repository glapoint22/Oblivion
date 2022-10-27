import { Component, ElementRef, ViewChild, ViewContainerRef, ViewRef } from '@angular/core';
import { HierarchyItem } from '../../classes/hierarchy-item';
import { MultiColumnItem } from '../../classes/multi-column-item';
import { DataService, Image, ImageSizeType, LazyLoadingService, MediaType, PricePoint, RecurringPayment, Shipping, ShippingType, SpinnerAction, Subproduct, Video } from 'common';
import { PopupArrowPosition, SubproductType } from '../../classes/enums';
import { Product } from '../../classes/product';
import { ProductService } from '../../services/product/product.service';
import { FiltersPopupComponent } from '../filters-popup/filters-popup.component';
import { HoplinkPopupComponent } from '../hoplink-popup/hoplink-popup.component';
import { KeywordsPopupComponent } from '../keywords-popup/keywords-popup.component';
import { PricePointsComponent } from '../price-points/price-points.component';
import { PricePopupComponent } from '../price-popup/price-popup.component';
import { ProductGroupsPopupComponent } from '../product-groups-popup/product-groups-popup.component';
import { RecurringPopupComponent } from '../recurring-popup/recurring-popup.component';
import { ShippingPopupComponent } from '../shipping-popup/shipping-popup.component';
import { VendorPopupComponent } from '../vendor-popup/vendor-popup.component';
import { MediaBrowserComponent } from '../media-browser/media-browser.component';
import { CheckboxMultiColumnItem } from '../../classes/checkbox-multi-column-item';
import { CheckboxItem } from '../../classes/checkbox-item';
import { KeywordCheckboxItem } from '../../classes/keyword-checkbox-item';
import { KeywordCheckboxMultiColumnItem } from '../../classes/keyword-checkbox-multi-column-item';
import { ProductMedia } from '../../classes/product-media';
import { MediaSelectorPopupComponent } from '../media-selector-popup/media-selector-popup.component';
import { ProductNotificationPopupComponent } from '../notifications/product-notification-popup/product-notification-popup.component';
import { NotificationItem } from '../../classes/notifications/notification-item';

@Component({
  selector: 'product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {
  private notificationPopup!: ProductNotificationPopupComponent;
  private filtersPopup!: FiltersPopupComponent;
  private keywordsPopup!: KeywordsPopupComponent;
  private productGroupsPopup!: ProductGroupsPopupComponent;
  private pricePopup!: PricePopupComponent;
  private shippingPopup!: ShippingPopupComponent;
  private recurringPopup!: RecurringPopupComponent;
  private hoplinkPopup!: HoplinkPopupComponent;
  private mediaSelectorPopup!: MediaSelectorPopupComponent;

  public viewRef!: ViewRef;
  public vendorPopup!: VendorPopupComponent;
  public zIndex!: number;
  public product: Product = new Product();
  public shippingType = ShippingType;
  public PopupArrowPosition = PopupArrowPosition;
  public shipping = Shipping;
  public subproductType = SubproductType;
  public productFilterArray: Array<CheckboxItem> = new Array<CheckboxItem>();
  public productFilterSearchArray: Array<CheckboxMultiColumnItem> = new Array<CheckboxMultiColumnItem>();
  public availableKeywordArray: Array<HierarchyItem> = new Array<HierarchyItem>();
  public availableKeywordSearchArray: Array<MultiColumnItem> = new Array<MultiColumnItem>();
  public selectedKeywordArray: Array<KeywordCheckboxItem> = new Array<KeywordCheckboxItem>();
  public selectedKeywordSearchArray: Array<KeywordCheckboxMultiColumnItem> = new Array<KeywordCheckboxMultiColumnItem>();
  public productProductGroupArray: Array<CheckboxItem> = new Array<CheckboxItem>();
  public productProductGroupSearchArray: Array<CheckboxItem> = new Array<CheckboxItem>();
  public selectedMedia!: ProductMedia;
  public MediaType = MediaType;
  public productMediaSpacing: number = 57;
  public shippingPopupOpen!: boolean;
  public pricePopupOpen!: boolean;
  public recurringPopupOpen!: boolean;
  public hoplinkPopupOpen!: boolean;
  public mediaSelectorPopupOpen!: boolean;


  @ViewChild('pricePoints') pricePoints!: PricePointsComponent;
  @ViewChild('addPricePopup', { read: ViewContainerRef }) addPricePopup!: ViewContainerRef;
  @ViewChild('editPricePopup', { read: ViewContainerRef }) editPricePopup!: ViewContainerRef;
  @ViewChild('addShippingPopup', { read: ViewContainerRef }) addShippingPopupContainer!: ViewContainerRef;
  @ViewChild('editShippingPopup', { read: ViewContainerRef }) editShippingPopup!: ViewContainerRef;
  @ViewChild('addRecurringPopup', { read: ViewContainerRef }) addRecurringPopup!: ViewContainerRef;
  @ViewChild('editRecurringPopup', { read: ViewContainerRef }) editRecurringPopup!: ViewContainerRef;
  @ViewChild('addHoplinkPopup', { read: ViewContainerRef }) addHoplinkPopup!: ViewContainerRef;
  @ViewChild('editHoplinkPopup', { read: ViewContainerRef }) editHoplinkPopup!: ViewContainerRef;
  @ViewChild('notificationPopup', { read: ViewContainerRef }) notificationPopupContainer!: ViewContainerRef;
  @ViewChild('vendorPopup', { read: ViewContainerRef }) vendorPopupContainer!: ViewContainerRef;
  @ViewChild('filtersPopup', { read: ViewContainerRef }) filtersPopupContainer!: ViewContainerRef;
  @ViewChild('keywordsPopup', { read: ViewContainerRef }) keywordsPopupContainer!: ViewContainerRef;
  @ViewChild('productGroupsPopup', { read: ViewContainerRef }) productGroupsPopupContainer!: ViewContainerRef;
  @ViewChild('mediaSelectorPopupContainer', { read: ViewContainerRef }) mediaSelectorPopupContainer!: ViewContainerRef;


  constructor(private lazyLoadingService: LazyLoadingService, private dataService: DataService, private productService: ProductService) { }

  ngOnInit() {
    if (this.product && this.product.media && this.product.media.length > 0) {
      this.selectedMedia = this.product.media[0];

      for (let i = 0; i < this.product.media.length; i++) {
        const productMedia = this.product.media[i];

        productMedia.top = this.productMediaSpacing * productMedia.index;
      }

      if (this.selectedMedia.type == MediaType.Video) {
        this.setVideo(this.selectedMedia);
      }
    }
  }


  openNotificationPopup(notificationItem?: NotificationItem) {
    if (this.vendorPopupContainer.length > 0) this.vendorPopupContainer.remove(0);
    if (this.filtersPopupContainer.length > 0) this.filtersPopupContainer.remove(0);
    if (this.keywordsPopupContainer.length > 0) this.keywordsPopupContainer.remove(0);
    if (this.productGroupsPopupContainer.length > 0) this.productGroupsPopupContainer.remove(0);

    // If the popup is already open
    if (this.notificationPopupContainer.length > 0) {
      // And it's being opened again from the notification list
      if (notificationItem) {
        // Keep it open and select the notification type in the dropdown that's the same as
        // notification type of the notification that was just selected in the notification list
        this.notificationPopup.selectNotificationType(notificationItem, true);

        // But if the circle button is being clicked
      } else {
        // Just close the popup
        this.notificationPopup.close();
      }
      return;
    }



    this.lazyLoadingService.load(async () => {
      const { ProductNotificationPopupComponent } = await import('../notifications/product-notification-popup/product-notification-popup.component');
      const { ProductNotificationPopupModule } = await import('../notifications/product-notification-popup/product-notification-popup.module');
      return {
        component: ProductNotificationPopupComponent,
        module: ProductNotificationPopupModule
      }
    }, SpinnerAction.None, this.notificationPopupContainer)
      .then((notificationPopup: ProductNotificationPopupComponent) => {
        this.notificationPopup = notificationPopup;
        notificationPopup.fromProduct = true;
        // If this popup is being opened from the notification list
        if (notificationItem) notificationPopup.notificationItem = notificationItem!;
        notificationPopup.notificationItems = this.product.notificationItems;
      });
  }


  openVendorPopup() {
    if (this.notificationPopupContainer.length > 0) this.notificationPopupContainer.remove(0);
    if (this.filtersPopupContainer.length > 0) this.filtersPopupContainer.remove(0);
    if (this.keywordsPopupContainer.length > 0) this.keywordsPopupContainer.remove(0);
    if (this.productGroupsPopupContainer.length > 0) this.productGroupsPopupContainer.remove(0);

    if (this.vendorPopupContainer.length > 0) {
      this.vendorPopup.close();
      return;
    }

    this.lazyLoadingService.load(async () => {
      const { VendorPopupComponent } = await import('../vendor-popup/vendor-popup.component');
      const { VendorPopupModule } = await import('../vendor-popup/vendor-popup.module');
      return {
        component: VendorPopupComponent,
        module: VendorPopupModule
      }
    }, SpinnerAction.None, this.vendorPopupContainer)
      .then((vendorPopup: VendorPopupComponent) => {
        this.vendorPopup = vendorPopup;
        vendorPopup.product = this.product
      });
  }





  openFiltersPopup() {
    if (this.notificationPopupContainer.length > 0) this.notificationPopupContainer.remove(0);
    if (this.vendorPopupContainer.length > 0) this.vendorPopupContainer.remove(0);
    if (this.keywordsPopupContainer.length > 0) this.keywordsPopupContainer.remove(0);
    if (this.productGroupsPopupContainer.length > 0) this.productGroupsPopupContainer.remove(0);

    if (this.filtersPopupContainer.length > 0) {
      this.filtersPopup.close();
      return;
    }

    this.lazyLoadingService.load(async () => {
      const { FiltersPopupComponent } = await import('../filters-popup/filters-popup.component');
      const { FiltersPopupModule } = await import('../filters-popup/filters-popup.module');
      return {
        component: FiltersPopupComponent,
        module: FiltersPopupModule
      }
    }, SpinnerAction.None, this.filtersPopupContainer)
      .then((filtersPopup: FiltersPopupComponent) => {
        this.filtersPopup = filtersPopup;
        filtersPopup.productId = this.product.id;
        filtersPopup.productIndex = this.productService.products.indexOf(this);
      });
  }



  openKeywordsPopup() {
    if (this.notificationPopupContainer.length > 0) this.notificationPopupContainer.remove(0);
    if (this.vendorPopupContainer.length > 0) this.vendorPopupContainer.remove(0);
    if (this.filtersPopupContainer.length > 0) this.filtersPopupContainer.remove(0);
    if (this.productGroupsPopupContainer.length > 0) this.productGroupsPopupContainer.remove(0);

    if (this.keywordsPopupContainer.length > 0) {
      this.keywordsPopup.close();
      return;
    }

    this.lazyLoadingService.load(async () => {
      const { KeywordsPopupComponent } = await import('../keywords-popup/keywords-popup.component');
      const { KeywordsPopupModule } = await import('../keywords-popup/keywords-popup.module');
      return {
        component: KeywordsPopupComponent,
        module: KeywordsPopupModule
      }
    }, SpinnerAction.None, this.keywordsPopupContainer)
      .then((keywordsPopup: KeywordsPopupComponent) => {
        this.keywordsPopup = keywordsPopup;
        keywordsPopup.productId = this.product.id;
        keywordsPopup.productIndex = this.productService.products.indexOf(this);
      });
  }


  openProductGroupsPopup() {
    if (this.notificationPopupContainer.length > 0) this.notificationPopupContainer.remove(0);
    if (this.vendorPopupContainer.length > 0) this.vendorPopupContainer.remove(0);
    if (this.filtersPopupContainer.length > 0) this.filtersPopupContainer.remove(0);
    if (this.keywordsPopupContainer.length > 0) this.keywordsPopupContainer.remove(0);

    if (this.productGroupsPopupContainer.length > 0) {
      this.productGroupsPopup.close();
      return;
    }

    this.lazyLoadingService.load(async () => {
      const { ProductGroupsPopupComponent } = await import('../product-groups-popup/product-groups-popup.component');
      const { ProductGroupsPopupModule } = await import('../product-groups-popup/product-groups-popup.module');
      return {
        component: ProductGroupsPopupComponent,
        module: ProductGroupsPopupModule
      }
    }, SpinnerAction.None, this.productGroupsPopupContainer)
      .then((productGroupsPopup: ProductGroupsPopupComponent) => {
        this.productGroupsPopup = productGroupsPopup;
        productGroupsPopup.productId = this.product.id;
        productGroupsPopup.productIndex = this.productService.products.indexOf(this);
      });
  }



  openPricePopup(arrowPosition: PopupArrowPosition) {
    if (this.pricePopupOpen) {
      this.pricePopup.close();
      return;
    }

    this.lazyLoadingService.load(async () => {
      const { PricePopupComponent } = await import('../price-popup/price-popup.component');
      const { PricePopupModule } = await import('../price-popup/price-popup.module');
      return {
        component: PricePopupComponent,
        module: PricePopupModule
      }
    }, SpinnerAction.None, arrowPosition == PopupArrowPosition.TopLeft ? this.addPricePopup : this.editPricePopup)
      .then((pricePopup: PricePopupComponent) => {
        this.pricePopupOpen = true;
        this.pricePopup = pricePopup;
        pricePopup.arrowPosition = arrowPosition;
        pricePopup.price = this.product.minPrice;

        pricePopup.callback = (price: number) => {

          // If a price is being added
          if (this.product.minPrice == null) {

            this.dataService.post('api/Products/Price', {
              productId: this.product.id,
              price: price
            }).subscribe();

            // If a price is being updated
          } else {

            this.dataService.put('api/Products/Price', {
              productId: this.product.id,
              price: price
            }).subscribe();
          }
          this.product.minPrice = price;
        }

        const onPricePopupCloseListener = this.pricePopup.onClose.subscribe(() => {
          onPricePopupCloseListener.unsubscribe();
          this.pricePopupOpen = false;
        });
      });
  }


  openShippingPopup(arrowPosition: PopupArrowPosition) {
    if (this.shippingPopupOpen) {
      this.shippingPopup.close();
      return;
    }

    this.lazyLoadingService.load(async () => {
      const { ShippingPopupComponent } = await import('../shipping-popup/shipping-popup.component');
      const { ShippingPopupModule } = await import('../shipping-popup/shipping-popup.module');
      return {
        component: ShippingPopupComponent,
        module: ShippingPopupModule
      }
    }, SpinnerAction.None, arrowPosition == PopupArrowPosition.TopLeft ? this.addShippingPopupContainer : this.editShippingPopup)
      .then((shippingPopup: ShippingPopupComponent) => {
        this.shippingPopupOpen = true;
        this.shippingPopup = shippingPopup;
        shippingPopup.arrowPosition = arrowPosition;
        shippingPopup.shipping = arrowPosition == PopupArrowPosition.TopLeft ? ShippingType.FreeShipping : this.product.shippingType;
        shippingPopup.callback = (shippingType: ShippingType) => {
          this.product.shippingType = shippingType;
          this.updateShipping();
        }

        const onShippingPopupCloseListener = this.shippingPopup.onClose.subscribe(() => {
          onShippingPopupCloseListener.unsubscribe();
          this.shippingPopupOpen = false;
        });
      });
  }


  updateShipping() {
    this.dataService.put('api/Products/Shipping', {
      id: this.product.id,
      shippingType: this.product.shippingType
    }).subscribe();
  }


  openRecurringPopup(arrowPosition: PopupArrowPosition) {
    if (this.recurringPopupOpen) {
      this.recurringPopup.close();
      return;
    }

    this.lazyLoadingService.load(async () => {
      const { RecurringPopupComponent } = await import('../recurring-popup/recurring-popup.component');
      const { RecurringPopupModule } = await import('../recurring-popup/recurring-popup.module');
      return {
        component: RecurringPopupComponent,
        module: RecurringPopupModule
      }
    }, SpinnerAction.None, arrowPosition == PopupArrowPosition.TopLeft ? this.addRecurringPopup : this.editRecurringPopup)
      .then((recurringPopup: RecurringPopupComponent) => {
        this.recurringPopupOpen = true;
        this.recurringPopup = recurringPopup;
        recurringPopup.arrowPosition = arrowPosition;

        if (this.product.recurringPayment) {
          recurringPopup.recurringPayment.recurringPrice = this.product.recurringPayment.recurringPrice;
          recurringPopup.recurringPayment.rebillFrequency = this.product.recurringPayment.rebillFrequency;
          recurringPopup.recurringPayment.subscriptionDuration = this.product.recurringPayment.subscriptionDuration;
          recurringPopup.recurringPayment.timeFrameBetweenRebill = this.product.recurringPayment.timeFrameBetweenRebill;
          recurringPopup.recurringPayment.trialPeriod = this.product.recurringPayment.trialPeriod;
        }

        recurringPopup.callback = (recurringPayment: RecurringPayment) => {
          this.product.recurringPayment = recurringPayment;

          if (this.product.recurringPayment.recurringPrice == 0) {
            this.removeRecurringPayment();
          } else {
            this.updateRecurringPayment();
          }
        }

        const onRecurringPopupCloseListener = this.recurringPopup.onClose.subscribe(() => {
          onRecurringPopupCloseListener.unsubscribe();
          this.recurringPopupOpen = false;
        });
      });
  }


  updateRecurringPayment() {
    this.dataService.put('api/Products/RecurringPayment', {
      id: this.product.id,
      recurringPayment: this.product.recurringPayment
    }).subscribe();
  }


  removeRecurringPayment() {
    this.product.recurringPayment.rebillFrequency = 0;
    this.product.recurringPayment.recurringPrice = 0;
    this.product.recurringPayment.subscriptionDuration = 0;
    this.product.recurringPayment.timeFrameBetweenRebill = 0;
    this.product.recurringPayment.trialPeriod = 0;

    this.updateRecurringPayment();
  }


  openHoplinkPopup(arrowPosition: PopupArrowPosition) {
    if (this.hoplinkPopupOpen) {
      this.hoplinkPopup.close();
      return;
    }

    this.lazyLoadingService.load(async () => {
      const { HoplinkPopupComponent } = await import('../hoplink-popup/hoplink-popup.component');
      const { HoplinkPopupModule } = await import('../hoplink-popup/hoplink-popup.module');
      return {
        component: HoplinkPopupComponent,
        module: HoplinkPopupModule
      }
    }, SpinnerAction.None, arrowPosition == PopupArrowPosition.TopLeft ? this.addHoplinkPopup : this.editHoplinkPopup)
      .then((hoplinkPopup: HoplinkPopupComponent) => {
        this.hoplinkPopupOpen = true;
        this.hoplinkPopup = hoplinkPopup;
        hoplinkPopup.arrowPosition = arrowPosition;
        hoplinkPopup.hoplink = this.product.hoplink;
        hoplinkPopup.callback = (hoplink: string) => {
          this.product.hoplink = hoplink;

          this.dataService.put('api/Products/Hoplink', {
            id: this.product.id,
            hoplink: this.product.hoplink
          }).subscribe();
        }


        const onHoplinkPopupCloseListener = this.hoplinkPopup.onClose.subscribe(() => {
          onHoplinkPopupCloseListener.unsubscribe();
          this.hoplinkPopupOpen = false;
        });
      });
  }


  addPricePoint() {
    // If the product currently has a single price
    if (this.product.minPrice != null) {
      // Remove that single price from the database
      this.dataService.delete('api/Products/Price', { productId: this.product.id }).subscribe();
    }

    // Add a price point to the product
    this.product.pricePoints.push(new PricePoint());

    // Wait a frame so that the pricepoints component can be referenced
    window.setTimeout(() => {
      // Create the price point range
      this.pricePoints.updateMinMaxPrice();
      // Add the price point to the database
      this.pricePoints.addPricePoint();
    })
  }


  addSubproduct(type: SubproductType) {
    let subproduct: Subproduct;

    if (type == SubproductType.Component) {
      this.product.components = [];
      this.product.components.push(new Subproduct());
      subproduct = this.product.components[0];
    } else {
      this.product.bonuses = [];
      this.product.bonuses.push(new Subproduct());
      subproduct = this.product.bonuses[0];
    }



    this.dataService.post<number>('api/Products/Subproduct', {
      productId: this.product.id,
      type: type
    }).subscribe((id: number) => {
      subproduct.id = id;
    });
  }


  // --------------------------------------------------- Open Media Browser ---------------------------------------------------
  public async openMediaBrowser(mediaType?: MediaType): Promise<void> {
    this.lazyLoadingService.load(async () => {
      const { MediaBrowserComponent } = await import('../media-browser/media-browser.component');
      const { MediaBrowserModule } = await import('../media-browser/media-browser.module');
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
          if (this.selectedMedia.type == MediaType.Image) {
            mediaType = MediaType.Image;
            media = new Image();
            media.id = this.selectedMedia.id;
            media.name = this.selectedMedia.name;
            media.src = this.selectedMedia.imageMd;
            media.thumbnail = this.selectedMedia.thumbnail;
            media.imageSizeType = ImageSizeType.Medium;
          }

          // Selected media is video
          else {
            mediaType = MediaType.Video;
            media = new Video({
              video: {
                id: this.selectedMedia.id,
                name: this.selectedMedia.name,
                thumbnail: this.selectedMedia.thumbnail,
                videoType: this.selectedMedia.videoType,
                videoId: this.selectedMedia.videoId
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
            this.selectedMedia = new ProductMedia();
            this.selectedMedia.type = !mediaType ? MediaType.Image : mediaType;
            this.selectedMedia.index = this.product.media.length;
            this.selectedMedia.top = this.selectedMedia.index * this.productMediaSpacing;
            this.product.media.push(this.selectedMedia);

            // Scroll down to the new product media
            window.setTimeout(() => mediaListItemElement.scrollTo(0, mediaListItemElement.scrollHeight));
          }

          // Assign the properties
          this.selectedMedia.name = callbackMedia.name;
          this.selectedMedia.id = callbackMedia.id;
          this.selectedMedia.thumbnail = callbackMedia.thumbnail;

          // Image
          if (this.selectedMedia.type == MediaType.Image) {
            this.selectedMedia.imageMd = callbackMedia.src;
          }

          // Video
          else {
            const video = callbackMedia as Video;

            // Assign the video properties
            this.selectedMedia.videoType = video.videoType;
            this.selectedMedia.videoId = video.videoId;

            // Set the iframe with the video
            this.setVideo(this.selectedMedia);
          }


          // Update the database
          this.dataService.put<number>('api/Products/Media', {
            productId: this.product.id,
            productMediaId: this.selectedMedia.productMediaId,
            mediaId: this.selectedMedia.id
          }).subscribe((productMediaId: number) => {
            this.selectedMedia.productMediaId = productMediaId;
          });
        }
      });
  }


  // --------------------------------------------------- Remove Product Media ---------------------------------------------------
  public removeProductMedia() {
    // Remove the image
    this.dataService.delete('api/Products/Media', { id: this.selectedMedia.productMediaId })
      .subscribe(() => {
        let arrayIndex = this.product.media.findIndex(x => this.selectedMedia == x);
        let index = this.selectedMedia.index + 1;
        let selectedMedia!: ProductMedia;

        this.product.media.splice(arrayIndex, 1);

        // Reorder the media
        do {
          selectedMedia = this.product.media.find(x => x.index == index)!;

          if (selectedMedia) {
            selectedMedia.index--;
            selectedMedia.top = this.productMediaSpacing * selectedMedia.index;
            selectedMedia.transition = 'all 0ms ease 0s';
            index++;
          }

        } while (selectedMedia);

        // Get the next selected media
        if (this.selectedMedia.index == this.product.media.length) {
          selectedMedia = this.product.media.find(x => x.index == this.selectedMedia.index - 1)!;
        } else {
          selectedMedia = this.product.media.find(x => x.index == this.selectedMedia.index)!;
        }

        // Select the media
        if (selectedMedia) {
          this.onMediaSelect(selectedMedia);
        } else {
          this.selectedMedia = null!;
        }

        // Update the indices
        if (this.product.media.length > 0) {
          this.updateIndices();
        }

      });
  }













  // --------------------------------------------------- Open Media Selector Popup ---------------------------------------------------
  openMediaSelectorPopup() {
    if (this.mediaSelectorPopupOpen) {
      this.mediaSelectorPopup.close();
      return;
    }

    this.lazyLoadingService.load(async () => {
      const { MediaSelectorPopupComponent } = await import('../media-selector-popup/media-selector-popup.component');
      const { MediaSelectorPopupModule } = await import('../media-selector-popup/media-selector-popup.module');
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







  // --------------------------------------------------- On Mousedown ---------------------------------------------------
  onMousedown(mousedownEvent: MouseEvent) {
    const mediaContainerElement = (mousedownEvent.target as HTMLElement).parentElement?.parentElement!;
    const mediaContainerElementScrollHeight = mediaContainerElement.scrollHeight;
    const mediaContainerElementHeight = mediaContainerElement.clientHeight;
    let currentMediaTop: number;
    let yPos = mousedownEvent.clientY;


    const onMousemove = (mousemoveEvent: MouseEvent) => {
      // Get the direction of the mouse move
      const direction = Math.sign(yPos - mousemoveEvent.clientY);
      yPos = mousemoveEvent.clientY;

      // Assign the top to the media we are moving
      this.selectedMedia.top = Math.min(mediaContainerElementScrollHeight - 50, Math.max(0, this.selectedMedia.top + mousemoveEvent.movementY));

      // This is the current media top we are moving over
      currentMediaTop = Math.round(this.selectedMedia.top / this.productMediaSpacing) * this.productMediaSpacing;

      // Get the current media using the current media top
      const currentMedia = this.product.media.find(x => x.top == currentMediaTop);

      // This will move the current media to a new location and assign its index
      if (currentMedia && currentMedia != this.selectedMedia) {
        currentMedia.transition = 'all 200ms cubic-bezier(0.22, 0.5, 0.5, 1) 0s';
        currentMedia.index = currentMedia.index + 1 * direction;
        currentMedia.top = currentMedia.index * this.productMediaSpacing;
      }

      // Set the scrollbar
      if (this.selectedMedia.top < mediaContainerElement.scrollTop) {
        mediaContainerElement?.scrollTo(0, mediaContainerElement.scrollTop + mousemoveEvent.movementY)
      }

      if (this.selectedMedia.top > mediaContainerElementHeight - 50) {
        mediaContainerElement?.scrollTo(0, mediaContainerElement.scrollTop + mousemoveEvent.movementY)
      }
    }


    const onMouseup = () => {
      document.removeEventListener('mousemove', onMousemove);
      document.removeEventListener('mouseup', onMouseup);

      // Set the selected media's top and index
      if (currentMediaTop != undefined) {
        this.selectedMedia.top = Math.min((this.product.media.length - 1) * this.productMediaSpacing, currentMediaTop);
        this.selectedMedia.index = Math.round(this.selectedMedia.top / this.productMediaSpacing);
        this.selectedMedia.transition = 'all 200ms cubic-bezier(0.22, 0.5, 0.5, 1) 0s';

        // Update the indices
        this.updateIndices();
      }
    }

    document.addEventListener('mousemove', onMousemove);
    document.addEventListener('mouseup', onMouseup);
  }



  updateIndices() {
    this.dataService.put('api/Products/Media/Indices', {
      productId: this.product.id,
      productMedia: this.product.media.map((media: ProductMedia) => {
        return {
          productMediaId: media.productMediaId,
          index: media.index
        }
      })
    }).subscribe();
  }





  // --------------------------------------------------- On Media Select ---------------------------------------------------
  onMediaSelect(productMedia: ProductMedia) {
    productMedia.transition = 'all 0ms ease 0s';
    if (productMedia.type == MediaType.Video) this.setVideo(productMedia);
    this.selectedMedia = productMedia;
  }



  // --------------------------------------------------- Set Video ---------------------------------------------------
  setVideo(productMedia: ProductMedia) {
    window.setTimeout(() => {
      const iframe = document.getElementById('video-iframe') as HTMLIFrameElement;
      const src = new Video({
        video: {
          id: productMedia.id,
          name: productMedia.name,
          thumbnail: productMedia.thumbnail,
          videoType: productMedia.videoType,
          videoId: productMedia.videoId
        }
      }).src;

      if (iframe.src != src) iframe.src = src;
    });
  }
}