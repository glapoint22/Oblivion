import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductInfoComponent } from './product-info.component';
import { AdditionalInfoModule } from '../additional-info/additional-info.module';
import { StarsSummaryModule } from '../stars-summary/stars-summary.module';
import { SliderModule } from '../../directives/slider/slider.module';
import { MediaSliderComponent } from '../media-slider/media-slider.component';



@NgModule({
  declarations: [
    ProductInfoComponent,
    MediaSliderComponent
  ],
  imports: [
    CommonModule,
    AdditionalInfoModule,
    StarsSummaryModule,
    SliderModule
  ],
  exports: [
    ProductInfoComponent
  ]
})
export class ProductInfoModule { }
