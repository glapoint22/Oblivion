import { Component } from '@angular/core';
import { MenuOptionType } from '../../../classes/enums';
import { MenuOption } from '../../../classes/menu-option';
import { NotificationEmployee } from '../../../classes/notification-employee';
import { NotificationUserAccount } from '../../../classes/notification-user-account';
import { NotificationPopupComponent } from '../notification-popup/notification-popup.component';

@Component({
  templateUrl: './user-account-notification-popup.component.html',
  styleUrls: ['../notification-popup/notification-popup.component.scss', './user-account-notification-popup.component.scss']
})
export class UserAccountNotificationPopupComponent extends NotificationPopupComponent {
  public newNotesAdded: Array<boolean> = new Array<boolean>();
  public isUserName!: boolean;


  // ====================================================================( NG ON INIT )===================================================================== \\

  ngOnInit(): void {
    super.ngOnInit();

    this.onNotificationLoad.subscribe(() => {
      if (this.notification[this.userIndex].employeeNotes.length == 0) this.notification[this.userIndex].employeeNotes.push(new NotificationEmployee());
    });
    this.getNotification<Array<NotificationUserAccount>>('api/Notifications/' + (this.isUserName ? 'UserName' : 'UserImage'), [{ key: 'notificationGroupId', value: this.notificationItem.notificationGroupId }, { key: 'isNew', value: this.notificationItem.isNew }]);
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




  // ===========================================================( OPEN SECONDARY BUTTON PROMPT )============================================================ \\

  openSecondaryButtonPrompt() {
    this.secondaryButtonPromptPrimaryButtonName = 'Remove';
    this.secondaryButtonPromptTitle = 'Remove ' + this.isUserName ? 'User Name' : 'Profile Image';
    this.secondaryButtonPromptMessage = this.sanitizer.bypassSecurityTrustHtml(
      (this.isUserName ? 'The name,' : 'The profile image for the user,') +
      ' <span style="color: #ffba00">\"' + this.notification[0].firstName + ' ' + this.notification[0].lastName + '\"</span>' +
      (this.isUserName ? ' will be removed from this user. ' : ' will be removed. ') + 'Also, a strike will be added against them for not complying with the terms of use.');
    super.openSecondaryButtonPrompt();
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

    // Add a non-compliant strike
    this.dataService.put<boolean>('api/Notifications/AddNoncompliantStrike', {
      userId: this.notification[this.userIndex].userId,
      userName: this.isUserName ? this.notification[this.userIndex].userName : null,
      userImage: !this.isUserName ? this.notification[this.userIndex].userImage: null
    }).subscribe((removalSuccessful: boolean)=> {
      if(removalSuccessful) {
        this.notificationService.addToList(this.notificationService.archiveNotifications, 1, this.notificationItem);
      }
    });
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