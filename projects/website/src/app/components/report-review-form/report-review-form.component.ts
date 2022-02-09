import { Component } from '@angular/core';
import { SpinnerAction } from '../../classes/enums';
import { LazyLoad } from '../../classes/lazy-load';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
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

  constructor
    (
      lazyLoadingService: LazyLoadingService,
      private dataService: DataService
    ) { super(lazyLoadingService) }


  ngAfterViewInit() {
    super.ngAfterViewInit();
    if (this.tabElements) this.tabElements[0].nativeElement.focus();
  }


  onSubmit() {
    this.dataService.post('api/Notifications', {
      productId: this.productId,
      reviewId: this.reviewId,
      type: 1,
      comments: this.comments
    }, {
      authorization: true,
      spinnerAction: SpinnerAction.Start
    })
      .subscribe(() => {
        this.openSuccessPrompt();
      });
  }


  async openSuccessPrompt() {
    this.fade();

    this.lazyLoadingService.load(async () => {
      const { SuccessPromptComponent } = await import('../success-prompt/success-prompt.component');
      const { SuccessPromptModule } = await import('../success-prompt/success-prompt.module');

      return {
        component: SuccessPromptComponent,
        module: SuccessPromptModule
      }
    }, SpinnerAction.End)
      .then((successPrompt: SuccessPromptComponent) => {
        successPrompt.header = 'Report Review';
        successPrompt.message = 'Thank you for your feedback.';
      });
  }
}