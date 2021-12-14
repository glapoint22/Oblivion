import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductInfoComponent } from './product-info.component';
import { AdditionalInfoModule } from '../additional-info/additional-info.module';
import { StarsSummaryModule } from '../stars-summary/stars-summary.module';



@NgModule({
  declarations: [ProductInfoComponent],
  imports: [
    CommonModule,
    AdditionalInfoModule,
    StarsSummaryModule
  ],
  exports: [
    ProductInfoComponent
  ]
})
export class ProductInfoModule { }
