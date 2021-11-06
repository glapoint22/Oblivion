import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { CustomerService } from './services/customer/customer.service';
import { LazyLoadingService } from './services/lazy-loading/lazy-loading.service';
import { ModalService } from './services/modal/modal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private container: ViewContainerRef, private lazyLoadingService: LazyLoadingService, private modalService: ModalService, private customerService: CustomerService) { }


  ngOnInit(): void {
    this.modalService.container = this.container;
    this.customerService.setCustomer();
  }



  async openSignUpForm(): Promise<void> {
    const { SignUpFormModule } = await import('./components/sign-up-form/sign-up-form.module');
    const { SignUpFormComponent } = await import('./components/sign-up-form/sign-up-form.component');

    this.lazyLoadingService.getModuleRef(SignUpFormModule)
      .then(moduleRef => {
        this.lazyLoadingService.createComponent(SignUpFormComponent, this.container, 0, moduleRef.injector);
      });
  }


  async openLogInForm(): Promise<void> {
    const { LogInFormModule } = await import('./components/log-in-form/log-in-form.module');
    const { LogInFormComponent } = await import('./components/log-in-form/log-in-form.component');

    this.lazyLoadingService.getModuleRef(LogInFormModule)
      .then(moduleRef => {
        this.lazyLoadingService.createComponent(LogInFormComponent, this.container, 0, moduleRef.injector);
      });
  }


  async openCreateAccountForm(): Promise<void> {
    const { CreateAccountFormComponent } = await import('./components/create-account-form/create-account-form.component');
    const { CreateAccountFormModule } = await import('./components/create-account-form/create-account-form.module');

    this.lazyLoadingService.getModuleRef(CreateAccountFormModule)
      .then(moduleRef => {
        this.lazyLoadingService.createComponent(CreateAccountFormComponent, this.container, 0, moduleRef.injector);
      });


  }



  async openForgotPasswordForm() {
    const { ForgotPasswordFormComponent } = await import('./components/forgot-password-form/forgot-password-form.component');
    const { ForgotPasswordFormModule } = await import('./components/forgot-password-form/forgot-password-form.module');

    this.lazyLoadingService.getModuleRef(ForgotPasswordFormModule)
      .then(moduleRef => {
        this.lazyLoadingService.createComponent(ForgotPasswordFormComponent, this.container, 0, moduleRef.injector);
      });
  }





  async openEmailSentPrompt() {
    const { EmailSentPromptComponent } = await import('./components/email-sent-prompt/email-sent-prompt.component');
    this.lazyLoadingService.createComponent(EmailSentPromptComponent, this.container);
  }




  async openChangeNameForm() {
    const { ChangeNameFormComponent } = await import('./components/change-name-form/change-name-form.component');
    const { ChangeNameFormModule } = await import('./components/change-name-form/change-name-form.module');

    this.lazyLoadingService.getModuleRef(ChangeNameFormModule)
      .then(moduleRef => {
        this.lazyLoadingService.createComponent(ChangeNameFormComponent, this.container, 0, moduleRef.injector);
      });
  }


  async openChangeEmailForm() {
    const { ChangeEmailFormComponent } = await import('./components/change-email-form/change-email-form.component');
    const { ChangeEmailFormModule } = await import('./components/change-email-form/change-email-form.module');

    this.lazyLoadingService.getModuleRef(ChangeEmailFormModule)
      .then(moduleRef => {
        this.lazyLoadingService.createComponent(ChangeEmailFormComponent, this.container, 0, moduleRef.injector);
      });
  }




  async openChangePasswordForm() {
    const { ChangePasswordFormComponent } = await import('./components/change-password-form/change-password-form.component');
    const { ChangePasswordFormModule } = await import('./components/change-password-form/change-password-form.module');

    this.lazyLoadingService.getModuleRef(ChangePasswordFormModule)
      .then(moduleRef => {
        this.lazyLoadingService.createComponent(ChangePasswordFormComponent, this.container, 0, moduleRef.injector);
      });
  }


  async openCreatePasswordForm() {
    const { CreatePasswordFormComponent } = await import('./components/create-password-form/create-password-form.component');
    const { CreatePasswordFormModule } = await import('./components/create-password-form/create-password-form.module');

    this.lazyLoadingService.getModuleRef(CreatePasswordFormModule)
      .then(moduleRef => {
        this.lazyLoadingService.createComponent(CreatePasswordFormComponent, this.container, 0, moduleRef.injector);
      });
  }



  async openReportItemForm() {
    const { ReportItemFormComponent } = await import('./components/report-item-form/report-item-form.component');
    const { ReportItemFormModule } = await import('./components/report-item-form/report-item-form.module');

    this.lazyLoadingService.getModuleRef(ReportItemFormModule)
      .then(moduleRef => {
        this.lazyLoadingService.createComponent(ReportItemFormComponent, this.container, 0, moduleRef.injector);
      });
  }


  async openProfilePictureForm() {
    const { ProfilePictureFormComponent } = await import('./components/profile-picture-form/profile-picture-form.component');
    this.lazyLoadingService.createComponent(ProfilePictureFormComponent, this.container);
  }



  async openContactUsForm() {
    const { ContactUsFormComponent } = await import('./components/contact-us-form/contact-us-form.component');
    const { ContactUsFormModule } = await import('./components/contact-us-form/contact-us-form.module');

    this.lazyLoadingService.getModuleRef(ContactUsFormModule)
      .then(moduleRef => {
        this.lazyLoadingService.createComponent(ContactUsFormComponent, this.container, 0, moduleRef.injector);
      });
  }




  async openAddToListForm() {
    const { AddToListFormComponent } = await import('./components/add-to-list-form/add-to-list-form.component');
    const { AddToListFormModule } = await import('./components/add-to-list-form/add-to-list-form.module');

    this.lazyLoadingService.getModuleRef(AddToListFormModule)
      .then(moduleRef => {
        this.lazyLoadingService.createComponent(AddToListFormComponent, this.container, 0, moduleRef.injector);
      });
  }



  async openWriteReviewForm() {
    const { WriteReviewFormComponent } = await import('./components/write-review-form/write-review-form.component');
    const { WriteReviewFormModule } = await import('./components/write-review-form/write-review-form.module');

    this.lazyLoadingService.getModuleRef(WriteReviewFormModule)
      .then(moduleRef => {
        this.lazyLoadingService.createComponent(WriteReviewFormComponent, this.container, 0, moduleRef.injector);
      });
  }


  async openReportReviewForm() {
    const { ReportReviewFormComponent } = await import('./components/report-review-form/report-review-form.component');
    this.lazyLoadingService.createComponent(ReportReviewFormComponent, this.container);
  }


  async openReportReviewPrompt() {
    const { ReportReviewPromptComponent } = await import('./components/report-review-prompt/report-review-prompt.component');
    this.lazyLoadingService.createComponent(ReportReviewPromptComponent, this.container);
  }


  async openCreateListForm() {
    const { CreateListFormComponent } = await import('./components/create-list-form/create-list-form.component');
    const { CreateListFormModule } = await import('./components/create-list-form/create-list-form.module');

    this.lazyLoadingService.getModuleRef(CreateListFormModule)
      .then(moduleRef => {
        this.lazyLoadingService.createComponent(CreateListFormComponent, this.container, 0, moduleRef.injector);
      });
  }


  async openMoveItemPrompt() {
    const { MoveItemPromptComponent } = await import('./components/move-item-prompt/move-item-prompt.component');
    this.lazyLoadingService.createComponent(MoveItemPromptComponent, this.container);
  }


  async openRemoveItemPrompt() {
    const { RemoveItemPromptComponent } = await import('./components/remove-item-prompt/remove-item-prompt.component');
    this.lazyLoadingService.createComponent(RemoveItemPromptComponent, this.container);
  }


  async openDeleteListPrompt() {
    const { DeleteListPromptComponent } = await import('./components/delete-list-prompt/delete-list-prompt.component');
    this.lazyLoadingService.createComponent(DeleteListPromptComponent, this.container);
  }


  async openEditListForm() {
    const { EditListFormComponent } = await import('./components/edit-list-form/edit-list-form.component');
    const { EditListFormModule } = await import('./components/edit-list-form/edit-list-form.module');

    this.lazyLoadingService.getModuleRef(EditListFormModule)
      .then(moduleRef => {
        this.lazyLoadingService.createComponent(EditListFormComponent, this.container, 0, moduleRef.injector);
      });
  }


  async openAccountActivationPrompt() {
    const { AccountActivationPromptComponent } = await import('./components/account-activation-prompt/account-activation-prompt.component');
    this.lazyLoadingService.createComponent(AccountActivationPromptComponent, this.container);
  }


  async openShareListForm() {
    const { ShareListFormComponent } = await import('./components/share-list-form/share-list-form.component');
    this.lazyLoadingService.createComponent(ShareListFormComponent, this.container);
  }


  async openAddToListPrompt() {
    const { AddToListPromptComponent } = await import('./components/add-to-list-prompt/add-to-list-prompt.component');
    this.lazyLoadingService.createComponent(AddToListPromptComponent, this.container);
  }


  


  async openManageCollaboratorsForm() {
    const { ManageCollaboratorsFormComponent } = await import('./components/manage-collaborators-form/manage-collaborators-form.component');
    const { ManageCollaboratorsFormModule } = await import('./components/manage-collaborators-form/manage-collaborators-form.module');

    this.lazyLoadingService.getModuleRef(ManageCollaboratorsFormModule)
      .then(moduleRef => {
        this.lazyLoadingService.createComponent(ManageCollaboratorsFormComponent, this.container, 0, moduleRef.injector);
      });
  }


  async openRemoveCollaboratorPrompt() {
    const { RemoveCollaboratorPromptComponent } = await import('./components/remove-collaborator-prompt/remove-collaborator-prompt.component');
    this.lazyLoadingService.createComponent(RemoveCollaboratorPromptComponent, this.container);
  }
}