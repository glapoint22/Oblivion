import { Component } from '@angular/core';
import { LazyLoad } from '../../classes/lazy-load';
import { AccountService } from '../../services/account/account.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';

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
    if (this.tabElements) this.tabElements[0].nativeElement.focus();
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