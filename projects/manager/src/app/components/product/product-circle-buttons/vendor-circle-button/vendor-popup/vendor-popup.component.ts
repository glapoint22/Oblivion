import { Component, ViewChild } from '@angular/core';
import { DataService, LazyLoad, LazyLoadingService, SpinnerAction } from 'common';
import { Subject } from 'rxjs';
import { Product } from '../../../../../classes/product';
import { Vendor } from '../../../../../classes/vendor';
import { SearchComponent } from '../../../../search/search.component';
import { VendorFormComponent } from '../../../../vendor-form/vendor-form.component';

@Component({
  selector: 'app-vendor-popup',
  templateUrl: './vendor-popup.component.html',
  styleUrls: ['./vendor-popup.component.scss']
})
export class VendorPopupComponent extends LazyLoad {
  public product!: Product;
  public onClose: Subject<void> = new Subject<void>();

  @ViewChild('search') search!: SearchComponent;

  constructor(lazyLoadingService: LazyLoadingService, private dataService: DataService) {
    super(lazyLoadingService);
  }

  ngOnInit() {
    super.ngOnInit();
    window.addEventListener('mousedown', this.mousedown);
  }


  mousedown = () => {
    this.close();
  }


  onVendorSelect(vendor: Vendor) {
    this.product.vendor = vendor;

    this.dataService.put('api/Products/Vendor', {
      productId: this.product.id,
      vendorId: vendor.id
    }, {
      authorization: true
    }).subscribe();
  }



  openVendorForm() {
    this.lazyLoadingService.load(async () => {
      const { VendorFormComponent } = await import('../../../../vendor-form/vendor-form.component');
      const { VendorFormModule } = await import('../../../../vendor-form/vendor-form.module');
      return {
        component: VendorFormComponent,
        module: VendorFormModule
      }
    }, SpinnerAction.None)
      .then((vendorForm: VendorFormComponent) => {
        vendorForm.product = this.product;
      });
  }


  onEscape(): void {
    if (this.search.dropdownList == null) super.onEscape();
  }


  close(): void {
    super.close();
    this.onClose.next();
  }


  ngOnDestroy() {
    super.ngOnDestroy();
    window.removeEventListener('mousedown', this.mousedown);
  }
}