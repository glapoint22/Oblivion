import { Component, ElementRef, ViewChild } from '@angular/core';
import { NotificationType } from 'common';
import { Subject } from 'rxjs';
import { NotificationItem } from '../../../classes/notifications/notification-item';
import { NotificationProfilePopupUser } from '../../../classes/notifications/notification-profile-popup-user';
import { NotificationFormComponent } from '../notification-form/notification-form.component';

@Component({
  templateUrl: './user-account-notification-form.component.html',
  styleUrls: ['../notification-form/notification-form.component.scss', './user-account-notification-form.component.scss']
})
export class UserAccountNotificationFormComponent extends NotificationFormComponent {
  private removedButtonClicked!: boolean;

  public user!: NotificationProfilePopupUser;
  public onClose: Subject<boolean> = new Subject<boolean>();
  public isUserName!: boolean;

  @ViewChild('notes') notes!: ElementRef<HTMLTextAreaElement>;



  // ============================================================( IS EMPLOYEE NOTES WRITTEN )============================================================== \\

  isEmployeeNotesWritten(): boolean {
    return this.notes.nativeElement.value != null &&
      this.notes.nativeElement.value.trim().length > 0
  }



  // ======================================================================( REMOVE )======================================================================= \\

  remove() {
    this.removedButtonClicked = true;
    this.close();

    // Create a new notification
    this.dataService.post<NotificationItem>('api/Notifications/CreateNotification', {
      userId: this.user.userId,
      type: this.isUserName ? NotificationType.UserName : NotificationType.UserImage,
      userName: this.isUserName ? this.user.firstName + ' ' + this.user.lastName : null,
      userImage: !this.isUserName ? this.user.image : null,
      employeeNotes: this.isEmployeeNotesWritten() ? this.notes.nativeElement.value : null
    }, {
      authorization: true
    }).subscribe((notificationItem: NotificationItem) => {
      
      // Put the new notification in the archive list
      this.notificationService.addToList(this.notificationService.archiveNotifications, 1, notificationItem);

      // If we're removing a user name
      if (this.isUserName) {
        this.dataService.put('api/Notifications/ReplaceUserName', {
          userId: this.user.userId,
          userName: this.user.firstName + ' ' + this.user.lastName,
          notificationGroupId: notificationItem.notificationGroupId,
          notificationId: notificationItem.id
        }, {
          authorization: true
        }).subscribe();

        // If we're removing an image
      } else {

        this.dataService.put('api/Notifications/RemoveUserImage', {
          userId: this.user.userId,
          userImage: this.user.image,
          notificationGroupId: notificationItem.notificationGroupId,
          notificationId: notificationItem.id
        }, {
          authorization: true
        }).subscribe();
      }
    })
  }



  // ======================================================================( CLOSE )======================================================================== \\

  close(): void {
    super.close();
    this.onClose.next(this.removedButtonClicked);
  }



  // =====================================================================( ON ESCAPE )===================================================================== \\

  onEscape(): void {
    if (this.profilePopupContainer.length == 0 && !this.undoChangesPrompt) {
      if (!this.isEmployeeNotesWritten()) {
        this.close();
      } else {
        this.openUndoChangesPrompt();
      }
    }
  }
}