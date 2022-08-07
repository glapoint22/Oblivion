import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorPopupComponent } from './vendor-popup.component';
import { SearchModule } from '../search/search.module';



@NgModule({
  declarations: [VendorPopupComponent],
  imports: [
    CommonModule,
    SearchModule
  ],
  exports: [
    VendorPopupComponent
  ]
})
export class VendorPopupModule { }
