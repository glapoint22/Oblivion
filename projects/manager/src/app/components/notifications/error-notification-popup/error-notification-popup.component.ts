import { Component } from '@angular/core';
import { MenuOptionType } from '../../../classes/enums';
import { MenuOption } from '../../../classes/menu-option';
import { ErrorDetails } from '../../../classes/notifications/error-details';
import { ErrorNotification } from '../../../classes/notifications/error-notification';
import { NotificationEmployee } from '../../../classes/notifications/notification-employee';
import { NotificationPopupComponent } from '../notification-popup/notification-popup.component';

@Component({
  templateUrl: './error-notification-popup.component.html',
  styleUrls: ['../notification-form/notification-form.component.scss', './error-notification-popup.component.scss']
})
export class ErrorNotificationPopupComponent extends NotificationPopupComponent {
  public errorDetails!: ErrorDetails;


  // ====================================================================( NG ON INIT )===================================================================== \\

  ngOnInit() {
    super.ngOnInit();
    this.getNotification<ErrorNotification>('api/Notifications/Error', [{ key: 'notificationGroupId', value: this.notificationItem.notificationGroupId }]);

    this.onNotificationLoad.subscribe(() => {
      if (this.notification.employeeNotes.length == 0) this.notification.employeeNotes.push(new NotificationEmployee());
      this.errorDetails = JSON.parse(this.notification.text);
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



  // =====================================================================( ON ESCAPE )===================================================================== \\

  onEscape(): void {
    if (!this.contextMenu && !this.undoChangesPrompt && !this.deletePrompt) {
      if (!this.isEmployeeNotesWritten(this.notification.employeeNotes, this.newNoteAdded)) {
        this.close();
      } else {
        this.openUndoChangesPrompt();
      }
    }
  }





}