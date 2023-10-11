import { Component } from '@angular/core';
import { SpinnerAction } from 'common';
import { MenuOptionType } from '../../../classes/enums';
import { MenuOption } from '../../../classes/menu-option';
import { NotificationEmployee } from '../../../classes/notifications/notification-employee';
import { ReviewComplaintNotification } from '../../../classes/notifications/review-complaint-notification';
import { NotificationPopupComponent } from '../notification-popup/notification-popup.component';
import { RemoveRestoreReviewFormComponent } from '../remove-restore-review-form/remove-restore-review-form.component';

@Component({
  templateUrl: './review-complaint-notification-popup.component.html',
  styleUrls: ['../notification-form/notification-form.component.scss', '../product-notification-popup/product-notification-popup.component.scss', './review-complaint-notification-popup.component.scss']
})
export class ReviewComplaintNotificationPopupComponent extends NotificationPopupComponent {
  private formOpen!: boolean;

  // ====================================================================( NG ON INIT )===================================================================== \\

  ngOnInit() {
    super.ngOnInit();
    this.getNotification<ReviewComplaintNotification>('api/Notifications/GetReviewComplaintNotification', [{ key: 'notificationGroupId', value: this.notificationItem.notificationGroupId }]);

    this.onNotificationLoad.subscribe(() => {
      if (this.notification.employeeNotes.length == 0) this.notification.employeeNotes.push(new NotificationEmployee());
    });
  }



  // =============================================================( GET CONTEXT MENU OPTIONS )============================================================== \\

  getContextMenuOptions(): Array<MenuOption> {
    return [
      {
        type: MenuOptionType.MenuItem,
        name: this.notificationItem.isNew ? 'Close (Remain as New)' : 'Restore as New',
        optionFunction: () => {
          this.notificationItem.isNew ? this.onEscape() : this.onClose(this.notification.employeeNotes, true);
        }
      },
      {
        type: MenuOptionType.Divider,
        hidden: this.notificationItem.isNew ? true : false
      },
      {
        type: MenuOptionType.MenuItem,
        name: 'Delete',
        hidden: this.notificationItem.isNew ? true : false,
        optionFunction: () => {
          this.openDeletePrompt();
        }
      }
    ];
  }



  // ================================================================( SAVE EMPLOYEE TEXT )================================================================= \\

  saveEmployeeText() {
    this.employeeTextParameters = {
      notificationGroupId: this.notificationItem.notificationGroupId,
      notificationId: this.notificationItem.id,
      note: this.notification.employeeNotes[this.notification.employeeNotes.length - 1].text.trim()
    }
    super.saveEmployeeText();
  }



  openRemoveReviewComplaintForm() {
    this.lazyLoadingService.load(async () => {
      const { RemoveRestoreReviewFormComponent } = await import('../remove-restore-review-form/remove-restore-review-form.component');
      const { RemoveRestoreReviewFormModule } = await import('../remove-restore-review-form/remove-restore-review-form.module');
      return {
        component: RemoveRestoreReviewFormComponent,
        module: RemoveRestoreReviewFormModule
      }
    }, SpinnerAction.None).then((RemoveRestoreReviewForm: RemoveRestoreReviewFormComponent) => {
      this.formOpen = true;
      RemoveRestoreReviewForm.notification = this.notification;
      RemoveRestoreReviewForm.newNoteAdded = this.newNoteAdded;
      RemoveRestoreReviewForm.employeeNotes = this.isEmployeeNotesWritten(this.notification.employeeNotes, this.newNoteAdded) ? this.notification.employeeNotes[this.notification.employeeNotes.length - 1].text : '';

      // Callback
      RemoveRestoreReviewForm.callback = (addStrike: boolean, employeeNotes: string, newNoteAdded: boolean) => {

        // If the notification resides in the new list
        if (this.notificationItem.isNew) {
          // Update the count for the notification bell
          this.notificationService.notificationCount -= this.notification.users.length;
          // Remove the notification from the new list
          this.notificationService.removeNotification(this.notificationService.newNotifications, this.notificationItem, this);

          // If the notification resides in the archive list
        } else {

          // Just close this popup
          this.close();
        }

        // Remove/restore the review
        this.dataService.put<boolean>('api/Notifications/RemoveRestoreReview', {
          userId: this.notification.reviewWriter.userId,
          reviewId: this.notification.reviewId,
          addStrike: addStrike,
          IsNew: this.notificationItem.isNew,
          NotificationGroupId: this.notificationItem.notificationGroupId
        }, {
          authorization: true
        }).subscribe();


        // If the notification resides in the new list
        if (this.notificationItem.isNew) {
          // Add the notification to the archive list
          this.notificationService.addToList(this.notificationService.archiveNotifications, this.notification.users.length, this.notificationItem);
        }


        // Wait one second to allow this popup to close before the notes from the (Remove/Restore Review) form get assigned.
        // This prevents the notes from being seen appearing into the notes section as popup closes
        window.setTimeout(() => {
          this.notification.employeeNotes[this.notification.employeeNotes.length - 1].text = employeeNotes;

          // Save the notes (if any)
          if (this.isEmployeeNotesWritten(this.notification.employeeNotes, newNoteAdded)) {
            this.saveEmployeeText();
          }
        }, 1000)
      }

      const RemoveReviewComplaintFormCloseListener = RemoveRestoreReviewForm.onClose.subscribe(() => {
        RemoveReviewComplaintFormCloseListener.unsubscribe();
        this.formOpen = false;
      })
    })
  }



  // =====================================================================( ON ESCAPE )===================================================================== \\

  onEscape(): void {
    if (!this.contextMenu && this.profilePopupContainer.length == 0 && this.reviewProfilePopupContainer.length == 0 && !this.undoChangesPrompt && !this.formOpen && !this.deletePrompt) {
      if (!this.isEmployeeNotesWritten(this.notification.employeeNotes, this.newNoteAdded)) {
        this.close();
      } else {
        this.openUndoChangesPrompt();
      }
    }
  }



  // =====================================================================( ON CLOSE )====================================================================== \\

  onClose(employees: Array<NotificationEmployee>, restore?: boolean): void {
    super.onClose(employees, restore);
  }
}