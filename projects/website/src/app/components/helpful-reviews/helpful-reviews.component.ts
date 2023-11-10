import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'common';
import { HelpfulReviews } from '../../classes/helpful-reviews';
import { Subscription } from 'rxjs';

@Component({
  selector: 'helpful-reviews',
  templateUrl: './helpful-reviews.component.html',
  styleUrls: ['./helpful-reviews.component.scss']
})
export class HelpfulReviewsComponent implements OnInit {
  public helpfulReviews!: HelpfulReviews;
  private dataServiceGetSubscription!: Subscription;

  constructor(private dataService: DataService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.dataServiceGetSubscription = this.dataService.get<HelpfulReviews>('api/ProductReviews/GetPositiveNegativeReviews', [{ key: 'productId', value: this.route.snapshot.paramMap.get('id') }])
      .subscribe((helpfulReviews: HelpfulReviews) => {
        this.helpfulReviews = helpfulReviews;
      });
  }


  getDate(date: string) {
    return new Date(date + 'Z');
  }



  ngOnDestroy() {
    if (this.dataServiceGetSubscription) this.dataServiceGetSubscription.unsubscribe();
  }
}