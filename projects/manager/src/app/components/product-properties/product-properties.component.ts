import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { LazyLoadingService, SpinnerAction } from 'common';
import { Product } from '../../classes/product';
import { HoplinkPopupComponent } from '../hoplink-popup/hoplink-popup.component';
import { RecurringPopupComponent } from '../recurring-popup/recurring-popup.component';
import { ShippingPopupComponent } from '../shipping-popup/shipping-popup.component';

@Component({
  selector: 'product-properties',
  templateUrl: './product-properties.component.html',
  styleUrls: ['./product-properties.component.scss']
})
export class ProductPropertiesComponent {
  public zIndex!: number;
  public properties: Product = new Product();
  public showPricePoints!: boolean;

  @ViewChild('addShippingPopup', { read: ViewContainerRef }) addShippingPopup!: ViewContainerRef;
  @ViewChild('editShippingPopup', { read: ViewContainerRef }) editShippingPopup!: ViewContainerRef;
  @ViewChild('addRecurringPopup', { read: ViewContainerRef }) addRecurringPopup!: ViewContainerRef;
  @ViewChild('editRecurringPopup', { read: ViewContainerRef }) editRecurringPopup!: ViewContainerRef;
  @ViewChild('addHoplinkPopup', { read: ViewContainerRef }) addHoplinkPopup!: ViewContainerRef;
  @ViewChild('editHoplinkPopup', { read: ViewContainerRef }) editHoplinkPopup!: ViewContainerRef;
  @ViewChild('textToolbarPopup', { read: ViewContainerRef }) textToolbarPopup!: ViewContainerRef;

  constructor(private lazyLoadingService: LazyLoadingService) { }


  openShippingPopup(add: boolean) {
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
    })
  }


  openRecurringPopup(add: boolean) {
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
    })
  }


  openHoplinkPopup(add: boolean) {
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