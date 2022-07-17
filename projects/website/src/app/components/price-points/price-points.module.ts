import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PricePointsComponent } from './price-points.component';
import { SliderModule } from 'common';



@NgModule({
  declarations: [PricePointsComponent],
  imports: [
    CommonModule,
    SliderModule
  ],
  exports: [PricePointsComponent]
})
export class PricePointsModule { }
