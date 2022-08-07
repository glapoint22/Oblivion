import { Component } from '@angular/core';
import { DataService, LazyLoad, LazyLoadingService } from 'common';
import { Item } from '../../classes/item';
import { Product } from '../../classes/product';

@Component({
  selector: 'app-vendor-popup',
  templateUrl: './vendor-popup.component.html',
  styleUrls: ['./vendor-popup.component.scss']
})
export class VendorPopupComponent extends LazyLoad {
  public product!: Product;

  constructor(lazyLoadingService: LazyLoadingService, private dataService: DataService) {
    super(lazyLoadingService);
  }


  ngOnInit(): void {
    super.ngOnInit();

    this.dataService.get<Item>('api/Vendors/Vendor', [{ key: 'vendorId', value: this.product.vendor.id }])
      .subscribe((vendor: Item) => {
        this.product.vendor = vendor;
      })
  }


  onVendorSelect(vendor: Item) {
    this.product.vendor = vendor;

    this.dataService.put('api/Products/Vendor', {
      itemId : this.product.id,
      propertyId: vendor.id
    })
    .subscribe();
  }
}