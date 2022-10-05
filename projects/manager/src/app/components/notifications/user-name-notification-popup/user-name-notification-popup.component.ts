import { Component } from '@angular/core';
import { NotificationUserName } from '../../../classes/notification-user-name';
import { UserAccountNotificationComponent } from '../user-account-notification/user-account-notification.component';

@Component({
  templateUrl: './user-name-notification-popup.component.html',
  styleUrls: ['../notification-popup/notification-popup.component.scss', '../user-account-notification/user-account-notification.component.scss', './user-name-notification-popup.component.scss']
})
export class UserNameNotificationPopupComponent extends UserAccountNotificationComponent {


  // ====================================================================( NG ON INIT )===================================================================== \\

  ngOnInit(): void {
    super.ngOnInit();
    this.getNotification<Array<NotificationUserName>>('api/Notifications/UserName', [{ key: 'notificationGroupId', value: this.notificationItem.notificationGroupId }, { key: 'isNew', value: this.notificationItem.isNew }]);
  }



  // ===========================================================( OPEN SECONDARY BUTTON PROMPT )============================================================ \\

  openSecondaryButtonPrompt() {
    this.secondaryButtonPromptPrimaryButtonName = 'Remove';
    this.secondaryButtonPromptTitle = 'Remove User Name';
    this.secondaryButtonPromptMessage = this.sanitizer.bypassSecurityTrustHtml(
      'The name,' +
      ' <span style="color: #ffba00">\"' + this.notification[0].firstName + ' ' + this.notification[0].lastName + '\"</span>' +
      ' will be removed from this user. Also, a strike will be added against them for not complying with the terms of use.');
    super.openSecondaryButtonPrompt();
  }



  // =========================================================( SECONDARY BUTTON PROMPT FUNCTION )========================================================== \\

  secondaryButtonPromptFunction() {
    super.secondaryButtonPromptFunction();

    this.dataService.put<boolean>('api/Notifications/AddNoncompliantStrike', {
      userId: this.notification[this.userIndex].userId,
      name: this.notification[this.userIndex].userName
    }).subscribe((nameRemovalSuccessful: boolean)=> {
      if(nameRemovalSuccessful) {
        this.notificationService.addToList(this.notificationService.archiveNotifications, 1, this.notificationItem);
      }
    });
  }
}