import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PricePointsComponent } from './price-points.component';



@NgModule({
  declarations: [PricePointsComponent],
  imports: [
    CommonModule
  ],
  exports: [PricePointsComponent]
})
export class PricePointsModule { }
