import { Component, EventEmitter, Output } from '@angular/core';
import { DataService, LazyLoad, LazyLoadingService } from 'common';
import { ListUpdateType, MenuOptionType } from '../../classes/enums';
import { ImageItem } from '../../classes/image-item';
import { ListOptions } from '../../classes/list-options';
import { ListUpdate } from '../../classes/list-update';
import { ProductService } from '../../services/product/product.service';

@Component({
  templateUrl: './vendor-products-popup.component.html',
  styleUrls: ['./vendor-products-popup.component.scss']
})
export class VendorProductsPopupComponent extends LazyLoad {
  private idOfSelectedVendorProduct!: number;

  public vendorId!: number;
  public products: Array<ImageItem> = new Array<ImageItem>();
  public listOptions: ListOptions = {
    editable: false,
    multiselectable: false,
    menu: {
      parentObj: this,
      menuOptions: [
        {
          type: MenuOptionType.MenuItem,
          name: 'Go to Product',
          optionFunction: this.goToProduct
        }
      ]
    }
  }


  @Output() onGoToProductClick: EventEmitter<void> = new EventEmitter();


  constructor(lazyLoadingService: LazyLoadingService, private dataService: DataService, private productService: ProductService) {
    super(lazyLoadingService)
  }


  onOpen() {
    this.dataService.get<Array<ImageItem>>('api/Vendors/Products', [{ key: "vendorId", value: this.vendorId }]).subscribe((products: Array<ImageItem>) => {
      products.forEach(x => {
        this.products.push(x);
      })
    })
  }


  goToProduct() {
    this.productService.goToProduct(this.idOfSelectedVendorProduct);
    this.onGoToProductClick.emit();
  }

  onListUpdate(listUpdate: ListUpdate) {
    if (listUpdate.type == ListUpdateType.SelectedItems) {
      this.idOfSelectedVendorProduct = listUpdate.selectedItems![0].id!;
    }
  }
}