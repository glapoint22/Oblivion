import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { LazyLoadingService, SpinnerAction } from 'common';
import { Product } from 'projects/manager/src/app/classes/product';
import { ProductService } from 'projects/manager/src/app/services/product/product.service';
import { KeywordsPopupComponent } from './keywords-popup/keywords-popup.component';

@Component({
  selector: 'keywords-circle-button',
  templateUrl: './keywords-circle-button.component.html',
  styleUrls: ['../product-circle-buttons.component.scss', './keywords-circle-button.component.scss']
})
export class KeywordsCircleButtonComponent {
  private keywordsPopup!: KeywordsPopupComponent;
  public keywordsPopupOpen!: boolean;

  @Input() product!: Product;
  @ViewChild('keywordsPopupContainer', { read: ViewContainerRef }) keywordsPopupContainer!: ViewContainerRef;

  constructor(private lazyLoadingService: LazyLoadingService, private productService: ProductService) {}
  
  openKeywordsPopup() {
    if (this.keywordsPopupOpen) {
      this.keywordsPopup.close();
      return;
    }

    this.lazyLoadingService.load(async () => {
      const { KeywordsPopupComponent } = await import('./keywords-popup/keywords-popup.component');
      const { KeywordsPopupModule } = await import('./keywords-popup/keywords-popup.module');
      return {
        component: KeywordsPopupComponent,
        module: KeywordsPopupModule
      }
    }, SpinnerAction.None, this.keywordsPopupContainer)
      .then((keywordsPopup: KeywordsPopupComponent) => {
        this.keywordsPopupOpen = true;
        this.keywordsPopup = keywordsPopup;
        keywordsPopup.productId = this.product.id;
        keywordsPopup.productIndex = this.productService.products.findIndex(x => x.product == this.product);


        const onKeywordsPopupCloseListener = this.keywordsPopup.onClose.subscribe(() => {
          onKeywordsPopupCloseListener.unsubscribe();
          this.keywordsPopupOpen = false;
        });
      });
  }
}