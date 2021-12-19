import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductSliderWidgetComponent } from './product-slider-widget.component';
import { SliderModule } from '../../directives/slider/slider.module';
import { ProductThumbnailModule } from '../product-thumbnail/product-thumbnail.module';



@NgModule({
  declarations: [ProductSliderWidgetComponent],
  imports: [
    CommonModule,
    SliderModule,
    ProductThumbnailModule
  ],
  exports: [ProductSliderWidgetComponent]
})
export class ProductSliderWidgetModule { }
