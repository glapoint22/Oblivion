import { Component, ViewChild, ViewContainerRef } from '@angular/core';
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

@Component({
  selector: 'product-properties',
  templateUrl: './product-properties.component.html',
  styleUrls: ['./product-properties.component.scss']
})
export class ProductPropertiesComponent {
  private filtersPopup!: FiltersPopupComponent;
  private keywordsPopup!: KeywordsPopupComponent;
  private productGroupsPopup!: ProductGroupsPopupComponent;
  private pricePopup!: PricePopupComponent;
  private shippingPopup!: ShippingPopupComponent;
  private recurringPopup!: RecurringPopupComponent;
  private hoplinkPopup!: HoplinkPopupComponent;

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

  @ViewChild('pricePoints') pricePoints!: PricePointsComponent;
  @ViewChild('editPricePopup', { read: ViewContainerRef }) editPricePopup!: ViewContainerRef;
  @ViewChild('addShippingPopup', { read: ViewContainerRef }) addShippingPopup!: ViewContainerRef;
  @ViewChild('editShippingPopup', { read: ViewContainerRef }) editShippingPopup!: ViewContainerRef;
  @ViewChild('addRecurringPopup', { read: ViewContainerRef }) addRecurringPopup!: ViewContainerRef;
  @ViewChild('editRecurringPopup', { read: ViewContainerRef }) editRecurringPopup!: ViewContainerRef;
  @ViewChild('addHoplinkPopup', { read: ViewContainerRef }) addHoplinkPopup!: ViewContainerRef;
  @ViewChild('editHoplinkPopup', { read: ViewContainerRef }) editHoplinkPopup!: ViewContainerRef;
  @ViewChild('vendorPopup', { read: ViewContainerRef }) vendorPopupContainer!: ViewContainerRef;
  @ViewChild('filtersPopup', { read: ViewContainerRef }) filtersPopupContainer!: ViewContainerRef;
  @ViewChild('keywordsPopup', { read: ViewContainerRef }) keywordsPopupContainer!: ViewContainerRef;
  @ViewChild('productGroupsPopup', { read: ViewContainerRef }) productGroupsPopupContainer!: ViewContainerRef;


  constructor(private lazyLoadingService: LazyLoadingService, private dataService: DataService, private productService: ProductService) { }


  ngOnInit() {
    if (this.product && this.product.media && this.product.media.length > 0) {
      this.selectedMedia = this.product.media[0];
    }


    // ***************** TEMP!!! **********************
    for (let i = 0; i < this.product.media.length; i++) {
      const productMedia = this.product.media[i];

      productMedia.index = i;
    }



    for (let i = 0; i < this.product.media.length; i++) {
      const productMedia = this.product.media[i];

      productMedia.top = this.productMediaSpacing * productMedia.index;
    }


  }


