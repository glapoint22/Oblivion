import { Component } from '@angular/core';
import { MenuOptionType } from '../../../classes/enums';
import { MenuOption } from '../../../classes/menu-option';
import { NotificationEmployee } from '../../../classes/notification-employee';
import { NotificationUserAccount } from '../../../classes/notification-user-account';
import { NotificationPopupComponent } from '../notification-popup/notification-popup.component';

@Component({
  templateUrl: './user-account-notification.component.html',
  styleUrls: ['./user-account-notification.component.scss']
})
export class UserAccountNotificationComponent extends NotificationPopupComponent {
  public newNotesAdded: Array<boolean> = new Array<boolean>();
  

  // ====================================================================( NG ON INIT )===================================================================== \\

  ngOnInit(): void {
    super.ngOnInit();

    this.onNotificationLoad.subscribe(() => {
      if (this.notification[this.userIndex].employeeNotes.length == 0) this.notification[this.userIndex].employeeNotes.push(new NotificationEmployee());
    });
  }



  // =============================================================( GET CONTEXT MENU OPTIONS )============================================================== \\

  getContextMenuOptions(): Array<MenuOption> {
    return [
      {
        type: MenuOptionType.MenuItem,
        name: 'Close (Remain as New)',
        hidden: this.notificationItem.isNew ? false : true,
        optionFunction: () => {
          this.onEscape();
        }
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



  // =====================================================================( ADD NOTE )====================================================================== \\

  addNote(employees: Array<NotificationEmployee>) {
    this.newNotesAdded[this.userIndex] = true;
    employees.push(new NotificationEmployee());
    this.notification[this.userIndex].employeeIndex = employees.length - 1;
    window.setTimeout(() => {
      this.notes.nativeElement.focus();
    })
  }



  // ==========================================================( ARE ANY EMPLOYEE NOTES WRITTEN )=========================================================== \\

  areAnyEmployeeNotesWritten() {
    let isWritten: boolean = false;

    for (let i = 0; i < this.notification.length; i++) {
      // If a new reply has been written in any of the messages and they're not just empty spaces
      if (this.isEmployeeNotesWritten(this.notification[i].employeeNotes, this.newNotesAdded[i])) {
        isWritten = true;
        break;
      }
    }
    return isWritten
  }



  // ================================================================( SAVE EMPLOYEE TEXT )================================================================= \\
  
  saveEmployeeText() {
    this.employeeTextParameters = {
      notificationGroupId: this.notificationItem.notificationGroupId,
      notificationId: this.notification[this.userIndex].notificationId,
      note: this.notification[this.userIndex].employeeNotes[this.notification[this.userIndex].employeeNotes.length - 1].text.trim()
    }
    super.saveEmployeeText();
  }



  // ==============================================================( ON PRIMARY BUTTON CLICK )============================================================== \\

  onPrimaryButtonClick() {
    if (this.notificationItem.isNew) {
      this.onDelete();
      // Update the count for the notification bell
      this.notificationService.notificationCount -= 1;

    } else {

      // If notes were written
      if (this.areAnyEmployeeNotesWritten()) {
        // Then save the new note
        this.saveEmployeeText();
      }
      this.close();
    }
  }



  // =========================================================( SECONDARY BUTTON PROMPT FUNCTION )========================================================== \\

  secondaryButtonPromptFunction() {
    // If any notes were written
    if (this.areAnyEmployeeNotesWritten()) {
      // Then save the new note
      this.saveEmployeeText();
    }
    // Update the count for the notification bell
    this.notificationService.notificationCount -= 1;

    // Update the database
    this.dataService.put('api/Notifications/Archive', {
      notificationGroupId: this.notificationItem.notificationGroupId,
      notificationId: this.notification[this.userIndex].notificationId
    }).subscribe();

    // Update the lists
    this.notificationService.removeNotification(this.notificationService.newNotifications, this.notificationItem, this);
  }



  // =====================================================================( ON DELETE )===================================================================== \\

  onDelete() {
    this.notificationService.removeNotification(this.notificationItem.isNew ? this.notificationService.newNotifications : this.notificationService.archiveNotifications, this.notificationItem, this);

    let notificationIds = new Array<number>();
    (this.notification as Array<NotificationUserAccount>).forEach(x => {
      notificationIds.push(x.notificationId)
    });


    // Update database
    this.dataService.delete('api/Notifications', {
      notificationGroupId: this.notificationItem.notificationGroupId,
      notificationIds: notificationIds
    }).subscribe();
  }



  // =====================================================================( ON ESCAPE )===================================================================== \\

  onEscape(): void {
    if (!this.contextMenu && this.profilePopupContainer.length == 0 && !this.undoChangesPrompt && !this.secondaryButtonPrompt && !this.deletePrompt) {
      if (!this.areAnyEmployeeNotesWritten()) {
        this.close();
      } else {
        this.openUndoChangesPrompt();
      }
    }
  }
}