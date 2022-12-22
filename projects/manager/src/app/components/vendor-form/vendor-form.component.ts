import { Component, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService, LazyLoad, LazyLoadingService, SpinnerAction } from 'common';
import { Product } from '../../classes/product';
import { Vendor } from '../../classes/vendor';
import { ProductService } from '../../services/product/product.service';
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
  public vendorProductsPopupOpen!: boolean;
  public submitButtonDisabled: boolean = true;
  public searchTabElement!: ElementRef<HTMLElement>;

  @ViewChild('search') search!: SearchComponent;
  @ViewChild('companyName') companyName!: ElementRef<HTMLInputElement>;
  @ViewChild('contact') contact!: ElementRef<HTMLInputElement>;
  @ViewChild('firstName') firstName!: ElementRef<HTMLInputElement>;
  @ViewChild('lastName') lastName!: ElementRef<HTMLInputElement>;
  @ViewChild('closeButton') closeButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('vendorProductsPopupContainer', { read: ViewContainerRef }) vendorProductsPopupContainer!: ViewContainerRef;


  constructor(lazyLoadingService: LazyLoadingService, private dataService: DataService, private sanitizer: DomSanitizer, private productService: ProductService) {
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


  onVendorSelect(id: any) {
    this.dataService.get<Vendor>('api/Vendors', [{ key: 'id', value: id }], {
      authorization: true
    }).subscribe((vendor: Vendor) => {
      this.vendor = vendor;
      this.fieldsDisabled = false;
      this.iconButtonsDisabled = false;
      this.populateFields();
    });
  }



  openVendorProductsPopup() {
    if (this.vendorProductsPopupOpen) {
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
        this.vendorProductsPopupOpen = true;
        this.vendorProductsPopup = vendorProductsPopup;
        vendorProductsPopup.vendorId = this.vendor.id!;
        vendorProductsPopup.onGoToProductClick.subscribe(() => {
          this.close();
        })

        const onVendorProductsPopupCloseListener = this.vendorProductsPopup.onClose.subscribe(() => {
          onVendorProductsPopupCloseListener.unsubscribe();
          this.vendorProductsPopupOpen = false;
        });
      });
  }


  openDeletePrompt() {
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


        // Display the delete message
        prompt.message = this.sanitizer.bypassSecurityTrustHtml(
          'The vendor' +
          ' <span style="color: #ffba00">\"' + this.vendor.name + '\"</span>' +
          ' will be permanently deleted.');



        // Set the primary button
        prompt.primaryButton = {
          name: 'Delete',
          buttonFunction: this.deleteVendor,
        }


        // Set the secondary button
        prompt.secondaryButton = {
          name: 'Close'
        };
      });
  }



  deleteVendor() {
    this.dataService.delete('api/Vendors', { id: this.vendor.id }, {
      authorization: true
    }).subscribe();

    this.vendor = null!;
    this.fieldsDisabled = true;
    this.iconButtonsDisabled = true;
    this.submitButtonDisabled = true;
    this.clearFields();
  }





  onAddButtonClick() {
    window.setTimeout(() => {
      this.companyName.nativeElement.focus();
    })

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
    this.dataService.get<Vendor>('api/Vendors/Duplicate', [{ key: 'vendorName', value: this.companyName.nativeElement.value }], {
      authorization: true
    })
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
    this.updateVendorProperties();

    // Post the new vendor to the database
    this.dataService.post<number>('api/Vendors', this.vendor, {
      authorization: true
    })
      .subscribe((vendorId: number) => {
        this.vendor.id = vendorId;

        // If this form was opened from a product
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


  updateVendorProperties() {
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
      this.updateVendorProperties();

      // Update the vendor in the database
      this.dataService.put('api/Vendors', this.vendor, {
        authorization: true
      }).subscribe();
    }
  }

  onEnter(e: KeyboardEvent): void {
    if (document.activeElement != this.closeButton.nativeElement) {
      if (!this.submitButtonDisabled) this.onSubmit();
    }
  }


  onEscape(): void {
    if (!this.vendorProductsPopupOpen) super.onEscape();
  }


  close(): void {
    super.close();
    if (this.vendorProductsPopup) this.vendorProductsPopup.close();
  }
}