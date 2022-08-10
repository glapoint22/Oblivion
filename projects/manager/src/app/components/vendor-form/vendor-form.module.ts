import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorFormComponent } from './vendor-form.component';
import { SearchModule } from '../search/search.module';
import { IconButtonModule } from '../icon-button/icon-button.module';



@NgModule({
  declarations: [VendorFormComponent],
  imports: [
    CommonModule,
    SearchModule,
    IconButtonModule
  ],
  exports: [VendorFormComponent]
})
export class VendorFormModule { }
