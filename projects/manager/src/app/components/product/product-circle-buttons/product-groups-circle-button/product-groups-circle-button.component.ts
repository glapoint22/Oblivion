import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { LazyLoadingService, SpinnerAction } from 'common';
import { Product } from 'projects/manager/src/app/classes/product';
import { ProductService } from 'projects/manager/src/app/services/product/product.service';
import { ProductGroupsPopupComponent } from './product-groups-popup/product-groups-popup.component';

@Component({
  selector: 'product-groups-circle-button',
  templateUrl: './product-groups-circle-button.component.html',
  styleUrls: ['../product-circle-buttons.component.scss', './product-groups-circle-button.component.scss']
})
export class ProductGroupsCircleButtonComponent {
  private productGroupsPopup!: ProductGroupsPopupComponent;
  public productGroupsPopupOpen!: boolean;

  @Input() product!: Product;
  @ViewChild('productGroupsPopupContainer', { read: ViewContainerRef }) productGroupsPopupContainer!: ViewContainerRef;

  constructor(private lazyLoadingService: LazyLoadingService, private productService: ProductService) {}

  openProductGroupsPopup() {
    if (this.productGroupsPopupOpen) {
      this.productGroupsPopup.close();
      return;
    }

    this.lazyLoadingService.load(async () => {
      const { ProductGroupsPopupComponent } = await import('./product-groups-popup/product-groups-popup.component');
      const { ProductGroupsPopupModule } = await import('./product-groups-popup/product-groups-popup.module');
      return {
        component: ProductGroupsPopupComponent,
        module: ProductGroupsPopupModule
      }
    }, SpinnerAction.None, this.productGroupsPopupContainer)
      .then((productGroupsPopup: ProductGroupsPopupComponent) => {
        this.productGroupsPopupOpen = true;
        this.productGroupsPopup = productGroupsPopup;
        productGroupsPopup.productId = this.product.id;
        productGroupsPopup.productIndex = this.productService.products.findIndex(x => x.product == this.product);


        const onProductGroupsPopupCloseListener = this.productGroupsPopup.onClose.subscribe(() => {
          onProductGroupsPopupCloseListener.unsubscribe();
          this.productGroupsPopupOpen = false;
        });
      });
  }
}