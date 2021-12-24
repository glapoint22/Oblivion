import { Component, ElementRef, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Product } from '../../classes/product';
import { ReviewSummaryPopupComponent } from '../../components/review-summary-popup/review-summary-popup.component';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';

@Component({
  selector: 'stars-summary',
  templateUrl: './stars-summary.component.html',
  styleUrls: ['./stars-summary.component.scss']
})
export class StarsSummaryComponent {
  private reviewSummaryPopup!: ReviewSummaryPopupComponent;
  @Input() product!: Product;
  @ViewChild('starsSummaryContainer') starsSummaryContainer!: ElementRef<HTMLInputElement>;
  constructor(private lazyLoadingService: LazyLoadingService) { }


  async onMouseenter() {
    if (this.product.rating == 0) return;
    const stars = this.starsSummaryContainer.nativeElement.getBoundingClientRect();
    const offScreenLeftDistance = 117 - stars.left; // The distance the popup is off from the left side of the screen
    const offScreenRightDistance = 117 - (window.innerWidth - stars.right); // The distance the popup is off from the right side of the screen
    const offScreenBottomDistance = 278 - (window.innerHeight - stars.bottom) // The distance the popup is off from the bottom of the screen
    const leftOffest = offScreenLeftDistance < 0 ? 0 : offScreenLeftDistance; // How far the popup needs to be moved to get it completely on the left side of the screen
    const rightOffest = offScreenRightDistance < 0 ? 0 : offScreenRightDistance + 20; // How far the popup needs to be moved to get it completely on the right side of the screen
    const bottomOffest = offScreenBottomDistance < 0 ? 0 : 279; // How far the popup needs to be moved to get it completely on the bottom of the screen (above stars or below stars)


    const { ReviewSummaryPopupComponent } = await import('../../components/review-summary-popup/review-summary-popup.component');
    const { ReviewSummaryPopupModule } = await import('../../components/review-summary-popup/review-summary-popup.module');

    this.lazyLoadingService.getComponentAsync(ReviewSummaryPopupComponent, ReviewSummaryPopupModule, this.lazyLoadingService.container)
      .then((reviewSummaryPopup: ReviewSummaryPopupComponent) => {
        reviewSummaryPopup.product = this.product;
        this.reviewSummaryPopup = reviewSummaryPopup;
        reviewSummaryPopup.top = (stars.top + window.scrollY) - bottomOffest;
        reviewSummaryPopup.aboveStars = bottomOffest > 0;
        reviewSummaryPopup.left = (stars.left + window.scrollX) - 117 + leftOffest - rightOffest;
        reviewSummaryPopup.starsOverlayLeft = stars.left - reviewSummaryPopup.left + window.scrollX;
        reviewSummaryPopup.arrowLeft = (reviewSummaryPopup.starsOverlayLeft + 27) < 3 ? 3 : (reviewSummaryPopup.starsOverlayLeft + 27) > 283 ? 283 : (reviewSummaryPopup.starsOverlayLeft + 27);
      });
  }
}