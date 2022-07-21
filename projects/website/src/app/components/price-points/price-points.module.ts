import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PricePointsComponent } from './price-points.component';
import { SliderModule } from 'common';
import { RecurringPaymentModule, ShippingModule } from 'projects/common/src/public-api';



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
