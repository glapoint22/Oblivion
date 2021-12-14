import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarsSummaryComponent } from './stars-summary.component';
import { StarsModule } from '../stars/stars.module';



@NgModule({
  declarations: [StarsSummaryComponent],
  imports: [
    CommonModule,
    StarsModule
  ],
  exports: [StarsSummaryComponent]
})
export class StarsSummaryModule { }
