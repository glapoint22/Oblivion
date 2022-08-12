import { Component, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService, LazyLoad, LazyLoadingService, SpinnerAction } from 'common';
import { Product } from '../../classes/product';
import { Vendor } from '../../classes/vendor';
import { PromptComponent } from '../prompt/prompt.component';
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
  public searchTabElement!: ElementRef<HTMLElement>;

  @ViewChild('search') search!: SearchComponent;
  @ViewChild('companyName') companyName!: ElementRef<HTMLInputElement>;
  @ViewChild('contact') contact!: ElementRef<HTMLInputElement>;
  @ViewChild('firstName') firstName!: ElementRef<HTMLInputElement>;
  @ViewChild('lastName') lastName!: ElementRef<HTMLInputElement>;
  @ViewChild('closeButton') closeButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('vendorProductsPopupContainer', { read: ViewContainerRef }) vendorProductsPopupContainer!: ViewContainerRef;


  constructor(lazyLoadingService: LazyLoadingService, private dataService: DataService, private sanitizer: DomSanitizer) {
    super(lazyLoadingService);
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();

    if (this.searchTabElement) {
      this.tabElements = [];
      this.tabElements.push(this.searchTabElement)
      this.tabElements = this.tabElements.concat(this.HTMLElements.toArray());
    }
  }


  onOpen(): void {
    // If the form is being opened from a product
    if (this.product) {

      // If the product does NOT have a vendor yet
      if (!this.product.vendor) {
        this.fieldsDisabled = true;
        this.iconButtonsDisabled = true;
        this.createNewVendor();
      }
      this.vendor = this.product.vendor;

      // If the form is being opened from the forms menu
    } else {
      this.fieldsDisabled = true;
      this.iconButtonsDisabled = true;
      this.createNewVendor();
      this.search.searchInput.nativeElement.focus();
    }
  }


  onVendorSelect(vendor: Vendor) {
    this.vendor = vendor;
    this.fieldsDisabled = false;
    this.iconButtonsDisabled = false;
    this.populateFields();
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
        vendorProductsPopup.vendorId = this.vendor.id!;
      });
  }



  onDeleteButtonClick() {
    this.dataService.get<number>('api/Vendors/ProductCount', [{ key: "vendorId", value: this.vendor.id }])
      .subscribe((productCount: number) => {
        this.openDeletePrompt(productCount);
      })
  }



  openDeletePrompt(productCount: number) {
    this.lazyLoadingService.load(async () => {
      const { PromptComponent } = await import('../prompt/prompt.component');
      const { PromptModule } = await import('../prompt/prompt.module');
      return {
        component: PromptComponent,
        module: PromptModule
      }
    }, SpinnerAction.None)
      .then((prompt: PromptComponent) => {
        prompt.parentObj = this;
        prompt.title = 'Delete Vendor';


        // If the vendor does NOT have any products
        if (productCount == 0) {

          // Display the delete allowed message
          prompt.message = this.sanitizer.bypassSecurityTrustHtml(
            'The vendor' +
            ' <span style="color: #ffba00">\"' + this.vendor.name + '\"</span>' +
            ' will be permanently deleted.');

          // But if the vendor does have products
        } else {

          // If the vendor only has one product
          if (productCount == 1) {

            // Display the NO delete allowed message for one product
            prompt.message = this.sanitizer.bypassSecurityTrustHtml(
              'The vendor' +
              ' <span style="color: #ffba00">\"' + this.vendor.name + '\"</span>' +
              ' has a dependency and cannot be deleted. Before continuing, you must remove any references to this vendor.');

            // If the vendor has more than one product
          } else {

            // Display the NO delete allowed message for many products
            prompt.message = this.sanitizer.bypassSecurityTrustHtml(
              'The vendor' +
              ' <span style="color: #ffba00">\"' + this.vendor.name + '\"</span>' +
              ' has ' + productCount +
              ' dependencies and cannot be deleted. Before continuing, you must remove all references to this vendor.');
          }
        }


        // If delete is allowed, show the delete button
        prompt.primaryButton = productCount == 0 ? {
          name: 'Delete',
          buttonFunction: this.deleteVendor,
        } : null!


        // If delete is allowed, name the button 'Cancel', otherwise name it 'Close'
        prompt.secondaryButton = {
          name: productCount == 0 ? 'Cancel' : 'Close'
        };
      });
  }



  deleteVendor() {
    this.dataService.delete('api/Vendors', { vendorId: this.vendor.id }).subscribe();
    this.vendor = null!;
    this.fieldsDisabled = true;
    this.iconButtonsDisabled = true;
    this.submitButtonDisabled = true;
    this.clearFields();
  }





  onAddButtonClick() {
    this.companyName.nativeElement.focus();
    this.newVendor = true;
    this.fieldsDisabled = false;
    this.submitButtonDisabled = true;
    this.createNewVendor();
    this.clearFields();
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


  checkForDuplicateVendor() {
    this.dataService.get<Vendor>('api/Vendors/Duplicate', [{ key: 'vendorName', value: this.companyName.nativeElement.value }])
      .subscribe((vendor: Vendor) => {

        // If a vendor with the same name already exits
        if (vendor) {
          // Open the duplicate prompt
          this.openDuplicatePrompt(vendor.name!);

          // If NO vendor has the same name
        } else {

          // Submit vendor
          this.submitNewVendor();
        }
      });
  }


  submitNewVendor() {
    this.close();
    this.updateVendor();

    // Post the new vendor to the data base
    this.dataService.post<number>('api/Vendors', this.vendor).subscribe((vendorId: number) => {
      this.vendor.id = vendorId;

      // If this form was opened up from a product
      if (this.product) {
        // Update the product's vendor with this new vendor
        this.product.vendor = this.vendor;

        this.dataService.put('api/Products/Vendor', {
          itemId: this.product.id,
          propertyId: this.vendor.id
        }).subscribe();
      }
    });
  }



  openDuplicatePrompt(vendorName: string) {
    this.lazyLoadingService.load(async () => {
      const { PromptComponent } = await import('../prompt/prompt.component');
      const { PromptModule } = await import('../prompt/prompt.module');
      return {
        component: PromptComponent,
        module: PromptModule
      }
    }, SpinnerAction.None)
      .then((prompt: PromptComponent) => {
        prompt.parentObj = this;
        prompt.title = 'Duplicate Vendor';
        prompt.message = this.sanitizer.bypassSecurityTrustHtml(
          'A vendor with the name' +
          ' <span style="color: #ffba00">\"' + vendorName + '\"</span>' +
          ' already exists.');

        prompt.primaryButton = {
          name: 'Continue',
          buttonFunction: this.submitNewVendor
        }

        prompt.secondaryButton = {
          name: 'Cancel'
        };
      });
  }



  createNewVendor() {
    this.vendor = new Vendor();
    this.vendor.name = '';
    this.vendor.primaryEmail = '';
    this.vendor.primaryFirstName = '';
    this.vendor.primaryLastName = '';
  }


  updateVendor() {
    this.vendor.name = this.companyName.nativeElement.value;
    this.vendor.primaryEmail = this.contact.nativeElement.value;
    this.vendor.primaryFirstName = this.firstName.nativeElement.value;
    this.vendor.primaryLastName = this.lastName.nativeElement.value;
  }


  clearFields() {
    this.companyName.nativeElement.value = '';
    this.contact.nativeElement.value = '';
    this.firstName.nativeElement.value = '';
    this.lastName.nativeElement.value = '';
    if (this.search) this.search.searchInput.nativeElement.value = '';
  }



  populateFields() {
    this.companyName.nativeElement.value = this.vendor.name!;
    this.contact.nativeElement.value = this.vendor.primaryEmail!;
    this.firstName.nativeElement.value = this.vendor.primaryFirstName!;
    this.lastName.nativeElement.value = this.vendor.primaryLastName!;
  }



  onSubmit() {
    if (this.newVendor) {
      this.checkForDuplicateVendor();
    } else {
      this.close();
      this.updateVendor();
      this.dataService.put('api/Vendors', this.vendor).subscribe();
    }
  }

  onEnter(e: KeyboardEvent): void {
    if(document.activeElement != this.closeButton.nativeElement) {
      if(!this.submitButtonDisabled) this.onSubmit();
    }
  }


  close(): void {
    super.close();
    if(this.vendorProductsPopup) this.vendorProductsPopup.close();
  }
}