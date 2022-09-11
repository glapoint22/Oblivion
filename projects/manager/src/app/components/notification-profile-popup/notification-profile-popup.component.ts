import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService, LazyLoad, LazyLoadingService, SpinnerAction } from 'common';
import { NotificationProfilePopupUser } from '../../classes/notification-profile-popup-user';
import { PromptComponent } from '../../components/prompt/prompt.component';

@Component({
  templateUrl: './notification-profile-popup.component.html',
  styleUrls: ['./notification-profile-popup.component.scss']
})
export class NotificationProfilePopupComponent extends LazyLoad {
  public user!: NotificationProfilePopupUser;
  public isReview!: boolean;


  constructor(lazyLoadingService: LazyLoadingService,
    private dataService: DataService,
    private sanitizer: DomSanitizer) {
    super(lazyLoadingService)
  }



  openNotificationSendingPrompt() {
    this.lazyLoadingService.load(async () => {
      const { PromptComponent } = await import('../../components/prompt/prompt.component');
      const { PromptModule } = await import('../../components/prompt/prompt.module');

      return {
        component: PromptComponent,
        module: PromptModule
      }
    }, SpinnerAction.None).then((prompt: PromptComponent) => {
      prompt.parentObj = this;
      prompt.title = (!this.user.blockNotificationSending ? 'Block' : 'Unblock') + ' Notification Sending';
      prompt.message = this.sanitizer.bypassSecurityTrustHtml(
        'The user' +
        ' <span style="color: #ffba00">\"' + (this.user.userName ? this.user.userName : this.user.firstName + ' ' + this.user.lastName) + '\"</span>' +
        ' will ' + (!this.user.blockNotificationSending ? 'be blocked' : 'no longer be blocked') + ' from sending notifications.');
      prompt.primaryButton = {
        name: !this.user.blockNotificationSending ? 'Block' : 'Unblock',
        buttonFunction: () => {
          this.user.blockNotificationSending = !this.user.blockNotificationSending
        }
      }
      prompt.secondaryButton.name = 'Cancel'
    })
  }



  



}