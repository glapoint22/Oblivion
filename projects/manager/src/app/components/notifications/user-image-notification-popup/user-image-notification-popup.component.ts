import { Component } from '@angular/core';
import { NotificationUserImage } from '../../../classes/notification-user-image';
import { UserAccountNotificationComponent } from '../user-account-notification/user-account-notification.component';

@Component({
  templateUrl: './user-image-notification-popup.component.html',
  styleUrls: ['../notification-popup/notification-popup.component.scss', '../user-account-notification/user-account-notification.component.scss', './user-image-notification-popup.component.scss']
})
export class UserImageNotificationPopupComponent extends UserAccountNotificationComponent {


  // ====================================================================( NG ON INIT )===================================================================== \\

  ngOnInit(): void {
    super.ngOnInit();
    this.getNotification<Array<NotificationUserImage>>('api/Notifications/UserImage', [{ key: 'notificationGroupId', value: this.notificationItem.notificationGroupId }, { key: 'isNew', value: this.notificationItem.isNew }]);
  }



  // ===========================================================( OPEN SECONDARY BUTTON PROMPT )============================================================ \\

  openSecondaryButtonPrompt() {
    this.secondaryButtonPromptPrimaryButtonName = 'Remove';
    this.secondaryButtonPromptTitle = 'Remove Profile Image';
    this.secondaryButtonPromptMessage = this.sanitizer.bypassSecurityTrustHtml(
      'The profile image for the user,' +
      ' <span style="color: #ffba00">\"' + this.notification[0].firstName + ' ' + this.notification[0].lastName + '\"</span>' +
      ' will be removed. Also, a strike will be added against them for not complying with the terms of use.');
    super.openSecondaryButtonPrompt();
  }



  // =========================================================( SECONDARY BUTTON PROMPT FUNCTION )========================================================== \\

  secondaryButtonPromptFunction() {
    super.secondaryButtonPromptFunction();

    this.dataService.put<boolean>('api/Notifications/AddNoncompliantStrike', {
      userId: this.notification[this.userIndex].userId,
      image: this.notification[this.userIndex].userImage
    }).subscribe((imageRemovalSuccessful: boolean)=> {
      if(imageRemovalSuccessful) {
        this.notificationService.addToList(this.notificationService.archiveNotifications, 1, this.notificationItem);
      }
    });
  }
}