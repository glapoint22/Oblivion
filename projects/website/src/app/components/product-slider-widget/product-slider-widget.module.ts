import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductSliderWidgetComponent } from './product-slider-widget.component';
import { SliderModule } from '../../directives/slider/slider.module';
import { ProductSummaryModule } from '../product-summary/product-summary.module';



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