  openVendorPopup() {
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
        filtersPopup.productIndex = this.productService.productComponents.indexOf(this);
      });
  }



  openKeywordsPopup() {
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
        keywordsPopup.productIndex = this.productService.productComponents.indexOf(this);
      });
  }


  openProductGroupsPopup() {
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
        productGroupsPopup.productIndex = this.productService.productComponents.indexOf(this);
      });
  }



  openPricePopup() {
    if (this.editPricePopup.length > 0) {
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
    }, SpinnerAction.None, this.editPricePopup)
      .then((pricePopup: PricePopupComponent) => {
        this.pricePopup = pricePopup;
        pricePopup.price = this.product.minPrice;
        pricePopup.productId = this.product.id;
        pricePopup.callback = (price: number) => {
          this.product.minPrice = price;
        }
      });
  }


  openShippingPopup(arrowPosition: PopupArrowPosition) {
    if (this.addShippingPopup.length > 0 || this.editShippingPopup.length > 0) {
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
    }, SpinnerAction.None, arrowPosition == PopupArrowPosition.TopLeft ? this.addShippingPopup : this.editShippingPopup)
      .then((shippingPopup: ShippingPopupComponent) => {
        this.shippingPopup = shippingPopup;
        shippingPopup.arrowPosition = arrowPosition;
        shippingPopup.shipping = arrowPosition == PopupArrowPosition.TopLeft ? ShippingType.FreeShipping : this.product.shippingType;
        shippingPopup.callback = (shippingType: ShippingType) => {
          this.product.shippingType = shippingType;

          // Update the database
          this.updateShipping();

        }
      });
  }


  updateShipping() {
    this.dataService.put('api/Products/Shipping', {
      id: this.product.id,
      shippingType: this.product.shippingType
    }).subscribe();
  }


  openRecurringPopup(arrowPosition: PopupArrowPosition) {
    if (this.addRecurringPopup.length > 0 || this.editRecurringPopup.length > 0) {
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
    if (this.addHoplinkPopup.length > 0 || this.editHoplinkPopup.length > 0) {
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
      });
  }


  addPricePoints() {
    this.product.pricePoints.push(new PricePoint());

    window.setTimeout(() => {

      if (this.product.minPrice > 0) {
        this.pricePoints.updateMinMaxPrice();
      }

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
  public async openMediaBrowser(): Promise<void> {
    this.lazyLoadingService.load(async () => {
      const { MediaBrowserComponent } = await import('../media-browser/media-browser.component');
      const { MediaBrowserModule } = await import('../media-browser/media-browser.module');
      return {
        component: MediaBrowserComponent,
        module: MediaBrowserModule
      }
    }, SpinnerAction.None)
      .then((mediaBrowser: MediaBrowserComponent) => {
        let mediaType!: MediaType;
        let media!: Image | Video;
        let productName!: string;

        if (this.product.media && this.product.media.length > 0) {
          productName = null!;

          if (this.selectedMedia.type == MediaType.Image) {
            mediaType = MediaType.Image;
            media = new Image();
            media.id = this.selectedMedia.id;
            media.name = this.selectedMedia.name;
            media.src = this.selectedMedia.imageMd;
            media.thumbnail = this.selectedMedia.thumbnail;
            media.imageSizeType = ImageSizeType.Medium;
          } else {
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
        } else {
          mediaType = MediaType.Image;
          media = new Image();
          media.imageSizeType = ImageSizeType.Medium;
          productName = this.product.name;
        }




        // Initialize the media browser
        mediaBrowser.init(mediaType, media, ImageSizeType.Medium, productName);

        // Callback
        mediaBrowser.callback = (newMedia: Image | Video) => {
          let oldMediaId!: number;

          if (!this.selectedMedia) {
            this.selectedMedia = new ProductMedia();
            this.selectedMedia.type = MediaType.Image;
          } else {
            oldMediaId = this.selectedMedia.id;
          }



          this.selectedMedia.name = newMedia.name;
          this.selectedMedia.id = newMedia.id;
          this.selectedMedia.thumbnail = newMedia.thumbnail;

          if (this.selectedMedia.type == MediaType.Image) {
            this.selectedMedia.imageMd = newMedia.src;
          } else {
            const video = newMedia as Video;

            this.selectedMedia.videoType = video.videoType;
            this.selectedMedia.videoId = video.videoId;

            const iframe = document.getElementById('video-iframe') as HTMLIFrameElement;
            iframe.src = new Video({
              video: {
                id: video.id,
                name: video.name,
                thumbnail: video.thumbnail,
                videoType: video.videoType,
                videoId: video.videoId
              }
            }).src;
          }


          this.dataService.put('api/Products/Media', {
            productId: this.product.id,
            oldMediaId: oldMediaId,
            newMediaId: this.selectedMedia.id
          }).subscribe();

        }
      });
  }


  // --------------------------------------------------- Remove Product Media ---------------------------------------------------
  public removeProductMedia() {
    // Remove the image
    this.dataService.delete('api/Products/Media', { productId: this.product.id, mediaId: this.selectedMedia.id })
      .subscribe(() => {
        let arrayIndex = this.product.media.findIndex(x => this.selectedMedia == x);
        let index = this.selectedMedia.index + 1;
        let selectedMedia!: ProductMedia;

        this.product.media.splice(arrayIndex, 1);

        do {
          selectedMedia = this.product.media.find(x => x.index == index)!;

          if (selectedMedia) {
            selectedMedia.index--;
            selectedMedia.top = this.productMediaSpacing * selectedMedia.index;
            selectedMedia.transition = 'all 0ms ease 0s';
            index++;
          }

        } while (selectedMedia);

        if (this.selectedMedia.index == this.product.media.length) {
          selectedMedia = this.product.media.find(x => x.index == this.selectedMedia.index - 1)!;
        } else {
          selectedMedia = this.product.media.find(x => x.index == this.selectedMedia.index)!;
        }

        if (selectedMedia) {
          this.onMediaSelect(selectedMedia);
        } else {
          this.selectedMedia = null!;
        }

      });
  }






  // --------------------------------------------------- On Media Select ---------------------------------------------------
  onMediaSelect(productMedia: ProductMedia, mousedownEvent?: MouseEvent) {
    productMedia.transition = 'all 0ms ease 0s';

    if (productMedia.type == MediaType.Video) {
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

    this.selectedMedia = productMedia;

    if (mousedownEvent) {
      const mediaContainerElement = (mousedownEvent.target as HTMLElement).parentElement?.parentElement!;
      const mediaContainerElementScrollHeight = mediaContainerElement.scrollHeight;
      const mediaContainerElementHeight = mediaContainerElement.clientHeight;
      let currentTop: number;
      let yPos = mousedownEvent.clientY;


      const onMousemove = (mousemoveEvent: MouseEvent) => {
        const direction = Math.sign(yPos - mousemoveEvent.clientY);

        yPos = mousemoveEvent.clientY;
        this.selectedMedia.top = Math.min(mediaContainerElementScrollHeight - 50, Math.max(0, this.selectedMedia.top + mousemoveEvent.movementY));
        currentTop = Math.round(this.selectedMedia.top / this.productMediaSpacing) * this.productMediaSpacing;

        const currentMedia = this.product.media.find(x => x.top == currentTop);

        if (currentMedia && currentMedia != this.selectedMedia) {
          currentMedia.transition = 'all 200ms cubic-bezier(0.22, 0.5, 0.5, 1) 0s';
          currentMedia.index = currentMedia.index + 1 * direction;
          currentMedia.top = currentMedia.index * this.productMediaSpacing;
        }


        if (this.selectedMedia.top > mediaContainerElementHeight - 50) {
          mediaContainerElement?.scrollTo(0, mediaContainerElement.scrollTop + mousemoveEvent.movementY)
        }
      }

      const onMouseup = () => {
        document.removeEventListener('mousemove', onMousemove);
        document.removeEventListener('mouseup', onMouseup);

        if (currentTop != undefined) {
          this.selectedMedia.top = Math.min((this.product.media.length - 1) * this.productMediaSpacing, currentTop);
          this.selectedMedia.index = Math.round(this.selectedMedia.top / this.productMediaSpacing);
          this.selectedMedia.transition = 'all 200ms cubic-bezier(0.22, 0.5, 0.5, 1) 0s';
        }
      }

      document.addEventListener('mousemove', onMousemove);
      document.addEventListener('mouseup', onMouseup);
    }
  }
}