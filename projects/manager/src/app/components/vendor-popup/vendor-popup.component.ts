import { Component } from '@angular/core';
import { DataService, LazyLoad, LazyLoadingService, SpinnerAction } from 'common';
import { Product } from '../../classes/product';
import { Vendor } from '../../classes/vendor';
import { VendorFormComponent } from '../vendor-form/vendor-form.component';

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

    this.dataService.get<Vendor>('api/Vendors/Vendor', [{ key: 'vendorId', value: this.product.vendor.id }])
      .subscribe((vendor: Vendor) => {
        this.product.vendor = vendor;
      })
  }


  onVendorSelect(vendor: Vendor) {
    this.product.vendor = vendor;

    this.dataService.put('api/Products/Vendor', {
      itemId: this.product.id,
      propertyId: vendor.id
    })
      .subscribe();
  }



  openVendorForm() {
    this.lazyLoadingService.load(async () => {
      const { VendorFormComponent } = await import('../vendor-form/vendor-form.component');
      const { VendorFormModule } = await import('../vendor-form/vendor-form.module');
      return {
        component: VendorFormComponent,
        module: VendorFormModule
      }
    }, SpinnerAction.None)
      .then((vendorForm: VendorFormComponent) => {
        vendorForm.product = this.product;
      });
  }
}