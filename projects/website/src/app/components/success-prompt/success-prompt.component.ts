import { Component } from '@angular/core';
import { AccountService, LazyLoad, LazyLoadingService } from 'common';

@Component({
  selector: 'success-prompt',
  templateUrl: './success-prompt.component.html',
  styleUrls: ['./success-prompt.component.scss']
})
export class SuccessPromptComponent extends LazyLoad {
  public header!: string;
  public message!: string;

  constructor(private accountService: AccountService, lazyLoadingService: LazyLoadingService) { super(lazyLoadingService) }

  ngAfterViewInit() {
    super.ngAfterViewInit();
  }

  close() {
    if (this.accountService.onRedirect.observed) {
      this.fade();
      this.accountService.onRedirect.next();

    } else {
      super.close();
    }
  }
}