import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductInfoComponent } from './product-info.component';
import { AdditionalInfoModule } from '../additional-info/additional-info.module';
import { StarsModule } from '../stars/stars.module';



@NgModule({
  declarations: [ProductInfoComponent],
  imports: [
    CommonModule,
    AdditionalInfoModule,
    StarsModule
  ],
  exports: [
    ProductInfoComponent
  ]
})
export class ProductInfoModule { }
