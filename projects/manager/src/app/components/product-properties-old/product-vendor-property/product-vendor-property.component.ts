import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Vendor } from '../../../classes/vendor';

@Component({
  selector: 'product-vendor-property',
  templateUrl: './product-vendor-property.component.html',
  styleUrls: ['./product-vendor-property.component.scss']
})
export class ProductVendorPropertyComponent { //implements Searchable<Item>
  @Input() product!: any; // Product
  public apiUrl: string = 'api/Vendors';
  private subscription!: Subscription;

  constructor(
    // private popupService: PopupService,
    // private formService: FormService,
    // private loadingService: LoadingService,
    // private dataService: DataService
  ) { }


  // --------------------------------( ON VENDOR SEARCH CLICK )-------------------------------- \\
  onVendorSearchClick() { //sourceElement: HTMLElement
    // this.popupService.sourceElement = sourceElement;
    // this.popupService.searchPopup.searchable = this;
    // this.popupService.searchPopup.show = !this.popupService.searchPopup.show;
  }


  // --------------------------------( ON VENDOR INFO CLICK )-------------------------------- \\
  openVendorForm() {
    // Subscribe to when a new vendor is submitted
    if (this.subscription) this.subscription.unsubscribe();
    // this.subscription = this.formService.vendorForm.onSubmit.subscribe((vendor: any) => { //Item
    //   this.setSearchItem(vendor);
    // });


    if (this.product.vendor.id != 0) {
      // this.loadingService.loading = true;
      // this.dataService.get(this.apiUrl + '/Vendor', [{ key: 'vendorId', value: this.product.vendor.id }])
        // .subscribe((vendor: Vendor) => {
          // Give the vendor info to the vendor form
          // this.formService.vendorForm.vendor = vendor;

          // Hide the loading screen and show the vendor form
          // this.loadingService.loading = false;
          // this.formService.vendorForm.show = true;
        // });
    // } else {
      // this.formService.vendorForm.editMode = true;
      // this.formService.vendorForm.show = true;
    }

  }


  // --------------------------------( SET SEARCH ITEM )-------------------------------- \\
  setSearchItem(vendor: any) { //Item
    if (!this.product.vendor || this.product.vendor.id != vendor.id) {
      this.product.vendor = vendor;

      // Update the vendor
      // this.dataService.put('api/Products/Vendor', {
      //   itemId: this.product.id,
      //   propertyId: this.product.vendor.id
      // }).subscribe();
    }
  }
}
