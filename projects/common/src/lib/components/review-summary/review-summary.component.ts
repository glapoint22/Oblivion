import { Component, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ReviewFilter } from '../../classes/enums';
import { SummaryProduct } from '../../classes/summary-product';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';

@Component({
  selector: 'review-summary',
  templateUrl: './review-summary.component.html',
  styleUrls: ['./review-summary.component.scss']
})
export class ReviewSummaryComponent implements OnChanges {
  @Input() product!: SummaryProduct;
  public percentages: Array<number> = new Array<number>(5);
  public reviewFilter = ReviewFilter;

  constructor(private router: Router, private lazyLoadingService: LazyLoadingService) { }

  ngOnChanges(): void {
    this.percentages[0] = this.getStatPercentage(this.product.oneStar);
    this.percentages[1] = this.getStatPercentage(this.product.twoStars);
    this.percentages[2] = this.getStatPercentage(this.product.threeStars);
    this.percentages[3] = this.getStatPercentage(this.product.fourStars);
    this.percentages[4] = this.getStatPercentage(this.product.fiveStars);

    const percentageTotal = this.percentages.reduce((a, b) => a + b, 0);

    if (percentageTotal != 100) {
      let diff = 100 - percentageTotal;

      for (let i = 4; i > -1; i--) {
        if (this.percentages[i] != 0) {
          this.percentages[i] += diff;
          break;
        }
      }
    }
  }



  getStatPercentage(count: number): number {
    let percentage = Math.round((count / this.product.totalReviews) * 100) / 100;

    percentage = Math.round(percentage * 100);
    return percentage;
  }

  setRoute(filterValue: string) {
    this.router.navigate([this.product.urlName, this.product.urlId, 'reviews'], {
      queryParams: { filter: filterValue, page: null },
      queryParamsHandling: 'merge'
    });

    this.lazyLoadingService.container.clear();
  }
}