import { Component } from '@angular/core';
import { MenuOptionType } from '../../../classes/enums';
import { MenuOption } from '../../../classes/menu-option';
import { NotificationEmployee } from '../../../classes/notification-employee';
import { NotificationItem } from '../../../classes/notification-item';
import { NotificationUserImage } from '../../../classes/notification-user-image';
import { NotificationPopupComponent } from '../notification-popup/notification-popup.component';

@Component({
  templateUrl: './user-image-notification-popup.component.html',
  styleUrls: ['../notification-popup/notification-popup.component.scss', './user-image-notification-popup.component.scss']
})
export class UserImageNotificationPopupComponent extends NotificationPopupComponent {
  ngOnInit(): void {
    super.ngOnInit();
    this.getNotification<Array<NotificationUserImage>>('api/Notifications/UserImage', [{ key: 'notificationGroupId', value: this.notificationItem.notificationGroupId }, { key: 'isNew', value: this.notificationItem.isNew }]);
  }



  // =============================================================( GET CONTEXT MENU OPTIONS )============================================================== \\

  getContextMenuOptions(): Array<MenuOption> {
    return [
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
    this.newNoteAdded = true;
    employees.push(new NotificationEmployee());
    this.notification[this.userIndex].employeeIndex = employees.length - 1;
    window.setTimeout(() => {
      this.notes.nativeElement.focus();
    })
  }





  // ================================================================( SAVE EMPLOYEE TEXT )================================================================= \\

  saveEmployeeText() {
    this.employeeTextParameters = {
      notificationGroupId: this.notificationItem.notificationGroupId,
      notificationId: this.notification[this.userIndex].notificationId,
      note: this.firstNote != null ? this.firstNote.trim() : this.notification[this.userIndex].employeeNotes[this.notification[this.userIndex].employeeNotes.length - 1].text.trim()
    }
    super.saveEmployeeText();
  }



  // ============================================================( OPEN DISABLE BUTTON PROMPT )============================================================= \\

  openSecondaryButtonPrompt() {
    this.secondaryButtonPromptPrimaryButtonName = 'Remove';
    this.secondaryButtonPromptTitle = 'Remove User Image';
    this.secondaryButtonPromptMessage = this.sanitizer.bypassSecurityTrustHtml(
      'The profile image for the user,' +
      ' <span style="color: #ffba00">\"' + this.notification[0].firstName + ' ' + this.notification[0].lastName + '\"</span>' +
      ' will be removed.');

    super.openSecondaryButtonPrompt();
  }



  // =========================================================( SECONDARY BUTTON PROMPT FUNCTION )========================================================== \\

  secondaryButtonPromptFunction() {
    // If notes were written
    if (this.areNotesWritten()) {
      // Then save the new note
      this.saveEmployeeText();
    }

    this.archive({
      notificationGroupId: this.notificationItem.notificationGroupId,
      notificationId: this.notification[this.userIndex].notificationId
    })
  }



  // =================================================================( IS NOTE WRITTEN )=================================================================== \\

  areNotesWritten(): boolean {
    // If notes were never written yet on this form and now
    // for the first time notes are finally being written
    return (this.firstNote != null &&
      // and the text area actually has text written in it
      // and not just empty spaces
      this.firstNote.trim().length > 0) ||

      // Or if notes had already been previously written and the (Add Note) button was pressed
      (this.newNoteAdded &&

        // and the text area actually has text written in it
        this.notification[this.userIndex].employeeNotes[this.notification[this.userIndex].employeeNotes.length - 1].text != null &&
        // and not just empty spaces
        this.notification[this.userIndex].employeeNotes[this.notification[this.userIndex].employeeNotes.length - 1].text.trim().length > 0)
  }




  // ====================================================================( ADD TO LIST )==================================================================== \\

  addToList(notifications: Array<NotificationItem>, messageCount: number) {
    // See if the sender of this message already has a message notification in the list
    const notificationItemIndex = notifications.findIndex(x => x.notificationGroupId == this.notificationItem.notificationGroupId);

    // If so
    if (notificationItemIndex != -1) {
      // Make a copy of that message notification that's in the list
      const notificationItemCopy = notifications[notificationItemIndex];
      // Update the count for that message notification's red circle
      notificationItemCopy.count += messageCount;

      // Then remove that message notification from the list and then put it back up at the top of the list
      notifications.splice(notificationItemIndex, 1);
      notifications.unshift(notificationItemCopy);

      // If the sender of this message does NOT have a message in the list
    } else {

      // Create a new message notification and put it at the top of the list
      notifications.unshift(this.createNewNotificationItem(false, messageCount));
    }
  }



  // ===========================================================( CREATE NEW NOTIFICATION ITEM )============================================================ \\

  createNewNotificationItem(isNew: boolean, messageCount: number): NotificationItem {
    const newNotificationItem = new NotificationItem();
    newNotificationItem.isNew = isNew;
    newNotificationItem.id = this.notificationItem.id;
    newNotificationItem.notificationType = this.notificationItem.notificationType;
    newNotificationItem.notificationGroupId = this.notificationItem.notificationGroupId;
    newNotificationItem.image = this.notificationItem.image;
    newNotificationItem.creationDate = this.notificationItem.creationDate;
    newNotificationItem.name = this.notificationItem.name;
    newNotificationItem.productName = this.notificationItem.productName;
    newNotificationItem.count = messageCount;
    return newNotificationItem;
  }






  removeNotification(notifications: Array<NotificationItem>) {
    const notificationItemIndex = notifications.findIndex(x => x.notificationGroupId == this.notificationItem.notificationGroupId);
    notifications.splice(notificationItemIndex, 1);
    this.close();
  }



  archive(dataServiceParameters: {}) {
    this.removeNotification(this.notificationService.newNotifications);
    this.addToList(this.notificationService.archiveNotifications, 1);

    // Update the count for the notification bell
    this.notificationService.notificationCount -= 1;


    // Update database
    this.dataService.put('api/Notifications/Archive', dataServiceParameters).subscribe();
  }









  onPrimaryButtonClick() {
    if (this.notificationItem.isNew) {
      this.removeNotification(this.notificationService.newNotifications);

      // Update the count for the notification bell
      this.notificationService.notificationCount -= 1;


      // this.dataService.delete('api/Notifications', {
      //   notificationGroupId: this.notification.length == 1 ? this.notificationItem.notificationGroupId : 0,
      //   notificationId: this.notification[this.userIndex].notificationId
      // }).subscribe();




    } else {

      // If notes were written
      if (this.areNotesWritten()) {
        // Then save the new note
        this.saveEmployeeText();
      }
      this.close();
    }

  }





  // =====================================================================( ON DELETE )===================================================================== \\

  onDelete() {
    let notificationIds = new Array<number>();
    (this.notification as Array<NotificationUserImage>).forEach(x => {
      notificationIds.push(x.notificationId)
    });


    this.delete(
      {
        notificationGroupId: this.notificationItem.notificationGroupId,
        notificationIds: notificationIds
      }
    );
  }



  // =======================================================================( DELETE )====================================================================== \\

  delete(dataServiceParameters: {}) {
    this.removeNotification(this.notificationService.archiveNotifications);

    // Update database
    this.dataService.delete('api/Notifications', dataServiceParameters).subscribe();
  }

}