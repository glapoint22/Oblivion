import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PricePointsComponent } from './price-points.component';
import { RecurringPaymentModule, ShippingModule, SliderModule } from 'common';



@NgModule({
  declarations: [PricePointsComponent],
  imports: [
    CommonModule,
    SliderModule,
    ShippingModule,
    RecurringPaymentModule
  ],
  exports: [PricePointsComponent]
})
export class PricePointsModule { }
