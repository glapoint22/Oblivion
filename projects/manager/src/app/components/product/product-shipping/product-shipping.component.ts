import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { SpinnerAction, ShippingType, DataService, LazyLoadingService } from 'common';
import { PopupArrowPosition } from '../../../classes/enums';
import { Product } from '../../../classes/product';
import { ShippingPopupComponent } from '../../shipping-popup/shipping-popup.component';

@Component({
  selector: 'product-shipping',
  templateUrl: './product-shipping.component.html',
  styleUrls: ['./product-shipping.component.scss']
})
export class ProductShippingComponent {
  private shippingPopup!: ShippingPopupComponent;

  public shippingType = ShippingType;
  public shippingPopupOpen!: boolean;
  public PopupArrowPosition = PopupArrowPosition;

  @Input() product!: Product;
  @ViewChild('addShippingPopup', { read: ViewContainerRef }) addShippingPopupContainer!: ViewContainerRef;
  @ViewChild('editShippingPopup', { read: ViewContainerRef }) editShippingPopup!: ViewContainerRef;

  constructor(private dataService: DataService, private lazyLoadingService: LazyLoadingService) { }

 
  openShippingPopup(arrowPosition: PopupArrowPosition) {
    if (this.shippingPopupOpen) {
      this.shippingPopup.close();
      return;
    }

    this.lazyLoadingService.load(async () => {
      const { ShippingPopupComponent } = await import('../../shipping-popup/shipping-popup.component');
      const { ShippingPopupModule } = await import('../../shipping-popup/shipping-popup.module');
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
}
