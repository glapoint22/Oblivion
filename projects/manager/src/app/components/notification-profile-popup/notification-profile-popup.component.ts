import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DataService, LazyLoad, LazyLoadingService, SpinnerAction } from 'common';
import { NotificationProfilePopupUser } from '../../classes/notification-profile-popup-user';
import { PromptComponent } from '../../components/prompt/prompt.component';

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

  public user!: NotificationProfilePopupUser;
  public isReview!: boolean;
  public AddNoncompliantStrikeButtonDisabled!: boolean;
  public RemoveUserProfilePicButtonDisabled!: boolean;


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
    if (!this.prompt) this.close();
  }


  openPrompt() {
    this.lazyLoadingService.load(async () => {
      const { PromptComponent } = await import('../../components/prompt/prompt.component');
      const { PromptModule } = await import('../../components/prompt/prompt.module');

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
      ' <span style="color: #ffba00">\"' + (this.user.userName ? this.user.userName : this.user.firstName + ' ' + this.user.lastName) + '\"</span>' +
      ' will ' + (!this.user.blockNotificationSending ? 'be blocked' : 'no longer be blocked') + ' from sending notifications.');
    this.promptButtonName = !this.user.blockNotificationSending ? 'Block' : 'Unblock';
    this.promptFunction = () => {

      // If the user is a non-account user
      if (this.user.userName) {

        // And that user's email is NOT currently blocked
        if (!this.user.blockNotificationSending) {
          // Block user's email
          this.dataService.post('api/Notifications/BlockEmail', {
            email: this.user.email
          }).subscribe();

          // But if the user's email IS blocked
        } else {
          
          // Unblock users email
          this.dataService.delete('api/Notifications/UnblockEmail', {
            blockedEmail: this.user.email
          }).subscribe();
        }


        // If the user has an account
      } else {

        // Block user from sending notifications
        this.dataService.put('api/Notifications/NotificationSending', {
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
      this.RemoveUserProfilePicButtonDisabled = true;

      this.dataService.put('api/Notifications/AddNoncompliantStrike', {
        userId: this.user.userId
      }).subscribe();
    }
    this.openPrompt();
  }



  onRemoveUserProfilePicButtonClick() {
    this.promptTitle = 'Remove Profile Picture';
    this.promptMessage = this.sanitizer.bypassSecurityTrustHtml(
      'The profile picture of the user' +
      ' <span style="color: #ffba00">\"' + this.user.firstName + ' ' + this.user.lastName + '\"</span>' +
      ' will be removed and a strike will be added against them for not complying with the terms of use.');
    this.promptButtonName = 'Remove';
    this.promptFunction = () => {
      this.user.image = null!
      this.user.noncompliantStrikes++;
      this.AddNoncompliantStrikeButtonDisabled = true;

      this.dataService.put('api/Notifications/AddNoncompliantStrike', {
        userId: this.user.userId,
        removeProfilePic: true
      }).subscribe();
    }
    this.openPrompt();
  }


  ngOnDestroy() {
    window.removeEventListener('mousedown', this.mousedown);
  }
}