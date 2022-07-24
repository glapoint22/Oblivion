import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorPopupComponent } from './vendor-popup.component';



@NgModule({
  declarations: [VendorPopupComponent],
  imports: [
    CommonModule
  ],
  exports: [
    VendorPopupComponent
  ]
})
export class VendorPopupModule { }
