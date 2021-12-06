import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewSummaryComponent } from './review-summary.component';
import { StarsModule } from '../stars/stars.module';



@NgModule({
  declarations: [ReviewSummaryComponent],
  imports: [
    CommonModule,
    StarsModule
  ],
  exports: [
    ReviewSummaryComponent
  ]
})
export class ReviewSummaryModule { }
