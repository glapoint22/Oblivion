import { Component, Input, QueryList, ViewChildren, ViewContainerRef } from '@angular/core';
import { DataService, Image, LazyLoadingService, MediaType, PricePoint, RecurringPayment, Shipping, ShippingType, SpinnerAction } from 'common';
import { PopupArrowPosition } from '../../classes/enums';
import { Product } from '../../classes/product';
import { MediaBrowserComponent } from '../media-browser/media-browser.component';
import { RecurringPopupComponent } from '../recurring-popup/recurring-popup.component';
import { ShippingPopupComponent } from '../shipping-popup/shipping-popup.component';

@Component({
  selector: 'price-points',
  templateUrl: './price-points.component.html',
  styleUrls: ['./price-points.component.scss']
})
export class PricePointsComponent {
  // Private
  private shippingPopup!: ShippingPopupComponent;
  private recurringPopup!: RecurringPopupComponent;

  // Public
  public window = window;
  public shipping = Shipping;
  public shippingType = ShippingType;
  public PopupArrowPosition = PopupArrowPosition;
  public recurringPayment = RecurringPayment;

  // Decorators
  @Input() product!: Product;
  @ViewChildren('addShippingPopup', { read: ViewContainerRef }) addShippingPopup!: QueryList<ViewContainerRef>;
  @ViewChildren('editShippingPopup', { read: ViewContainerRef }) editShippingPopup!: QueryList<ViewContainerRef>;
  @ViewChildren('addRecurringPopup', { read: ViewContainerRef }) addRecurringPopup!: QueryList<ViewContainerRef>;
  @ViewChildren('editRecurringPopup', { read: ViewContainerRef }) editRecurringPopup!: QueryList<ViewContainerRef>;

  // Constructor
  constructor(private lazyLoadingService: LazyLoadingService, private dataService: DataService) { }


  addPricePoint(pushNewPricePoint?: boolean) {
    if (pushNewPricePoint) this.product.pricePoints.push(new PricePoint());

    this.dataService.post<number>('api/Products/PricePoint', {
      ProductId: this.product.id
    }).subscribe((pricePointId: number) => {

      this.product.pricePoints[this.product.pricePoints.length - 1].id = pricePointId;
    });
  }



  updatePricePoint(pricePoint: PricePoint) {
    this.dataService.put('api/Products/PricePoint', {
      id: pricePoint.id,
      header: pricePoint.header,
      quantity: pricePoint.quantity,
      imageId: pricePoint.image.id > 0 ? pricePoint.image.id : null,
      unitPrice: pricePoint.unitPrice,
      unit: pricePoint.unit,
      strikethroughPrice: pricePoint.strikethroughPrice,
      price: pricePoint.price,
      shippingType: pricePoint.shippingType,
      recurringPayment: pricePoint.recurringPayment
    }).subscribe();
  }



  deletePricePoint(pricePointIndex: number, pricePointId: number) {
    this.product.pricePoints.splice(pricePointIndex, 1)
    this.updateMinMaxPrice();

    this.dataService.delete('api/Products/PricePoint', {
      pricePointId: pricePointId
    }).subscribe();
  }


  onHeaderBlur(pricePoint: PricePoint, value: string) {
    pricePoint.header = value;
    this.updatePricePoint(pricePoint);
  }


  onQuantityBlur(pricePoint: PricePoint, value: string) {
    pricePoint.quantity = value;
    this.updatePricePoint(pricePoint);
  }


