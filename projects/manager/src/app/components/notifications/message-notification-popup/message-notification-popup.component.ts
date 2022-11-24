import { Component } from '@angular/core';
import { MenuOptionType } from '../../../classes/enums';
import { NotificationItem } from '../../../classes/notifications/notification-item';
import { NotificationPopupComponent } from '../notification-popup/notification-popup.component';
import { MenuOption } from '../../../classes/menu-option';
import { NotificationEmployee } from '../../../classes/notifications/notification-employee';
import { MessageNotification } from '../../../classes/notifications/message-notification';

@Component({
  templateUrl: './message-notification-popup.component.html',
  styleUrls: ['../notification-form/notification-form.component.scss', './message-notification-popup.component.scss']
})
export class MessageNotificationPopupComponent extends NotificationPopupComponent {
  private deleteAll!: boolean;
  public sendButtonDisabled: boolean = true;


  // ====================================================================( NG ON INIT )===================================================================== \\

  ngOnInit() {
    super.ngOnInit();
    this.getNotification<Array<MessageNotification>>('api/Notifications/GetMessageNotification',
      [
        {
          key: 'notificationGroupId',
          value: this.notificationItem.notificationGroupId
        },
        {
          key: 'isNew',
          value: this.notificationItem.isNew
        }
      ]);
    this.onNotificationLoad.subscribe(() => {
      (this.notification as Array<MessageNotification>).forEach(x => {
        if (x.employeeMessage == null) x.employeeMessage = new NotificationEmployee();
      })
    });
  }



  // =============================================================( GET CONTEXT MENU OPTIONS )============================================================== \\

  getContextMenuOptions(): Array<MenuOption> {
    return [
      {
        type: MenuOptionType.MenuItem,
        name: this.notificationItem.isNew ? 'Archive All Messages' : 'Restore as New',
        hidden: this.notificationItem.isNew && this.notificationItem.count == 1,
        optionFunction: () => {
          this.notificationItem.isNew ?

            // Archive All
            this.transfer(this.notificationService.newNotifications, null!, this.notificationService.archiveNotifications, this.notificationItem.count,
              {
                archiveAllMessagesInGroup: true,
                notificationGroupId: this.notificationItem.notificationGroupId
              })

            :

            // Restore
            this.transfer(this.notificationService.archiveNotifications, this.notificationItem.count, this.notificationService.newNotifications, 1,
              {
                restore: true,
                notificationId: this.notification[this.userIndex].notificationId,
                notificationGroupId: this.notificationItem.notificationGroupId
              })
        }
      },
      {
        type: MenuOptionType.MenuItem,
        name: 'Close (Remain as New)',
        hidden: !this.notificationItem.isNew,
        optionFunction: () => {
          this.onEscape();
        }
      },
      {
        type: MenuOptionType.MenuItem,
        name: 'Restore All Messages as New',
        hidden: this.notificationItem.isNew || (!this.notificationItem.isNew && this.notificationItem.count == 1),
        optionFunction: () => {

          // Restore All
          this.transfer(this.notificationService.archiveNotifications, null!, this.notificationService.newNotifications, this.notificationItem.count,
            {
              restore: true,
              restoreAllMessagesInGroup: true,
              notificationGroupId: this.notificationItem.notificationGroupId
            })
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
          this.openDeletePrompt(false);
        }
      },
      {
        type: MenuOptionType.MenuItem,
        name: 'Delete All Messages',
        hidden: this.notificationItem.isNew || (!this.notificationItem.isNew && this.notificationItem.count == 1),
        optionFunction: () => {
          this.openDeletePrompt(true);
        }
      }
    ];
  }



  // ===========================================================( IS EMPLOYEE MESSAGE WRITTEN  )============================================================ \\

