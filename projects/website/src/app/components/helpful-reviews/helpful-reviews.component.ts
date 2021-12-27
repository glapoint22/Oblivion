import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HelpfulReviews } from '../../classes/helpful-reviews';
import { DataService } from '../../services/data/data.service';

@Component({
  selector: 'helpful-reviews',
  templateUrl: './helpful-reviews.component.html',
  styleUrls: ['./helpful-reviews.component.scss']
})
export class HelpfulReviewsComponent implements OnInit {
  public helpfulReviews!: HelpfulReviews;

  constructor(private dataService: DataService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.dataService.get<HelpfulReviews>('api/ProductReviews/PositiveNegativeReviews', [{ key: 'productId', value: this.route.snapshot.paramMap.get('id') }])
      .subscribe((helpfulReviews: HelpfulReviews) => {
        this.helpfulReviews = helpfulReviews;
      });
  }
}