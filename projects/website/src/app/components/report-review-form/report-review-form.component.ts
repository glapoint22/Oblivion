import { Component } from '@angular/core';
import { LazyLoad } from '../../classes/lazy-load';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { SuccessPromptComponent } from '../success-prompt/success-prompt.component';

@Component({
  selector: 'report-review-form',
  templateUrl: './report-review-form.component.html',
  styleUrls: ['./report-review-form.component.scss']
})
export class ReportReviewFormComponent extends LazyLoad {
  public productId!: number;
  public reviewId!: number;
  public comments!: string;

  constructor(private dataService: DataService, private spinnerService: SpinnerService, private lazyLoadingService: LazyLoadingService) { super() }

  onSubmit() {
    this.spinnerService.show = true;
    this.dataService.post('api/Notifications', {
      productId: this.productId,
      reviewId: this.reviewId,
      type: 1,
      comments: this.comments
    }, { authorization: true })
      .subscribe(() => {
        this.fade();
        this.openSuccessPrompt();
      });
  }


  async openSuccessPrompt() {
    const { SuccessPromptComponent } = await import('../success-prompt/success-prompt.component');
    const { SuccessPromptModule } = await import('../success-prompt/success-prompt.module');

    this.lazyLoadingService.getComponentAsync(SuccessPromptComponent, SuccessPromptModule, this.lazyLoadingService.container)
      .then((successPrompt: SuccessPromptComponent) => {
        successPrompt.header = 'Report Review Feedback';
        successPrompt.message = 'Thank you for your feedback.';
        successPrompt.reportReviewForm = this;
        this.spinnerService.show = false;
      });
  }
}