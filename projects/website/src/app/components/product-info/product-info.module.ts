import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductInfoComponent } from './product-info.component';
import { AdditionalInfoModule } from '../additional-info/additional-info.module';
import { MediaSliderComponent } from '../media-slider/media-slider.component';
import { RecurringPaymentModule, ShippingModule, SliderModule, StarsSummaryModule } from 'common';



@NgModule({
  declarations: [
    ProductInfoComponent,
    MediaSliderComponent
  ],
  imports: [
    CommonModule,
    AdditionalInfoModule,
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
