import { Component } from '@angular/core';
import { DataService, LazyLoad, LazyLoadingService } from 'common';
import { MenuOptionType } from '../../classes/enums';
import { ImageItem } from '../../classes/image-item';
import { ListOptions } from '../../classes/list-options';

@Component({
  templateUrl: './vendor-products-popup.component.html',
  styleUrls: ['./vendor-products-popup.component.scss']
})
export class VendorProductsPopupComponent extends LazyLoad {
  public vendorId!: number;
  public products: Array<ImageItem> = new Array<ImageItem>();
  public listOptions: ListOptions = {
    editable: false,
    menu: {
      parentObj: this,
      menuOptions: [
        {
          type: MenuOptionType.MenuItem,
          name: 'Go to Product'
        }
      ]
    }
  }


  constructor(lazyLoadingService: LazyLoadingService, private dataService: DataService) {
    super(lazyLoadingService)
  }


  onOpen() {
    this.dataService.get<Array<ImageItem>>('api/Vendors/Products', [{ key: "vendorId", value: this.vendorId }]).subscribe((products: Array<ImageItem>) => {
      products.forEach(x => {
        this.products.push(x);
      })
    })
  }
}