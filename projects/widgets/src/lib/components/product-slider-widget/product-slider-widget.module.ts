import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductSliderWidgetComponent } from './product-slider-widget.component';
import { ProductSummaryModule } from '../product-summary/product-summary.module';
import { SliderModule } from 'common';



@NgModule({
  declarations: [ProductSliderWidgetComponent],
  imports: [
    CommonModule,
    SliderModule,
    ProductSummaryModule
  ],
  exports: [ProductSliderWidgetComponent]
})
export class ProductSliderWidgetModule { }
