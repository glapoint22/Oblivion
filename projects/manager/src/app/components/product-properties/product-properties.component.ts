import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { DataService, LazyLoadingService, PricePoint, RecurringPayment, Shipping, ShippingType, SpinnerAction } from 'common';
import { PopupArrowPosition } from '../../classes/enums';
import { Product } from '../../classes/product';
import { HoplinkPopupComponent } from '../hoplink-popup/hoplink-popup.component';
import { PricePointsComponent } from '../price-points/price-points.component';
import { PricePopupComponent } from '../price-popup/price-popup.component';
import { RecurringPopupComponent } from '../recurring-popup/recurring-popup.component';
import { ShippingPopupComponent } from '../shipping-popup/shipping-popup.component';

@Component({
  selector: 'product-properties',
  templateUrl: './product-properties.component.html',
  styleUrls: ['./product-properties.component.scss']
})
export class ProductPropertiesComponent {
  public zIndex!: number;
  public product: Product = new Product();
  public shippingType = ShippingType;
  public PopupArrowPosition = PopupArrowPosition;
  public shipping = Shipping;
  @ViewChild('editPricePopup', { read: ViewContainerRef }) editPricePopup!: ViewContainerRef;
  @ViewChild('addShippingPopup', { read: ViewContainerRef }) addShippingPopup!: ViewContainerRef;
  @ViewChild('editShippingPopup', { read: ViewContainerRef }) editShippingPopup!: ViewContainerRef;
  @ViewChild('addRecurringPopup', { read: ViewContainerRef }) addRecurringPopup!: ViewContainerRef;
  @ViewChild('editRecurringPopup', { read: ViewContainerRef }) editRecurringPopup!: ViewContainerRef;
  @ViewChild('addHoplinkPopup', { read: ViewContainerRef }) addHoplinkPopup!: ViewContainerRef;
  @ViewChild('editHoplinkPopup', { read: ViewContainerRef }) editHoplinkPopup!: ViewContainerRef;
  @ViewChild('pricePoints', { read: PricePointsComponent }) pricePoints!: PricePointsComponent;

  constructor(private lazyLoadingService: LazyLoadingService, private dataService: DataService) { }


  openPricePopup() {
    if (this.editPricePopup.length > 0) return;

    this.lazyLoadingService.load(async () => {
      const { PricePopupComponent } = await import('../price-popup/price-popup.component');
      const { PricePopupModule } = await import('../price-popup/price-popup.module');
      return {
        component: PricePopupComponent,
        module: PricePopupModule
      }
    }, SpinnerAction.None, this.editPricePopup)
      .then((pricePopup: PricePopupComponent) => {
        pricePopup.price = this.product.minPrice;
        pricePopup.productId = this.product.id;
        pricePopup.callback = (price: number) => {
          this.product.minPrice = price;
        }
      });
  }


  openShippingPopup(arrowPosition: PopupArrowPosition) {
    if (this.addShippingPopup.length > 0 || this.editShippingPopup.length > 0) return;

    this.lazyLoadingService.load(async () => {
      const { ShippingPopupComponent } = await import('../shipping-popup/shipping-popup.component');
      const { ShippingPopupModule } = await import('../shipping-popup/shipping-popup.module');
      return {
        component: ShippingPopupComponent,
        module: ShippingPopupModule
      }
    }, SpinnerAction.None, arrowPosition == PopupArrowPosition.TopLeft ? this.addShippingPopup : this.editShippingPopup)
      .then((shippingPopup: ShippingPopupComponent) => {
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
    if (this.addRecurringPopup.length > 0 || this.editRecurringPopup.length > 0) return;

    this.lazyLoadingService.load(async () => {
      const { RecurringPopupComponent } = await import('../recurring-popup/recurring-popup.component');
      const { RecurringPopupModule } = await import('../recurring-popup/recurring-popup.module');
      return {
        component: RecurringPopupComponent,
        module: RecurringPopupModule
      }
    }, SpinnerAction.None, arrowPosition == PopupArrowPosition.TopLeft ? this.addRecurringPopup : this.editRecurringPopup)
      .then((recurringPopup: RecurringPopupComponent) => {
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
    if (this.addHoplinkPopup.length > 0 || this.editHoplinkPopup.length > 0) return;

    this.lazyLoadingService.load(async () => {
      const { HoplinkPopupComponent } = await import('../hoplink-popup/hoplink-popup.component');
      const { HoplinkPopupModule } = await import('../hoplink-popup/hoplink-popup.module');
      return {
        component: HoplinkPopupComponent,
        module: HoplinkPopupModule
      }
    }, SpinnerAction.None, arrowPosition == PopupArrowPosition.TopLeft ? this.addHoplinkPopup : this.editHoplinkPopup)
      .then((hoplinkPopup: HoplinkPopupComponent) => {
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
}