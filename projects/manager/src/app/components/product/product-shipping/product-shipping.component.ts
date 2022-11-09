import { Component } from '@angular/core';
import { SpinnerAction, ShippingType } from 'common';
import { PopupArrowPosition } from '../../../classes/enums';
import { ShippingPopupComponent } from '../../shipping-popup/shipping-popup.component';
import { ProductComponent } from '../product.component';

@Component({
  selector: 'product-shipping',
  templateUrl: './product-shipping.component.html',
  styleUrls: ['../product.component.scss', './product-shipping.component.scss']
})
export class ProductShippingComponent extends ProductComponent {
  private shippingPopup!: ShippingPopupComponent;
  public shippingType = ShippingType;


  // ===============================================================( OPEN SHIPPING POPUP )================================================================= \\

  openShippingPopup(arrowPosition: PopupArrowPosition) {
    if (this.popupOpen) {
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
    }, SpinnerAction.None, arrowPosition == PopupArrowPosition.TopLeft ? this.addPopupContainer : this.editPopupContainer)
      .then((shippingPopup: ShippingPopupComponent) => {
        this.popupOpen = true;
        this.shippingPopup = shippingPopup;
        shippingPopup.arrowPosition = arrowPosition;
        shippingPopup.shipping = arrowPosition == PopupArrowPosition.TopLeft ? ShippingType.None : this.product.shippingType;
        shippingPopup.callback = (shippingType: ShippingType) => {
          this.product.shippingType = shippingType;
          this.updateShipping();
        }

        const onShippingPopupCloseListener = this.shippingPopup.onClose.subscribe(() => {
          onShippingPopupCloseListener.unsubscribe();
          this.popupOpen = false;
        });
      });
  }

  

  // =================================================================( UPDATE SHIPPING )=================================================================== \\

  updateShipping() {
    this.dataService.put('api/Products/Shipping', {
      id: this.product.id,
      shippingType: this.product.shippingType
    }).subscribe();
  }
}