import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { DataService, LazyLoadingService, SpinnerAction } from 'common';
import { PopupArrowPosition } from '../../../classes/enums';
import { Product } from '../../../classes/product';
import { PricePopupComponent } from '../../price-popup/price-popup.component';

@Component({
  selector: 'product-price',
  templateUrl: './product-price.component.html',
  styleUrls: ['./product-price.component.scss']
})
export class ProductPriceComponent {
  // Private
  private pricePopup!: PricePopupComponent;

  // Public
  public pricePopupOpen!: boolean;
  public PopupArrowPosition = PopupArrowPosition;

  // Decorators
  @Input() product!: Product;
  @ViewChild('addPricePopup', { read: ViewContainerRef }) addPricePopup!: ViewContainerRef;
  @ViewChild('editPricePopup', { read: ViewContainerRef }) editPricePopup!: ViewContainerRef;

  // Constructor
  constructor(private dataService: DataService, private lazyLoadingService: LazyLoadingService) { }

  


  openPricePopup(arrowPosition: PopupArrowPosition) {
    if (this.pricePopupOpen) {
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
}
