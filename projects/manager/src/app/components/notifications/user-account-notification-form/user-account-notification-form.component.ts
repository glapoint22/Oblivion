import { Component, ElementRef, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { NotificationType } from '../../../classes/enums';
import { NotificationItem } from '../../../classes/notification-item';
import { NotificationProfilePopupUser } from '../../../classes/notification-profile-popup-user';
import { NotificationFormComponent } from '../notification-form/notification-form.component';

@Component({
  templateUrl: './user-account-notification-form.component.html',
  styleUrls: ['./user-account-notification-form.component.scss']
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

    this.dataService.put<boolean>('api/Notifications/AddNoncompliantStrike', {
      userId: this.user.userId,
      userName: this.isUserName ? this.user.firstName + ' ' + this.user.lastName : null,
      userImage: !this.isUserName ? this.user.image : null

    }).subscribe((removalSuccessful: boolean) => {

      // If the removal of the name or the image was successful
      if (removalSuccessful) {

        // Create the notification
        this.dataService.post<NotificationItem>('api/Notifications/CreateNotification', {
          userId: this.user.userId,
          notificationType: this.isUserName ? NotificationType.UserName : NotificationType.UserImage,
          userName: this.isUserName ? this.user.firstName + ' ' + this.user.lastName : null,
          userImage: !this.isUserName ? this.user.image : null,
          employeeNotes: this.isEmployeeNotesWritten() ? this.notes.nativeElement.value : null
        }).subscribe((notificationItem: NotificationItem) => {
          this.notificationService.addToList(this.notificationService.archiveNotifications, 1, notificationItem);
        })

        this.user.noncompliantStrikes++;

        if(this.isUserName) {
          this.user.firstName = 'NicheShack';
          this.user.lastName = 'User';
        }else {
          this.user.image = null!
        }
      }
    });
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