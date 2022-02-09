import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { SpinnerAction } from '../../classes/enums';
import { Product } from '../../classes/product';
import { ReviewSummaryPopupComponent } from '../../components/review-summary-popup/review-summary-popup.component';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';

@Component({
  selector: 'stars-summary',
  templateUrl: './stars-summary.component.html',
  styleUrls: ['./stars-summary.component.scss']
})
export class StarsSummaryComponent {
  @Input() product!: Product;
  @ViewChild('starsSummaryContainer') starsSummaryContainer!: ElementRef<HTMLElement>;
  private timeout!: number;
  private popupOpen!: boolean;

  constructor(private lazyLoadingService: LazyLoadingService) { }


  onMouseenter() {
    if (this.product.rating == 0) return;

    if (!this.popupOpen) {
      this.timeout = window.setTimeout(() => {
        this.OpenReviewSummaryPopup();
      }, 750);
    }
  }


  onMouseLeave() {
    if (!this.popupOpen) {
      window.clearTimeout(this.timeout);
    }
  }


  async OpenReviewSummaryPopup() {
    const stars = this.starsSummaryContainer.nativeElement.getBoundingClientRect();
    const offScreenLeftDistance = 117 - stars.left; // The distance the popup is off from the left side of the screen
    const offScreenRightDistance = 117 - (window.innerWidth - stars.right); // The distance the popup is off from the right side of the screen
    const offScreenBottomDistance = 278 - (window.innerHeight - stars.bottom) // The distance the popup is off from the bottom of the screen
    const leftOffest = offScreenLeftDistance < 0 ? 0 : offScreenLeftDistance; // How far the popup needs to be moved to get it completely on the left side of the screen
    const rightOffest = offScreenRightDistance < 0 ? 0 : offScreenRightDistance + 20; // How far the popup needs to be moved to get it completely on the right side of the screen
    const bottomOffest = offScreenBottomDistance < 0 ? 0 : 279; // How far the popup needs to be moved to get it completely on the bottom of the screen (above stars or below stars)

    // Load the review summary popup
    this.lazyLoadingService.load(async () => {
      const { ReviewSummaryPopupComponent } = await import('../../components/review-summary-popup/review-summary-popup.component');
      const { ReviewSummaryPopupModule } = await import('../../components/review-summary-popup/review-summary-popup.module');

      return {
        component: ReviewSummaryPopupComponent,
        module: ReviewSummaryPopupModule
      }
    }, SpinnerAction.None)
      .then((reviewSummaryPopup: ReviewSummaryPopupComponent) => {
        this.popupOpen = true;
        reviewSummaryPopup.product = this.product;
        reviewSummaryPopup.top = (stars.top + window.scrollY) - bottomOffest;
        reviewSummaryPopup.aboveStars = bottomOffest > 0;
        reviewSummaryPopup.left = (stars.left + window.scrollX) - 117 + leftOffest - rightOffest;
        reviewSummaryPopup.starsOverlayLeft = stars.left - reviewSummaryPopup.left + window.scrollX;
        reviewSummaryPopup.arrowLeft = (reviewSummaryPopup.starsOverlayLeft + 27) < 3 ? 3 : (reviewSummaryPopup.starsOverlayLeft + 27) > 283 ? 283 : (reviewSummaryPopup.starsOverlayLeft + 27);
        reviewSummaryPopup.onClose.subscribe(() => {
          this.popupOpen = false;
        })
      });
  }
}