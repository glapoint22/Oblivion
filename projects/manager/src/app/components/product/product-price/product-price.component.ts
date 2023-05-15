import { Component } from '@angular/core';
import { SpinnerAction } from 'common';
import { PopupArrowPosition } from '../../../classes/enums';
import { PricePopupComponent } from '../../price-popup/price-popup.component';
import { ProductComponent } from '../product.component';

@Component({
  selector: 'product-price',
  templateUrl: './product-price.component.html',
  styleUrls: ['../product.component.scss', './product-price.component.scss']
})
export class ProductPriceComponent extends ProductComponent {
  private pricePopup!: PricePopupComponent;


  // =================================================================( OPEN PRICE POPUP )================================================================== \\

  openPricePopup(arrowPosition: PopupArrowPosition) {
    if (this.popupOpen) {
      this.pricePopup.close();
      return;
    }

    this.lazyLoadingService.load(async () => {
      const { PricePopupComponent } = await import('../../price-popup/price-popup.component');
      const { PricePopupModule } = await import('../../price-popup/price-popup.module');
      return {
        component: PricePopupComponent,
        module: PricePopupModule
      }
    }, SpinnerAction.None, arrowPosition == PopupArrowPosition.TopLeft ? this.addPopupContainer : this.editPopupContainer)
      .then((pricePopup: PricePopupComponent) => {
        this.popupOpen = true;
        this.pricePopup = pricePopup;
        pricePopup.arrowPosition = arrowPosition;
        pricePopup.price = this.product.minPrice;
        pricePopup.currency = this.product.currency;

        pricePopup.callback = (pricePopupResult: any) => {
          this.dataService.post('api/Products/Price', {
            productId: this.product.id,
            price: pricePopupResult.price,
            currency: pricePopupResult.currency
          }, {
            authorization: true
          }).subscribe();

          this.product.minPrice = pricePopupResult.price;
          this.product.currency = pricePopupResult.currency;
        }

        const onPricePopupCloseListener = this.pricePopup.onClose.subscribe(() => {
          onPricePopupCloseListener.unsubscribe();
          this.popupOpen = false;
        });
      });
  }
}