  openMediaBrowser(pricePoint: PricePoint): void {
    this.lazyLoadingService.load(async () => {
      const { MediaBrowserComponent } = await import('../media-browser/media-browser.component');
      const { MediaBrowserModule } = await import('../media-browser/media-browser.module');
      return {
        component: MediaBrowserComponent,
        module: MediaBrowserModule
      }
    }, SpinnerAction.None)
      .then((mediaBrowser: MediaBrowserComponent) => {
        mediaBrowser.currentMediaType = MediaType.Image;

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
    pricePoint.image = new Image();
    this.updatePricePoint(pricePoint);
  }


  onUnitPriceFocus(htmlElement: HTMLElement) {
    if (htmlElement.innerText.length > 0) {
      htmlElement.innerText = htmlElement.innerText.substring(1);
    }
  }


  onUnitPriceBlur(pricePoint: PricePoint, htmlElement: HTMLElement) {
    pricePoint.unitPrice = htmlElement.innerText;
    this.updatePricePoint(pricePoint);
    if (htmlElement.innerText.length > 0) this.convertToCurrency(htmlElement);
  }


  onUnitBlur(pricePoint: PricePoint, value: string) {
    pricePoint.unit = value;
    this.updatePricePoint(pricePoint);
  }



  onStrikethroughPriceFocus(htmlElement: HTMLElement) {
    if (htmlElement.innerText.length > 0) {
      htmlElement.innerText = htmlElement.innerText.substring(1);
    }
  }


  onStrikethroughPriceBlur(pricePoint: PricePoint, htmlElement: HTMLElement) {
    pricePoint.strikethroughPrice = htmlElement.innerText;
    this.updatePricePoint(pricePoint);
    if (htmlElement.innerText.length > 0) this.convertToCurrency(htmlElement);
  }


  onPriceFocus(htmlElement: HTMLElement) {
    if (htmlElement.innerText.length > 0) {
      htmlElement.innerText = htmlElement.innerText.substring(1);
    }
  }


  onPriceBlur(pricePoint: PricePoint, htmlElement: HTMLElement) {
    pricePoint.price = htmlElement.innerText;
    this.updatePricePoint(pricePoint);
    this.updateMinMaxPrice();
    if (htmlElement.innerText.length > 0) this.convertToCurrency(htmlElement);
  }


  updateMinMaxPrice() {
    let minPrice: number = 0;
    let maxPrice: number = 0;


    if (this.product.pricePoints.length > 0) {
      minPrice = Math.min(...this.product.pricePoints.map(x => parseFloat(x.price ? x.price : '0')));
      maxPrice = Math.max(...this.product.pricePoints.map(x => parseFloat(x.price ? x.price : '0')));

      this.product.minPrice = minPrice;
      this.product.maxPrice = maxPrice == minPrice ? null! : maxPrice;

    } else {
      this.product.minPrice = minPrice;
      this.product.maxPrice = maxPrice;
    }


    this.dataService.put('api/Products/MinMaxPrice', {
      productId: this.product.id,
      minPrice: minPrice,
      maxPrice: maxPrice == minPrice ? 0 : maxPrice
    }).subscribe();
  }


  convertToCurrency(htmlElement: HTMLElement) {
    const numberFormat = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    })
    htmlElement.innerText = numberFormat.format(parseFloat(htmlElement.innerText));
  }




  openShippingPopup(arrowPosition: PopupArrowPosition, pricePointIndex: number, pricePoint: PricePoint) {
    if (this.addShippingPopup.get(pricePointIndex)!.length > 0 || this.editShippingPopup.get(pricePointIndex)!.length > 0) {
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
    }, SpinnerAction.None, arrowPosition == PopupArrowPosition.BottomLeft ? this.addShippingPopup.get(pricePointIndex) : this.editShippingPopup.get(pricePointIndex))
      .then((shippingPopup: ShippingPopupComponent) => {
        this.shippingPopup = shippingPopup;
        shippingPopup.arrowPosition = arrowPosition;
        shippingPopup.shipping = arrowPosition == PopupArrowPosition.BottomLeft ? ShippingType.FreeShipping : pricePoint.shippingType;
        shippingPopup.callback = (shippingType: ShippingType) => {
          pricePoint.shippingType = shippingType;
          this.updatePricePoint(pricePoint);
        }
      });
  }





  openRecurringPopup(arrowPosition: PopupArrowPosition, pricePointIndex: number, pricePoint: PricePoint) {
    if (this.addRecurringPopup.get(pricePointIndex)!.length > 0 || this.editRecurringPopup.get(pricePointIndex)!.length > 0) {
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

    }, SpinnerAction.None, arrowPosition == PopupArrowPosition.BottomLeft ? this.addRecurringPopup.get(pricePointIndex) : this.editRecurringPopup.get(pricePointIndex))
      .then((recurringPopup: RecurringPopupComponent) => {
        this.recurringPopup = recurringPopup;
        recurringPopup.arrowPosition = arrowPosition;

        if (pricePoint.recurringPayment) {
          recurringPopup.recurringPayment.recurringPrice = pricePoint.recurringPayment.recurringPrice;
          recurringPopup.recurringPayment.rebillFrequency = pricePoint.recurringPayment.rebillFrequency;
          recurringPopup.recurringPayment.subscriptionDuration = pricePoint.recurringPayment.subscriptionDuration;
          recurringPopup.recurringPayment.timeFrameBetweenRebill = pricePoint.recurringPayment.timeFrameBetweenRebill;
          recurringPopup.recurringPayment.trialPeriod = pricePoint.recurringPayment.trialPeriod;
        }

        recurringPopup.callback = (recurringPayment: RecurringPayment) => {
          pricePoint.recurringPayment = recurringPayment;

          if (pricePoint.recurringPayment.recurringPrice == 0) {
            this.removeRecurringPayment(pricePoint);
          } else {
            this.updatePricePoint(pricePoint);
          }
        }
      });
  }


  removeRecurringPayment(pricePoint: PricePoint) {
    pricePoint.recurringPayment.rebillFrequency = 0;
    pricePoint.recurringPayment.recurringPrice = 0;
    pricePoint.recurringPayment.subscriptionDuration = 0;
    pricePoint.recurringPayment.timeFrameBetweenRebill = 0;
    pricePoint.recurringPayment.trialPeriod = 0;
    this.updatePricePoint(pricePoint);
  }
}