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

  constructor
    (
      lazyLoadingService: LazyLoadingService,
      private dataService: DataService,
      private spinnerService: SpinnerService
    ) { super(lazyLoadingService) }


  ngAfterViewInit() {
    super.ngAfterViewInit();
    if (this.tabElements) this.tabElements[0].nativeElement.focus();
  }


  onSubmit() {
    this.spinnerService.show = true;
    this.dataService.post('api/Notifications', {
      productId: this.productId,
      reviewId: this.reviewId,
      type: 1,
      comments: this.comments
    }, { authorization: true })
      .subscribe(() => {
        this.openSuccessPrompt();
      });
  }


  async openSuccessPrompt() {
    this.fade();
    const { SuccessPromptComponent } = await import('../success-prompt/success-prompt.component');
    const { SuccessPromptModule } = await import('../success-prompt/success-prompt.module');

    this.lazyLoadingService.getComponentAsync(SuccessPromptComponent, SuccessPromptModule, this.lazyLoadingService.container)
      .then((successPrompt: SuccessPromptComponent) => {
        successPrompt.header = 'Report Review';
        successPrompt.message = 'Thank you for your feedback.';
        this.spinnerService.show = false;
      });
  }
}