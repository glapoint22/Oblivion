import { Component } from '@angular/core';
import { Modal } from '../../classes/modal';

@Component({
  selector: 'sign-up-form',
  templateUrl: './sign-up-form.component.html',
  styleUrls: ['./sign-up-form.component.scss']
})
export class SignUpFormComponent extends Modal {


  async onCreateAccountButtonClick(): Promise<void> {
    this.close();
    const { CreateAccountFormComponent } = await import('../create-account-form/create-account-form.component');
    const { CreateAccountFormModule } = await import('../create-account-form/create-account-form.module');

    this.lazyLoadingService.getModuleRef(CreateAccountFormModule)
      .then(moduleRef => {
        this.lazyLoadingService.createComponent(CreateAccountFormComponent, this.modalService.container, 0, moduleRef.injector);
      })
  }


  async onLogInLinkClick() {
    this.close();
    const { LogInFormModule } = await import('../log-in-form/log-in-form.module')
    const { LogInFormComponent } = await import('../log-in-form/log-in-form.component');

    this.lazyLoadingService.getModuleRef(LogInFormModule)
      .then(moduleRef => {
        this.lazyLoadingService.createComponent(LogInFormComponent, this.modalService.container, 0, moduleRef.injector);
      });
  }
}