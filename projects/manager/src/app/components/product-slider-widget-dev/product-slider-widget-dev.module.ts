import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductSliderWidgetDevComponent } from './product-slider-widget-dev.component';
import { SliderModule } from 'common';
import { ProductSummaryModule } from 'widgets';



@NgModule({
  declarations: [ProductSliderWidgetDevComponent],
  imports: [
    CommonModule,
    SliderModule,
    ProductSummaryModule
  ]
})
export class ProductSliderWidgetDevModule { }
