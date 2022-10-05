import { Component } from '@angular/core';
import { NotificationReview } from '../../../classes/notification-review';
import { MenuOptionType } from '../../../classes/enums';
import { MenuOption } from '../../../classes/menu-option';
import { NotificationEmployee } from '../../../classes/notification-employee';
import { NotificationPopupComponent } from '../notification-popup/notification-popup.component';

@Component({
  templateUrl: './review-notification-popup.component.html',
  styleUrls: ['../notification-popup/notification-popup.component.scss', '../product-notification-popup/product-notification-popup.component.scss', './review-notification-popup.component.scss']
})
export class ReviewNotificationPopupComponent extends NotificationPopupComponent {


  // ====================================================================( NG ON INIT )===================================================================== \\

  ngOnInit() {
    super.ngOnInit();
    this.getNotification<NotificationReview>('api/Notifications/Review', [{ key: 'notificationGroupId', value: this.notificationItem.notificationGroupId }]);

    this.onNotificationLoad.subscribe(() => {
      if (this.notification.employees.length == 0) this.notification.employees.push(new NotificationEmployee());
    });
  }



  // =============================================================( GET CONTEXT MENU OPTIONS )============================================================== \\

  getContextMenuOptions(): Array<MenuOption> {
    return [
      {
        type: MenuOptionType.MenuItem,
        name: this.notificationItem.isNew ? 'Close (Remain as New)' : 'Restore as New',
        optionFunction: () => {
          this.notificationItem.isNew ? this.onEscape() : this.onClose(this.notification.employees, true);
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
      note: this.notification.employees[this.notification.employees.length - 1].text.trim()
    }
    super.saveEmployeeText();
  }



  // ===========================================================( OPEN SECONDARY BUTTON PROMPT )============================================================ \\

  openSecondaryButtonPrompt() {
    this.secondaryButtonPromptPrimaryButtonName = !this.notification.reviewDeleted ? 'Remove' : 'Restore';
    this.secondaryButtonPromptTitle = (!this.notification.reviewDeleted ? 'Remove' : 'Restore') + ' Review';
    this.secondaryButtonPromptMessage = this.sanitizer.bypassSecurityTrustHtml(
      'The review with the title,' +
      ' <span style="color: #ffba00">\"' + this.notification.reviewWriter.reviewTitle + '\"</span>' +
      ' will be ' + (!this.notification.reviewDeleted ? 'removed' : 'restored') + '.');

    super.openSecondaryButtonPrompt();
  }



  // =====================================================================( ON ESCAPE )===================================================================== \\

  onEscape(): void {
    if (!this.contextMenu && this.profilePopupContainer.length == 0 && this.reviewProfilePopupContainer.length == 0 && !this.undoChangesPrompt && !this.secondaryButtonPrompt && !this.deletePrompt) {
      if (!this.isEmployeeNotesWritten(this.notification.employees, this.newNoteAdded) && !this.secondaryButtonDisabled) {
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