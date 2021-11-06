import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { CustomerService } from '../../../services/customer/customer.service';
import { LazyLoadingService } from '../../../services/lazy-loading/lazy-loading.service';
import { ModalService } from '../../../services/modal/modal.service';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @ViewChild('accountMenuPopupContainer', { read: ViewContainerRef }) accountMenuPopupContainer!: ViewContainerRef;

  constructor(private modalService: ModalService, private lazyLoadingService: LazyLoadingService, public customerService: CustomerService) { }

  ngOnInit(): void {

  }


  async onSignUpClick(): Promise<void> {
    const { SignUpFormComponent } = await import('../../sign-up-form/sign-up-form.component');
    const { SignUpFormModule } = await import('../../sign-up-form/sign-up-form.module');

    this.lazyLoadingService.getModuleRef(SignUpFormModule)
      .then(moduleRef => {
        this.lazyLoadingService.createComponent(SignUpFormComponent, this.modalService.container, 0, moduleRef.injector);
      });
  }



  async onLoginClick(): Promise<void> {
    const { LogInFormComponent } = await import('../../log-in-form/log-in-form.component');
    const { LogInFormModule } = await import('../../log-in-form/log-in-form.module');

    this.lazyLoadingService.getModuleRef(LogInFormModule)
      .then(moduleRef => {
        this.lazyLoadingService.createComponent(LogInFormComponent, this.modalService.container, 0, moduleRef.injector);
      });
  }



  async onProfilePicClick(): Promise<void> {
    if (this.accountMenuPopupContainer.length == 0) {
      const { AccountMenuPopupComponent } = await import('../../account-menu-popup/account-menu-popup.component');
      const { AccountMenuPopupModule } = await import('../../account-menu-popup/account-menu-popup.module');

      this.lazyLoadingService.getModuleRef(AccountMenuPopupModule)
        .then(moduleRef => {
          const accountMenuPopupComponent = this.lazyLoadingService.createComponent(AccountMenuPopupComponent, this.accountMenuPopupContainer, 0, moduleRef.injector);
          accountMenuPopupComponent.accountMenuPopupContainer = this.accountMenuPopupContainer;
        });
    } else {
      this.closeAccountMenuPopup();
    }


  }



  closeAccountMenuPopup() {
    this.accountMenuPopupContainer.clear();
  }
}
