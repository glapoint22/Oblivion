import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { LazyLoadingService, SpinnerAction } from 'common';
import { Product } from 'projects/manager/src/app/classes/product';
import { VendorPopupComponent } from './vendor-popup/vendor-popup.component';

@Component({
  selector: 'vendor-circle-button',
  templateUrl: './vendor-circle-button.component.html',
  styleUrls: ['../product-circle-buttons.component.scss', './vendor-circle-button.component.scss']
})
export class VendorCircleButtonComponent {
  public vendorPopup!: VendorPopupComponent;
  public vendorPopupOpen!: boolean;

  @Input() product!: Product;
  @ViewChild('vendorPopupContainer', { read: ViewContainerRef }) vendorPopupContainer!: ViewContainerRef;

  constructor(private lazyLoadingService: LazyLoadingService) {}
  
  openVendorPopup() {
    if (this.vendorPopupOpen) {
      this.vendorPopup.close();
      return;
    }

    this.lazyLoadingService.load(async () => {
      const { VendorPopupComponent } = await import('./vendor-popup/vendor-popup.component');
      const { VendorPopupModule } = await import('./vendor-popup/vendor-popup.module');
      return {
        component: VendorPopupComponent,
        module: VendorPopupModule
      }
    }, SpinnerAction.None, this.vendorPopupContainer)
      .then((vendorPopup: VendorPopupComponent) => {
        this.vendorPopupOpen = true;
        this.vendorPopup = vendorPopup;
        vendorPopup.product = this.product


        const onVendorPopupCloseListener = this.vendorPopup.onClose.subscribe(() => {
          onVendorPopupCloseListener.unsubscribe();
          this.vendorPopupOpen = false;
        });
      });
  }
}