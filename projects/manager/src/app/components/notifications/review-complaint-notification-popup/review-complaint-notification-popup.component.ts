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
    }, SpinnerAction.None).then((RemoveReviewComplaintForm: RemoveRestoreReviewFormComponent) => {
      this.formOpen = true;
      RemoveReviewComplaintForm.notification = this.notification;
      RemoveReviewComplaintForm.callback = (addStrike: boolean) => {

        // Save the notes (if any)
        if (this.isEmployeeNotesWritten(this.notification.employeeNotes, this.newNoteAdded)) {
          this.saveEmployeeText();
        }

        // Update the count for the notification bell
        this.notificationService.notificationCount -= 1;


        this.notificationService.removeNotification(this.notificationService.newNotifications, this.notificationItem, this);

        // Add the noncompliant strike
        this.dataService.put<boolean>('api/Notifications/AddNoncompliantStrikeReview', {
          userId: this.notification.reviewWriter.userId,
          reviewId: this.notification.reviewId,
          addStrike: addStrike
        }, {
          authorization: true
        }).subscribe((removalSuccessful: boolean) => {
          if (removalSuccessful) {
            // Archive the notification
            this.dataService.put('api/Notifications/Archive', {
              notificationGroupId: this.notificationItem.notificationGroupId,
              notificationId: this.notificationItem.id
            }, {
              authorization: true
            }).subscribe();
            this.notificationService.addToList(this.notificationService.archiveNotifications, 1, this.notificationItem);
          }
        });





      }

      const RemoveReviewComplaintFormCloseListener = RemoveReviewComplaintForm.onClose.subscribe(() => {
        RemoveReviewComplaintFormCloseListener.unsubscribe();
        this.formOpen = false;
      })
    })
  }



  // =====================================================================( ON ESCAPE )===================================================================== \\

  onEscape(): void {
    if (!this.contextMenu && this.profilePopupContainer.length == 0 && this.reviewProfilePopupContainer.length == 0 && !this.undoChangesPrompt && !this.formOpen && !this.deletePrompt) {
      if (!this.isEmployeeNotesWritten(this.notification.employeeNotes, this.newNoteAdded) && !this.secondaryButtonDisabled) {
        this.close();
      } else {
        this.openUndoChangesPrompt();
      }
    }
  }



  // =====================================================================( ON CLOSE )====================================================================== \\

  onClose(employees: Array<NotificationEmployee>, restore?: boolean): void {
    this.secondaryButtonDisabledPath = 'api/Notifications/RemoveReview';
    this.secondaryButtonDisabledParameters = { reviewId: this.notification.reviewId }
    super.onClose(employees, restore);
  }
}