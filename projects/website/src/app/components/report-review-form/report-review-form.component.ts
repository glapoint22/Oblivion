import { Component } from '@angular/core';
import { LazyLoad } from '../../classes/lazy-load';
import { DataService } from '../../services/data/data.service';

@Component({
  selector: 'report-review-form',
  templateUrl: './report-review-form.component.html',
  styleUrls: ['./report-review-form.component.scss']
})
export class ReportReviewFormComponent extends LazyLoad {
  public productId!: number;
  public reviewId!: number;
  public comments!: string;

  constructor(private dataService: DataService) { super() }

  onSubmit() {
    this.dataService.post('api/Notifications', {
      productId: this.productId,
      reviewId: this.reviewId,
      type: 1,
      comments: this.comments
    }, { authorization: true })
      .subscribe(() => {
        this.close();
      });
  }
}