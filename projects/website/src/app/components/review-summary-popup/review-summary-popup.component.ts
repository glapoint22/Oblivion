import { Component, ElementRef, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
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
  public onClose = new Subject<void>();
  @ViewChild('reviewSummaryPopupContainer') reviewSummaryPopupContainer!: ElementRef<HTMLElement>;
  @ViewChild('reviewSummary', { read: ReviewSummaryComponent }) reviewSummary!: ReviewSummaryComponent;

  ngOnInit(): void {
    this.addEventListeners();
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();

    const onMouseMove = (e: MouseEvent) => {
      if (e.clientX < this.reviewSummaryPopupContainer.nativeElement.getBoundingClientRect().left ||
        e.clientX > this.reviewSummaryPopupContainer.nativeElement.getBoundingClientRect().left + this.reviewSummaryPopupContainer.nativeElement.getBoundingClientRect().width ||
        e.clientY < this.reviewSummaryPopupContainer.nativeElement.getBoundingClientRect().top - (!this.aboveStars ? 10 : 0) ||
        e.clientY > (this.reviewSummaryPopupContainer.nativeElement.getBoundingClientRect().top + this.reviewSummaryPopupContainer.nativeElement.getBoundingClientRect().height) + (this.aboveStars ? 10 : 0)) {

        document.removeEventListener("mousemove", onMouseMove);
        this.close();
        this.onClose.next();
      }
    }
    document.addEventListener("mousemove", onMouseMove);
  }


  onButonClick() {
    this.reviewSummary.setRoute(ReviewFilter.AllStars);
  }
}