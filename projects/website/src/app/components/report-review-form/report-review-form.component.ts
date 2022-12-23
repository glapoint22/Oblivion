import { Component } from '@angular/core';
import { DataService, LazyLoad, LazyLoadingService, NotificationType, SpinnerAction } from 'common';
import { SuccessPromptComponent } from '../success-prompt/success-prompt.component';

@Component({
  selector: 'report-review-form',
  templateUrl: './report-review-form.component.html',
  styleUrls: ['./report-review-form.component.scss']
})
export class ReportReviewFormComponent extends LazyLoad {
  public productId!: string;
  public reviewId!: number;
  public comments!: string;

  constructor
    (
      lazyLoadingService: LazyLoadingService,
      private dataService: DataService
    ) { super(lazyLoadingService) }


  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.setFocus(0);
  }


  onSubmit() {
    this.dataService.post('api/Notifications/PostReviewComplaintNotification', {
      productId: this.productId,
      reviewId: this.reviewId,
      text: this.comments != null && this.comments.trim().length > 0 ? this.comments.trim() : null
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


  onEnter(e: KeyboardEvent): void {
    if (this.tabElements) {
      if (this.tabElements[0].nativeElement != document.activeElement &&
        this.tabElements[1].nativeElement != document.activeElement) {
        this.onSubmit();
      }
    }
  }
}