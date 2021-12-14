import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ReviewFilter } from '../../classes/enums';
import { LazyLoad } from '../../classes/lazy-load';
import { Product } from '../../classes/product';
import { ReviewSummaryComponent } from '../review-summary/review-summary.component';

@Component({
  selector: 'review-summary-popup',
  templateUrl: './review-summary-popup.component.html',
  styleUrls: ['./review-summary-popup.component.scss']
})
export class ReviewSummaryPopupComponent extends LazyLoad {
  public product!: Product;
  public top!: number;
  public left!: number
  public starsOverlayLeft!: number;
  public arrowLeft!: number;
  public aboveStars!: boolean;
  private isClosed!: boolean;
  @ViewChild('reviewSummaryPopupContainer') reviewSummaryPopupContainer!: ElementRef<HTMLElement>;
  @ViewChild('reviewSummary', { read: ReviewSummaryComponent }) reviewSummary!: ReviewSummaryComponent;

  


  onMouseLeave() {
    this.close();
    this.isClosed = true;
  }

  ngDoCheck() {
    if (!this.reviewSummaryPopupContainer) return;

    if (this.isClosed && parseFloat(getComputedStyle(this.reviewSummaryPopupContainer.nativeElement).opacity) == 0) {
      this.onHide();
    }
  }

  onButonClick() {
    this.reviewSummary.setRoute(ReviewFilter.AllStars);
  }
}