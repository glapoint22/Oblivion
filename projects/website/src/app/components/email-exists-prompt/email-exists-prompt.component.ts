import { Component } from '@angular/core';
import { LazyLoad } from '../../classes/lazy-load';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { CreateAccountFormComponent } from '../create-account-form/create-account-form.component';

@Component({
  selector: 'email-exists-prompt',
  templateUrl: './email-exists-prompt.component.html',
  styleUrls: ['./email-exists-prompt.component.scss']
})
export class EmailExistsPromptComponent extends LazyLoad {
  public email!: string;
  public createAccountForm!: CreateAccountFormComponent;

  constructor
    (
      lazyLoadingService: LazyLoadingService,
      private spinnerService: SpinnerService
    ) { super(lazyLoadingService) }


  ngAfterViewInit() {
    super.ngAfterViewInit();
    if (this.tabElements) this.tabElements[0].nativeElement.focus();
  }


  async openCreateAccountForm() {
    this.fade();
    this.spinnerService.show = true;
    const { CreateAccountFormComponent } = await import('../create-account-form/create-account-form.component');
    const { CreateAccountFormModule } = await import('../create-account-form/create-account-form.module');

    this.lazyLoadingService.getComponentAsync(CreateAccountFormComponent, CreateAccountFormModule, this.lazyLoadingService.container)
      .then(() => {
        this.spinnerService.show = false;
      });
  }


  close() {
    this.openCreateAccountForm();
  }
}