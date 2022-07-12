import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { LazyLoadingService, RecurringPayment, Shipping, ShippingType, SpinnerAction } from 'common';
import { Product } from '../../classes/product';
import { HoplinkPopupComponent } from '../hoplink-popup/hoplink-popup.component';
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
  public recurringPayment = RecurringPayment;
  public shipping = Shipping;
  public showPricePoints!: boolean;

  @ViewChild('editPricePopup', { read: ViewContainerRef }) editPricePopup!: ViewContainerRef;
  @ViewChild('addShippingPopup', { read: ViewContainerRef }) addShippingPopup!: ViewContainerRef;
  @ViewChild('editShippingPopup', { read: ViewContainerRef }) editShippingPopup!: ViewContainerRef;
  @ViewChild('addRecurringPopup', { read: ViewContainerRef }) addRecurringPopup!: ViewContainerRef;
  @ViewChild('editRecurringPopup', { read: ViewContainerRef }) editRecurringPopup!: ViewContainerRef;
  @ViewChild('addHoplinkPopup', { read: ViewContainerRef }) addHoplinkPopup!: ViewContainerRef;
  @ViewChild('editHoplinkPopup', { read: ViewContainerRef }) editHoplinkPopup!: ViewContainerRef;
  @ViewChild('textToolbarPopup', { read: ViewContainerRef }) textToolbarPopup!: ViewContainerRef;

  constructor(private lazyLoadingService: LazyLoadingService) { }


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
        pricePopup.callback = (price: number) => {
          this.product.minPrice = price;
        }
      });
  }


  openShippingPopup(add: boolean) {
    if (this.addShippingPopup.length > 0 || this.editShippingPopup.length > 0) return;

    this.lazyLoadingService.load(async () => {
      const { ShippingPopupComponent } = await import('../shipping-popup/shipping-popup.component');
      const { ShippingPopupModule } = await import('../shipping-popup/shipping-popup.module');
      return {
        component: ShippingPopupComponent,
        module: ShippingPopupModule
      }
    }, SpinnerAction.None, add ? this.addShippingPopup : this.editShippingPopup)
      .then((shippingPopup: ShippingPopupComponent) => {
        shippingPopup.isAdd = add;
        shippingPopup.shipping = add ? ShippingType.FreeShipping : this.product.shippingType;
        shippingPopup.callback = (shippingType: ShippingType) => {
          this.product.shippingType = shippingType;
        }
      })
  }


  openRecurringPopup(add: boolean) {
    if (this.addRecurringPopup.length > 0 || this.editRecurringPopup.length > 0) return;

    this.lazyLoadingService.load(async () => {
      const { RecurringPopupComponent } = await import('../recurring-popup/recurring-popup.component');
      const { RecurringPopupModule } = await import('../recurring-popup/recurring-popup.module');
      return {
        component: RecurringPopupComponent,
        module: RecurringPopupModule
      }
    }, SpinnerAction.None, add ? this.addRecurringPopup : this.editRecurringPopup)
      .then((recurringPopup: RecurringPopupComponent) => {
        recurringPopup.isAdd = add;

        if (this.product.recurringPayment) {
          recurringPopup.recurringPayment.price = this.product.recurringPayment.price;
          recurringPopup.recurringPayment.rebillFrequency = this.product.recurringPayment.rebillFrequency;
          recurringPopup.recurringPayment.subscriptionDuration = this.product.recurringPayment.subscriptionDuration;
          recurringPopup.recurringPayment.timeFrameBetweenRebill = this.product.recurringPayment.timeFrameBetweenRebill;
          recurringPopup.recurringPayment.trialPeriod = this.product.recurringPayment.trialPeriod;
        }

        recurringPopup.callback = (recurringPayment: RecurringPayment) => {
          this.product.recurringPayment = recurringPayment;
        }
      });
  }


  openHoplinkPopup(add: boolean) {
    if (this.addHoplinkPopup.length > 0 || this.editHoplinkPopup.length > 0) return;

    this.lazyLoadingService.load(async () => {
      const { HoplinkPopupComponent } = await import('../hoplink-popup/hoplink-popup.component');
      const { HoplinkPopupModule } = await import('../hoplink-popup/hoplink-popup.module');
      return {
        component: HoplinkPopupComponent,
        module: HoplinkPopupModule
      }
    }, SpinnerAction.None, add ? this.addHoplinkPopup : this.editHoplinkPopup)
      .then((hoplinkPopup: HoplinkPopupComponent) => {
        hoplinkPopup.isAdd = add;
        hoplinkPopup.hoplink = this.product.hoplink;
        hoplinkPopup.callback = (hoplink: string) => {
          this.product.hoplink = hoplink;
        }
      })
  }




  openTextToolbarPopup() {
    this.lazyLoadingService.load(async () => {
      const { TextToolbarPopupComponent } = await import('../text-toolbar-popup/text-toolbar-popup.component');
      const { TextToolbarPopupModule } = await import('../text-toolbar-popup/text-toolbar-popup.module');
      return {
        component: TextToolbarPopupComponent,
        module: TextToolbarPopupModule
      }
    }, SpinnerAction.None, this.textToolbarPopup)
  }


}