  isEmployeeMessageWritten(): boolean {
    let isWritten: boolean = false;

    for (let i = 0; i < this.notification.length; i++) {
      // If a new reply has been written in any of the messages and they're not just empty spaces
      if (!this.notification[i].employeeMessage.date &&
        this.notification[i].employeeMessage.text != null &&
        this.notification[i].employeeMessage.text.trim().length > 0) {
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
      note: this.notification[this.userIndex].employeeMessage.text.trim()
    }
    super.saveEmployeeText();
  }



  // =============================================================( SET SEND BUTTON DISABLED )============================================================== \\

  setSendButtonDisabled() {
    // If a new reply has been written in this current message and it's not just empty spaces
    if (!this.notification[this.userIndex].employeeMessage.date &&
      this.notification[this.userIndex].employeeMessage.text != null &&
      this.notification[this.userIndex].employeeMessage.text.trim().length > 0) {
      // Enable the send button
      this.sendButtonDisabled = false;

      // Otherwise
    } else {

      // Disable the send button
      this.sendButtonDisabled = true;
    }
  }



  // ======================================================================( ARCHIVE )====================================================================== \\

  archive() {
    this.transfer(this.notificationService.newNotifications, this.notificationItem.count, this.notificationService.archiveNotifications, 1, {
      notificationId: this.notification[this.userIndex].notificationId,
      notificationGroupId: this.notificationItem.notificationGroupId
    });
  }



  // ==================================================================( REMOVE MESSAGE )=================================================================== \\

  removeMessage() {
    // Minus the count for the notification's red circle by one
    this.notificationItem.count -= 1;
    // And then remove the current message from the popup
    this.notification.splice(this.userIndex, 1);
    // Set the counter so that the first message is being displayed (if not already)
    this.userIndex = 0;
    // Disable the send button
    this.setSendButtonDisabled();
  }



  // =================================================================( REMOVE FROM LIST )================================================================== \\

  removeFromList(notifications: Array<NotificationItem>, messageCount?: number) {
    // If we're removing just a message (NOT a notification item)
    //  And there is more than just one message in the message notification
    if (messageCount != null && messageCount > 1) {
      this.removeMessage();

      // But if we're removing just a message (NOT a notification item)
      // And there is only one message in the message notification
      // OR
      // If we ARE removing a notification item
    } else {
      this.notificationService.removeNotification(notifications, this.notificationItem, this);
    }
  }



  // ======================================================================( TRANSFER )===================================================================== \\

  transfer(originList: Array<NotificationItem>, originMessageCount: number, destinationList: Array<NotificationItem>, destinationMessageCount: number, dataServiceParameters: {}) {
    this.removeFromList(originList, originMessageCount);
    this.notificationService.addToList(destinationList, destinationMessageCount, this.notificationItem);

    // Update the count for the notification bell
    this.notificationService.notificationCount += (destinationList == this.notificationService.archiveNotifications ? -destinationMessageCount : destinationMessageCount);
    // Update database
    this.dataService.put('api/Notifications/Archive', dataServiceParameters, {
      authorization: true
    }).subscribe();
  }



  // ================================================================( OPEN DELETE PROMPT )================================================================= \\

  openDeletePrompt(deleteAll?: boolean) {
    this.deleteAll = deleteAll!;
    this.deletePromptTitle = !deleteAll ? 'Delete Message' : 'Delete Messages';
    this.deletePromptMessage = this.sanitizer.bypassSecurityTrustHtml(
      (!deleteAll ? (this.notificationItem.count > 1 ? 'This' : 'The') + ' message' : 'All messages') +
      ' from,' +
      ' <span style="color: #ffba00">\"' + this.notificationItem.name + '\"</span>' +
      ' will be permanently deleted.');

    super.openDeletePrompt();
  }



  // =====================================================================( ON DELETE )===================================================================== \\

  onDelete() {
    if (!this.deleteAll) {

      this.delete(
        {
          notificationGroupId: this.notificationItem.notificationGroupId,
          notificationIds: [this.notification[this.userIndex].notificationId]
        }, this.notificationItem.count);

    } else {


      let notificationIds = new Array<number>();
      (this.notification as Array<MessageNotification>).forEach(x => {
        notificationIds.push(x.notificationId)
      });

      this.delete(
        {
          notificationGroupId: this.notificationItem.notificationGroupId,
          notificationIds: notificationIds
        }
      );
    }
  }



  // =======================================================================( DELETE )====================================================================== \\

  delete(dataServiceParameters: {}, messageCount?: number) {
    this.removeFromList(this.notificationService.archiveNotifications, messageCount);
    this.dataService.delete('api/Notifications', dataServiceParameters).subscribe();
  }



  // =====================================================================( ON ESCAPE )===================================================================== \\

  onEscape(): void {
    if (!this.contextMenu && this.profilePopupContainer.length == 0 && !this.undoChangesPrompt && !this.deletePrompt) {
      if (!this.isEmployeeMessageWritten()) {
        this.close();
      } else {
        this.openUndoChangesPrompt();
      }
    }
  }
}