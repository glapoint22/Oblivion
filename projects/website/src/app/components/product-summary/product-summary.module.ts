import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarsSummaryModule } from '../stars-summary/stars-summary.module';
import { ProductSummaryComponent } from './product-summary.component';



@NgModule({
  declarations: [ProductSummaryComponent],
  imports: [
    CommonModule,
    StarsSummaryModule
  ],
  exports: [ProductSummaryComponent]
})
export class ProductSummaryModule { }
