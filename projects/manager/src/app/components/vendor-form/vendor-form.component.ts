import { Component, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { DataService, LazyLoad, LazyLoadingService, SpinnerAction } from 'common';
import { Product } from '../../classes/product';
import { Vendor } from '../../classes/vendor';
import { SearchComponent } from '../search/search.component';
import { VendorProductsPopupComponent } from '../vendor-products-popup/vendor-products-popup.component';

@Component({
  selector: 'vendor-form',
  templateUrl: './vendor-form.component.html',
  styleUrls: ['./vendor-form.component.scss']
})
export class VendorFormComponent extends LazyLoad {
  private newVendor!: boolean;
  private vendorProductsPopup!: VendorProductsPopupComponent;

  public vendor!: Vendor;
  public product!: Product;
  public fieldsDisabled!: boolean;
  public iconButtonsDisabled!: boolean;
  public submitButtonDisabled: boolean = true;

  @ViewChild('search') search!: SearchComponent;
  @ViewChild('companyName') companyName!: ElementRef<HTMLInputElement>;
  @ViewChild('contact') contact!: ElementRef<HTMLInputElement>;
  @ViewChild('firstName') firstName!: ElementRef<HTMLInputElement>;
  @ViewChild('lastName') lastName!: ElementRef<HTMLInputElement>;
  @ViewChild('vendorProductsPopupContainer', { read: ViewContainerRef }) vendorProductsPopupContainer!: ViewContainerRef;


  constructor(lazyLoadingService: LazyLoadingService, private dataService: DataService) {
    super(lazyLoadingService);
  }

  onOpen(): void {
    if (!this.product) {
      this.fieldsDisabled = true;
      this.iconButtonsDisabled = true;
      this.vendor = new Vendor();
      this.vendor.name = '';
      this.vendor.primaryEmail = '';
      this.vendor.primaryFirstName = '';
      this.vendor.primaryLastName = '';
      this.search.searchInput.nativeElement.focus();
    }else {
      this.vendor = this.product.vendor;
    }
  }


  onVendorSelect(vendor: Vendor) {
    this.vendor = vendor;
    this.fieldsDisabled = false;
    this.iconButtonsDisabled = false;
    this.companyName.nativeElement.value = this.vendor.name!;
    this.contact.nativeElement.value = this.vendor.primaryEmail!;
    this.firstName.nativeElement.value = this.vendor.primaryFirstName!;
    this.lastName.nativeElement.value = this.vendor.primaryLastName!;
  }



  openVendorProductsPopup() {
    if (this.vendorProductsPopupContainer.length > 0) {
      this.vendorProductsPopup.close();
      return;
    }

    this.lazyLoadingService.load(async () => {
      const { VendorProductsPopupComponent } = await import('../vendor-products-popup/vendor-products-popup.component');
      const { VendorProductsPopupModule } = await import('../vendor-products-popup/vendor-products-popup.module');
      return {
        component: VendorProductsPopupComponent,
        module: VendorProductsPopupModule
      }
    }, SpinnerAction.None, this.vendorProductsPopupContainer)
      .then((vendorProductsPopup: VendorProductsPopupComponent) => {
        this.vendorProductsPopup = vendorProductsPopup;
        
      });
  }




  onAddButtonClick() {
    this.companyName.nativeElement.focus();
    this.newVendor = true;
    this.fieldsDisabled = false;
    this.submitButtonDisabled = true;
    this.vendor = new Vendor();
    this.vendor.name = '';
    this.vendor.primaryEmail = '';
    this.vendor.primaryFirstName = '';
    this.vendor.primaryLastName = '';
    this.companyName.nativeElement.value = '';
    this.contact.nativeElement.value = '';
    this.firstName.nativeElement.value = '';
    this.lastName.nativeElement.value = '';
    if (this.search) this.search.searchInput.nativeElement.value = '';
  }



  onInput(input: string, property: string) {
    // If the Company Name field is empty
    if (this.companyName.nativeElement.value.length == 0) {
      // Disable the submit button
      this.submitButtonDisabled = true;

      // Otherwise, do the following
    } else {

      // If an input does NOT match its property
      if (input != property) {
        // Enable the submit button
        this.submitButtonDisabled = false;

        // But if the input and its property do match
      } else {

        // And as long as all the other inputs match their properties
        if (this.companyName.nativeElement.value == this.vendor.name &&
          this.contact.nativeElement.value == this.vendor.primaryEmail &&
          this.firstName.nativeElement.value == this.vendor.primaryFirstName &&
          this.lastName.nativeElement.value == this.vendor.primaryLastName) {

          // Disable the submit button
          this.submitButtonDisabled = true;

          // But if any of the other inputs do NOT match their property
        } else {

          // Enable the submit button
          this.submitButtonDisabled = false;
        }
      }
    }
  }



  onSubmit() {
    this.close();
    this.vendor.name = this.companyName.nativeElement.value;
    this.vendor.primaryEmail = this.contact.nativeElement.value;
    this.vendor.primaryFirstName = this.firstName.nativeElement.value;
    this.vendor.primaryLastName = this.lastName.nativeElement.value;

    if (this.newVendor) {
      this.dataService.post<number>('api/Vendors', this.vendor).subscribe();

    } else {
      this.dataService.put('api/Vendors', this.vendor).subscribe();
    }
  }
}