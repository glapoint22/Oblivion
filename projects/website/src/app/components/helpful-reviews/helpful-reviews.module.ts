import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpfulReviewsComponent } from './helpful-reviews.component';
import { StarsModule } from 'common';



@NgModule({
  declarations: [HelpfulReviewsComponent],
  imports: [
    CommonModule,
    StarsModule
  ],
  exports: [HelpfulReviewsComponent]
})
export class HelpfulReviewsModule { }