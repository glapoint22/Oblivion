import { Component, Input, OnChanges } from '@angular/core';
import { Product } from '../../classes/product';

@Component({
  selector: 'review-summary',
  templateUrl: './review-summary.component.html',
  styleUrls: ['./review-summary.component.scss']
})
export class ReviewSummaryComponent implements OnChanges {
  @Input() product!: Product;
  public percentages: Array<number> = new Array<number>(5);

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

}
