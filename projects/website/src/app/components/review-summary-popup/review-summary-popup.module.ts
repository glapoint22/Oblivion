import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewSummaryPopupComponent } from './review-summary-popup.component';
import { ReviewSummaryModule } from '../review-summary/review-summary.module';



@NgModule({
  declarations: [ReviewSummaryPopupComponent],
  imports: [
    CommonModule,
    ReviewSummaryModule
  ]
})
export class ReviewSummaryPopupModule { }
