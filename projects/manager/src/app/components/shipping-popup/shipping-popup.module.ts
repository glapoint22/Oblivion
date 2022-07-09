import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShippingPopupComponent } from './shipping-popup.component';



@NgModule({
  declarations: [ShippingPopupComponent],
  imports: [
    CommonModule
  ],
  exports: [
    ShippingPopupComponent
  ]
})
export class ShippingPopupModule { }
