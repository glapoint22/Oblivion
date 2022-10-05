import { Component, ElementRef, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { NotificationType } from '../../../classes/enums';
import { NotificationItem } from '../../../classes/notification-item';
import { NotificationProfilePopupUser } from '../../../classes/notification-profile-popup-user';
import { NotificationFormComponent } from '../notification-form/notification-form.component';

@Component({
  templateUrl: './user-image-notification-form.component.html',
  styleUrls: ['./user-image-notification-form.component.scss']
})
export class UserImageNotificationFormComponent extends NotificationFormComponent {
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



  // ===================================================================( REMOVE IMAGE )==================================================================== \\
  
  removeImage() {
    this.removedButtonClicked = true;
    this.close();

    this.dataService.put<boolean>('api/Notifications/AddNoncompliantStrike', {
      userId: this.user.userId,
      image: this.user.image
    }).subscribe((imageRemovalSuccessful: boolean) => {
      if (imageRemovalSuccessful) {
        // 
        this.dataService.post<NotificationItem>('api/Notifications/CreateNotification', {
          userId: this.user.userId,
          notificationType: NotificationType.UserImage,
          userImage: this.user.image,
          employeeNotes: this.isEmployeeNotesWritten() ? this.notes.nativeElement.value : null
        }).subscribe((notificationItem: NotificationItem) => {
          this.notificationService.addToList(this.notificationService.archiveNotifications, 1, notificationItem);
        })
        this.user.image = null!
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