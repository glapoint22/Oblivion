import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReviewsPageRoutingModule } from './reviews-page-routing.module';
import { ReviewsPageComponent } from './reviews-page.component';
import { HeaderFooterModule } from '../../components/header-footer/header-footer.module';
import { ReviewSummaryModule } from '../../components/review-summary/review-summary.module';
import { HelpfulReviewsModule } from '../../components/helpful-reviews/helpful-reviews.module';
import { ReviewsModule } from '../../components/reviews/reviews.module';


@NgModule({
  declarations: [ReviewsPageComponent],
  imports: [
    CommonModule,
    ReviewsPageRoutingModule,
    HeaderFooterModule,
    ReviewSummaryModule,
    HelpfulReviewsModule,
    ReviewsModule
  ]
})
export class ReviewsPageModule { }
