import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DataService, LazyLoad, LazyLoadingService, SpinnerAction } from 'common';
import { NotificationProfilePopupUser } from '../../../classes/notification-profile-popup-user';
import { PromptComponent } from '../../prompt/prompt.component';
import { UserImageNotificationFormComponent } from '../user-image-notification-form/user-image-notification-form.component';

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
  private userImageNotificationForm!: UserImageNotificationFormComponent;

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
    if (!this.prompt && !this.userImageNotificationForm) this.close();
  }


  onEscape(): void {
    if (!this.prompt && !this.userImageNotificationForm) this.close();
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
      ' <span style="color: #ffba00">\"' + (this.user.nonAccountUserName ? this.user.nonAccountUserName : this.user.firstName + ' ' + this.user.lastName) + '\"</span>' +
      ' will ' + (!this.user.blockNotificationSending ? 'be blocked' : 'no longer be blocked') + ' from sending notifications.');
    this.promptButtonName = !this.user.blockNotificationSending ? 'Block' : 'Unblock';
    this.promptFunction = () => {

      // If the user is a non-account user
      if (this.user.nonAccountUserName) {

        // And that user's email is NOT currently blocked
        if (!this.user.blockNotificationSending) {
          // Block user's email
          this.dataService.post('api/Notifications/BlockNonAccountEmail', {
            email: this.user.email
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


  onAddNoncompliantStrikeButtonClick() {
    this.promptTitle = 'Add Noncompliant Strike';
    this.promptMessage = this.sanitizer.bypassSecurityTrustHtml(
      'The user' +
      ' <span style="color: #ffba00">\"' + this.user.firstName + ' ' + this.user.lastName + '\"</span>' +
      ' will have a strike added against them for not complying with the terms of use.');
    this.promptButtonName = 'Add Strike';
    this.promptFunction = () => {
      this.user.noncompliantStrikes++;
      this.AddNoncompliantStrikeButtonDisabled = true;

      this.dataService.put('api/Notifications/AddNoncompliantStrike', {
        userId: this.user.userId
      }).subscribe();
    }
    this.openPrompt();
  }



  onRemoveUserNameButtonClick() {
    // this.promptTitle = 'Remove User Name';
    // this.promptMessage = this.sanitizer.bypassSecurityTrustHtml(
    //   'The name' +
    //   ' <span style="color: #ffba00">\"' + this.user.firstName + ' ' + this.user.lastName + '\"</span>' +
    //   ' will be removed from this user. Also, a strike will be added against them for not complying with the terms of use.');
    // this.promptButtonName = 'Remove';
    // this.promptFunction = () => {
    //   this.RemoveUserNameButtonDisabled = true;

    //   this.dataService.put<boolean>('api/Notifications/AddNoncompliantStrike', {
    //     userId: this.user.userId,
    //     name: this.user.firstName + ' ' + this.user.lastName
    //   }).subscribe((nameRemovalSuccessful: boolean) => {
    //     if (nameRemovalSuccessful) {
    //       this.user.firstName = 'NicheShack';
    //       this.user.lastName = 'User';
    //       this.user.noncompliantStrikes++;
    //     }
    //   });
    // }
    // this.openPrompt();





    this.lazyLoadingService.load(async () => {
      const { UserImageNotificationFormComponent } = await import('../user-image-notification-form/user-image-notification-form.component');
      const { UserImageNotificationFormModule } = await import('../user-image-notification-form/user-image-notification-form.module');
      return {
        component: UserImageNotificationFormComponent,
        module: UserImageNotificationFormModule
      }
    }, SpinnerAction.None)
      .then((userImageNotificationForm: UserImageNotificationFormComponent) => {
        this.userImageNotificationForm = userImageNotificationForm;
        userImageNotificationForm.user = this.user;
        userImageNotificationForm.isUserName = true;

        
        const userImageNotificationFormCloseListener = userImageNotificationForm.onClose.subscribe((RemoveUserProfileImageButtonDisabled: boolean) => {
          userImageNotificationFormCloseListener.unsubscribe();
          this.userImageNotificationForm = null!;
          this.RemoveUserProfileImageButtonDisabled = RemoveUserProfileImageButtonDisabled;
        })
      })

  }



  onRemoveUserProfileImageButtonClick() {
    this.lazyLoadingService.load(async () => {
      const { UserImageNotificationFormComponent } = await import('../user-image-notification-form/user-image-notification-form.component');
      const { UserImageNotificationFormModule } = await import('../user-image-notification-form/user-image-notification-form.module');
      return {
        component: UserImageNotificationFormComponent,
        module: UserImageNotificationFormModule
      }
    }, SpinnerAction.None)
      .then((userImageNotificationForm: UserImageNotificationFormComponent) => {
        this.userImageNotificationForm = userImageNotificationForm;
        userImageNotificationForm.user = this.user;
        userImageNotificationForm.isUserName = false;
        
        const userImageNotificationFormCloseListener = userImageNotificationForm.onClose.subscribe((RemoveUserProfileImageButtonDisabled: boolean) => {
          userImageNotificationFormCloseListener.unsubscribe();
          this.userImageNotificationForm = null!;
          this.RemoveUserProfileImageButtonDisabled = RemoveUserProfileImageButtonDisabled;
        })
      })
  }


  ngOnDestroy() {
    window.removeEventListener('mousedown', this.mousedown);
  }
}