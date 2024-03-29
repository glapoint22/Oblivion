import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { PricePoint, Shipping, ShippingType, SpinnerAction } from 'common';
import { PopupArrowPosition } from 'projects/manager/src/app/classes/enums';
import { ShippingPopupComponent } from 'projects/manager/src/app/components/shipping-popup/shipping-popup.component';
import { PricePointComponent } from '../price-point.component';

@Component({
  selector: 'price-point-shipping',
  templateUrl: './price-point-shipping.component.html',
  styleUrls: ['../../price-point/price-point.component.scss', './price-point-shipping.component.scss']
})
export class PricePointShippingComponent extends PricePointComponent {
  @Input() currency!: string;
  private shippingPopup!: ShippingPopupComponent;
  public shipping = Shipping;
  public ShippingType = ShippingType;
  public shippingPopupOpen!: boolean;
  
  @ViewChild('addShippingPopup', { read: ViewContainerRef }) addShippingPopup!: ViewContainerRef;
  @ViewChild('editShippingPopup', { read: ViewContainerRef }) editShippingPopup!: ViewContainerRef;
  
  
  // ===============================================================( OPEN SHIPPING POPUP )================================================================= \\

  openShippingPopup(pricePoint: PricePoint, arrowPosition: PopupArrowPosition) {
    if (this.shippingPopupOpen) {
      this.shippingPopup.close();
      return;
    }

    this.lazyLoadingService.load(async () => {
      const { ShippingPopupComponent } = await import('../../../../../shipping-popup/shipping-popup.component');
      const { ShippingPopupModule } = await import('../../../../../shipping-popup/shipping-popup.module');
      return {
        component: ShippingPopupComponent,
        module: ShippingPopupModule
      }
    }, SpinnerAction.None, arrowPosition == PopupArrowPosition.BottomLeft ? this.addShippingPopup : this.editShippingPopup)
      .then((shippingPopup: ShippingPopupComponent) => {
        this.shippingPopupOpen = true;
        this.shippingPopup = shippingPopup;
        shippingPopup.arrowPosition = arrowPosition;
        shippingPopup.shipping = arrowPosition == PopupArrowPosition.BottomLeft ? ShippingType.None : pricePoint.shippingType;
        shippingPopup.callback = (shippingType: ShippingType, shippingValue: string) => {
          pricePoint.shippingType = shippingType;
          pricePoint.shippingValue = shippingValue;
          this.updatePricePoint(pricePoint);
        }

        const onShippingPopupCloseListener = this.shippingPopup.onClose.subscribe(() => {
          onShippingPopupCloseListener.unsubscribe();
          this.shippingPopupOpen = false;
        });
      });
  }
}