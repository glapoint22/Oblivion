import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorPopupComponent } from './vendor-popup.component';
import { SearchModule } from '../../../../search/search.module';
import { IconButtonModule } from '../../../../icon-button/icon-button.module';



@NgModule({
  declarations: [VendorPopupComponent],
  imports: [
    CommonModule,
    SearchModule,
    IconButtonModule
  ],
  exports: [
    VendorPopupComponent
  ]
})
export class VendorPopupModule { }
