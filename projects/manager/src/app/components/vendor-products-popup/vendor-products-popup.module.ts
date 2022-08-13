import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorProductsPopupComponent } from './vendor-products-popup.component';
import { ImageListModule } from '../lists/image-list/image-list.module';



@NgModule({
  declarations: [VendorProductsPopupComponent],
  imports: [
    CommonModule,
    ImageListModule
  ]
})
export class VendorProductsPopupModule { }
