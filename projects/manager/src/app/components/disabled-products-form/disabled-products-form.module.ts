import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisabledProductsFormComponent } from './disabled-products-form.component';
import { ImageListModule } from '../lists/image-list/image-list.module';



@NgModule({
  declarations: [DisabledProductsFormComponent],
  imports: [
    CommonModule,
    ImageListModule
  ]
})
export class DisabledProductsFormModule { }