import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DataService, LazyLoad, LazyLoadingService, SpinnerAction } from 'common';
import { NotificationProfilePopupUser } from '../../../classes/notifications/notification-profile-popup-user';
import { PromptComponent } from '../../prompt/prompt.component';
import { UserAccountNotificationFormComponent } from '../user-account-notification-form/user-account-notification-form.component';

@Component({
  templateUrl: './notification-profile-popup.component.html',
  styleUrls: ['./notification-profile-popup.component.scss']
})
export class NotificationProfilePopupComponent extends LazyLoad {
  private prompt!: PromptComponent;
  private promptTitle!: string;
  private promptMessage!: SafeHtml;
  private promptButtonName!: string;
  private promptFunction!: Function;
  private userAccountNotificationForm!: UserAccountNotificationFormComponent;

  public user!: NotificationProfilePopupUser;
  public isReview!: boolean;
  public AddNoncompliantStrikeButtonDisabled!: boolean;
  public RemoveUserNameButtonDisabled!: boolean;
  public RemoveUserProfileImageButtonDisabled!: boolean;


  constructor(lazyLoadingService: LazyLoadingService,
    private dataService: DataService,
    private sanitizer: DomSanitizer) {
    super(lazyLoadingService)
  }


  ngOnInit() {
    super.ngOnInit();
    window.addEventListener('mousedown', this.mousedown);
  }


  mousedown = () => {
    if (!this.prompt && !this.userAccountNotificationForm) this.close();
  }


  onEscape(): void {
    if (!this.prompt && !this.userAccountNotificationForm) this.close();
  }


  openPrompt() {
    this.lazyLoadingService.load(async () => {
      const { PromptComponent } = await import('../../prompt/prompt.component');
      const { PromptModule } = await import('../../prompt/prompt.module');

      return {
        component: PromptComponent,
        module: PromptModule
      }
    }, SpinnerAction.None).then((prompt: PromptComponent) => {
      this.prompt = prompt;
      prompt.parentObj = this;
      prompt.title = this.promptTitle;
      prompt.message = this.promptMessage;
      prompt.primaryButton = {
        name: this.promptButtonName,
        buttonFunction: this.promptFunction
      }
      prompt.secondaryButton.name = 'Cancel'

      const promptCloseListener = prompt.onClose.subscribe(() => {
        promptCloseListener.unsubscribe();
        this.prompt = null!;
      })
    })
  }



  oncheckboxClick() {
    this.promptTitle = (!this.user.blockNotificationSending ? 'Block' : 'Unblock') + ' Notification Sending';
    this.promptMessage = this.sanitizer.bypassSecurityTrustHtml(
      'The user' +
      ' <span style="color: #ffba00">\"' + (this.user.nonAccountName ? this.user.nonAccountName : this.user.firstName + ' ' + this.user.lastName) + '\"</span>' +
      ' will ' + (!this.user.blockNotificationSending ? 'be blocked' : 'no longer be blocked') + ' from sending notifications.');
    this.promptButtonName = !this.user.blockNotificationSending ? 'Block' : 'Unblock';
    this.promptFunction = () => {

      // If the user is a non-account user
      if (this.user.nonAccountName) {

        // And that user's email is NOT currently blocked
        if (!this.user.blockNotificationSending) {
          // Block user's email
          this.dataService.post('api/Notifications/BlockNonAccountEmail', {
            email: this.user.email,
            userName: this.user.nonAccountName
          }).subscribe();

          // But if the user's email IS blocked
        } else {

          // Unblock users email
          this.dataService.delete('api/Notifications/UnblockNonAccountEmail', {
            blockedEmail: this.user.email
          }).subscribe();
        }


        // If the user has an account
      } else {

        // Block user from sending notifications
        this.dataService.put('api/Notifications/BlockNotificationSending', {
          userId: this.user.userId
        }).subscribe();
      }

      this.user.blockNotificationSending = !this.user.blockNotificationSending;
    }
    this.openPrompt();
  }




  remove(isUserName: boolean) {
    this.lazyLoadingService.load(async () => {
      const { UserAccountNotificationFormComponent } = await import('../user-account-notification-form/user-account-notification-form.component');
      const { UserAccountNotificationFormModule } = await import('../user-account-notification-form/user-account-notification-form.module');
      return {
        component: UserAccountNotificationFormComponent,
        module: UserAccountNotificationFormModule
      }
    }, SpinnerAction.None)
      .then((userAccountNotificationForm: UserAccountNotificationFormComponent) => {
        this.userAccountNotificationForm = userAccountNotificationForm;
        userAccountNotificationForm.user = this.user;
        userAccountNotificationForm.isUserName = isUserName;


        const userAccountNotificationFormCloseListener = userAccountNotificationForm.onClose.subscribe((isDisabled: boolean) => {
          userAccountNotificationFormCloseListener.unsubscribe();
          this.userAccountNotificationForm = null!;
          if (isUserName) this.RemoveUserNameButtonDisabled = isDisabled;
          if (!isUserName) this.RemoveUserProfileImageButtonDisabled = isDisabled;
        })
      })
  }


  ngOnDestroy() {
    super.ngOnDestroy();
    window.removeEventListener('mousedown', this.mousedown);
  }
}