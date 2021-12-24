import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PricePointsComponent } from './price-points.component';
import { AdditionalInfoModule } from '../additional-info/additional-info.module';
import { SliderModule } from '../../directives/slider/slider.module';



@NgModule({
  declarations: [PricePointsComponent],
  imports: [
    CommonModule,
    AdditionalInfoModule,
    SliderModule
  ],
  exports: [PricePointsComponent]
})
export class PricePointsModule { }
