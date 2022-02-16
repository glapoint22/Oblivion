import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductSummaryComponent } from './product-summary.component';
import { StarsSummaryModule } from 'common';



@NgModule({
  declarations: [ProductSummaryComponent],
  imports: [
    CommonModule,
    StarsSummaryModule
  ],
  exports: [ProductSummaryComponent]
})
export class ProductSummaryModule { }
