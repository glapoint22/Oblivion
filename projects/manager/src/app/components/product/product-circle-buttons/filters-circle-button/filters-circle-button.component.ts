import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { LazyLoadingService, SpinnerAction } from 'common';
import { Product } from 'projects/manager/src/app/classes/product';
import { ProductService } from 'projects/manager/src/app/services/product/product.service';
import { FiltersPopupComponent } from './filters-popup/filters-popup.component';

@Component({
  selector: 'filters-circle-button',
  templateUrl: './filters-circle-button.component.html',
  styleUrls: ['../product-circle-buttons.component.scss', './filters-circle-button.component.scss']
})
export class FiltersCircleButtonComponent  {
  private filtersPopup!: FiltersPopupComponent;
  public filtersPopupOpen!: boolean;

  @Input() product!: Product;
  @ViewChild('filtersPopupContainer', { read: ViewContainerRef }) filtersPopupContainer!: ViewContainerRef;

  constructor(private lazyLoadingService: LazyLoadingService, private productService: ProductService) {}
  

  // ================================================================( OPEN FILTERS POPUP )================================================================= \\

  openFiltersPopup() {
    if (this.filtersPopupOpen) {
      this.filtersPopup.close();
      return;
    }

    this.lazyLoadingService.load(async () => {
      const { FiltersPopupComponent } = await import('./filters-popup/filters-popup.component');
      const { FiltersPopupModule } = await import('./filters-popup/filters-popup.module');
      return {
        component: FiltersPopupComponent,
        module: FiltersPopupModule
      }
    }, SpinnerAction.None, this.filtersPopupContainer)
      .then((filtersPopup: FiltersPopupComponent) => {
        this.filtersPopupOpen = true;
        this.filtersPopup = filtersPopup;
        filtersPopup.productId = this.product.id;
        filtersPopup.productIndex = this.productService.products.findIndex(x => x.product == this.product);


        const onFiltersPopupCloseListener = this.filtersPopup.onClose.subscribe(() => {
          onFiltersPopupCloseListener.unsubscribe();
          this.filtersPopupOpen = false;
        });
      });
  }
}