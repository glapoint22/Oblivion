import { Component } from '@angular/core';
import { NotificationReview } from '../../../classes/notification-review';
import { MenuOptionType } from '../../../classes/enums';
import { MenuOption } from '../../../classes/menu-option';
import { NotificationProfile } from '../../../classes/notification-profile';
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
    this.employeeTextPath = 'api/Notifications/PostNote';
    this.employeeTextParameters = {
      notificationGroupId: this.notificationItem.notificationGroupId,
      note: this.firstNote != null ? this.firstNote.trim() : this.notification.employees[this.notification.employees.length - 1].text.trim()
    }
    super.saveEmployeeText();
  }



  // ============================================================( OPEN DISABLE BUTTON PROMPT )============================================================= \\

  openDisableButtonPrompt() {
    this.disableButtonPromptPrimaryButtonName = !this.notification.reviewDeleted ? 'Remove' : 'Restore';
    this.disableButtonPromptTitle = (!this.notification.reviewDeleted ? 'Remove' : 'Restore') + ' Review';
    this.disableButtonPromptMessage = this.sanitizer.bypassSecurityTrustHtml(
      'The review with the title,' +
      ' <span style="color: #ffba00">\"' + this.notification.reviewWriter.reviewTitle + '\"</span>' +
      ' will be ' + (!this.notification.reviewDeleted ? 'removed' : 'restored') + '.');

    super.openDisableButtonPrompt();
  }



  // =====================================================================( ON ESCAPE )===================================================================== \\

  onEscape(): void {
    if (!this.contextMenu && this.profilePopupContainer.length == 0 && this.reviewProfilePopupContainer.length == 0 && !this.undoChangesPrompt && !this.disableButtonPrompt && !this.deletePrompt) {
      if (!this.isNoteWritten(this.notification.employees) && !this.secondaryButtonDisabled) {
        this.close();
      } else {
        this.openUndoChangesPrompt();
      }
    }
  }



  // =====================================================================( ON CLOSE )====================================================================== \\

  onClose(employees: Array<NotificationProfile>, restore?: boolean): void {
    this.secondaryButtonDisabledPath = 'api/Notifications/RemoveReview';
    this.secondaryButtonDisabledParameters = { reviewId: this.notification.reviewId }
    super.onClose(employees, restore);
  }  
}