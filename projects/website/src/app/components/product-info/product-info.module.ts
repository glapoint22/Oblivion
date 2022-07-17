import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductInfoComponent } from './product-info.component';
import { MediaSliderComponent } from '../media-slider/media-slider.component';
import { RecurringPaymentModule, ShippingModule, SliderModule, StarsSummaryModule } from 'common';



@NgModule({
  declarations: [
    ProductInfoComponent,
    MediaSliderComponent
  ],
  imports: [
    CommonModule,
    StarsSummaryModule,
    SliderModule,
    ShippingModule,
    RecurringPaymentModule
  ],
  exports: [
    ProductInfoComponent
  ]
})
export class ProductInfoModule { }
