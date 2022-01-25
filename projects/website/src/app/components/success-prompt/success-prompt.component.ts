import { Component } from '@angular/core';
import { LazyLoad } from '../../classes/lazy-load';
import { ChangeNameFormComponent } from '../change-name-form/change-name-form.component';
import { ChangePasswordFormComponent } from '../change-password-form/change-password-form.component';
import { ContactUsFormComponent } from '../contact-us-form/contact-us-form.component';
import { DeleteAccountFormComponent } from '../delete-account-form/delete-account-form.component';
import { EmailVerificationFormComponent } from '../email-verification-form/email-verification-form.component';
import { ProfilePictureFormComponent } from '../profile-picture-form/profile-picture-form.component';
import { ReportItemFormComponent } from '../report-item-form/report-item-form.component';
import { ReportReviewFormComponent } from '../report-review-form/report-review-form.component';
import { ShareListFormComponent } from '../share-list-form/share-list-form.component';
import { WriteReviewFormComponent } from '../write-review-form/write-review-form.component';

@Component({
  selector: 'success-prompt',
  templateUrl: './success-prompt.component.html',
  styleUrls: ['./success-prompt.component.scss']
})
export class SuccessPromptComponent extends LazyLoad {
  public header!: string;
  public message!: string;
  public deleteAccountForm!: DeleteAccountFormComponent;
  public changeNameForm!: ChangeNameFormComponent;
  public changePasswordForm!: ChangePasswordFormComponent;
  public emailVerificationForm!: EmailVerificationFormComponent;
  public profilePictureForm!: ProfilePictureFormComponent;
  public shareListForm!: ShareListFormComponent;
  public reportReviewForm!: ReportReviewFormComponent;
  public contactUsForm!: ContactUsFormComponent;
  public reportItemForm!: ReportItemFormComponent;
  public writeReviewForm!: WriteReviewFormComponent;

  close() {
    super.close();
    if (this.deleteAccountForm) this.deleteAccountForm.close();
    if (this.changeNameForm) this.changeNameForm.close();
    if (this.changePasswordForm) this.changePasswordForm.close();
    if (this.emailVerificationForm) this.emailVerificationForm.close();
    if (this.profilePictureForm) this.profilePictureForm.close();
    if (this.shareListForm) this.shareListForm.close();
    if (this.reportReviewForm) this.reportReviewForm.close();
    if (this.contactUsForm) this.contactUsForm.close();
    if (this.reportItemForm) this.reportItemForm.close();
    if (this.writeReviewForm) this.writeReviewForm.close();
  }
}