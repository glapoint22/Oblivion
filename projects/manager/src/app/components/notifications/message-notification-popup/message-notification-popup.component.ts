import { Component } from '@angular/core';
import { MenuOptionType } from '../../../classes/enums';
import { NotificationItem } from '../../../classes/notification-item';
import { NotificationMessage } from '../../../classes/notification-message';
import { NotificationPopupComponent } from '../notification-popup/notification-popup.component';
import { MenuOption } from '../../../classes/menu-option';

@Component({
  templateUrl: './message-notification-popup.component.html',
  styleUrls: ['./message-notification-popup.component.scss']
})
export class MessageNotificationPopupComponent extends NotificationPopupComponent {
  private deleteAll!: boolean;
  public sendButtonDisabled: boolean = true;


  ngOnInit() {
    super.ngOnInit();
    this.getNotification<Array<NotificationMessage>>('api/Notifications/Message', [{ key: 'notificationGroupId', value: this.notificationItem.notificationGroupId }, { key: 'isNew', value: this.notificationItem.isNew }]);
  }


 

  getContextMenuOptions(): Array<MenuOption> {
    return [
      {
        type: MenuOptionType.MenuItem,
        name: this.notificationItem.isNew ? 'Archive All Messages' : 'Restore as New',
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
                notificationId: this.notification[this.counterIndex].notificationId,
                notificationGroupId: this.notificationItem.notificationGroupId
              })
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







  







  setSendButtonDisabled() {
    // If a new reply has been written in this current message and it's not just empty spaces
    if (!this.notification[this.counterIndex].employeeMessageDate &&
      this.notification[this.counterIndex].employeeMessage != null &&
      this.notification[this.counterIndex].employeeMessage.trim().length > 0) {
      // Enable the send button
      this.sendButtonDisabled = false;

      // Otherwise
    } else {

      // Disable the send button
      this.sendButtonDisabled = true;
    }
  }







  sendEmployeeText() {
    this.employeeTextPath = 'api/Notifications/PostMessage';
    this.employeeTextParameters = {
      notificationId: this.notification[this.counterIndex].notificationId,
      message: this.notification[this.counterIndex].employeeMessage.trim()
    }
    super.sendEmployeeText();
  }









  archive() {
    this.transfer(this.notificationService.newNotifications, this.notificationItem.count, this.notificationService.archiveNotifications, 1, {
      notificationId: this.notification[this.counterIndex].notificationId,
      notificationGroupId: this.notificationItem.notificationGroupId
    });
  }



  removeMessage() {
    // Minus the count for the notification's red circle by one
    this.notificationItem.count -= 1;
    // And then remove the current message from the popup
    this.notification.splice(this.counterIndex, 1);
    // Set the counter so that the first message is being displayed (if not already)
    this.counterIndex = 0;
    // Disable the send button
    this.setSendButtonDisabled();
  }



  removeNotification(notifications: Array<NotificationItem>) {
    const notificationItemIndex = notifications.findIndex(x => x.name == this.notificationItem.name);
    notifications.splice(notificationItemIndex, 1);
    this.close();
  }



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
      this.removeNotification(notifications);
    }
  }






  addToList(notifications: Array<NotificationItem>, messageCount: number) {
    // See if the sender of this message already has a message notification in the list
    const notificationItemIndex = notifications.findIndex(x => x.name == this.notificationItem.name);

    // If so
    if (notificationItemIndex != -1) {
      // Make a copy of that message notification that's in the list
      const notificationItemCopy = notifications[notificationItemIndex];
      // Update the count for that message notification's red circle
      notificationItemCopy.count += messageCount;

      // If we're in the archive list
      if (notifications == this.notificationService.archiveNotifications) {
        // Then remove that message notification from the list and then put it back up at the top of the list
        notifications.splice(notificationItemIndex, 1);
        notifications.unshift(notificationItemCopy);
      }

      // If the sender of this message does NOT have a message in the list
    } else {

      // If we're in the archive list
      if (notifications == this.notificationService.archiveNotifications) {
        // Create a new message notification and put it at the top of the list
        notifications.unshift(this.createNewNotificationItem(false, messageCount));

        // If we're in the new list
      } else {
        // Create a new message notification and order it in the list based on its creation date
        notifications.push(this.createNewNotificationItem(true, messageCount))
        notifications.sort((a, b) => (a.creationDate > b.creationDate) ? -1 : 1);
      }
    }
  }




  transfer(originList: Array<NotificationItem>, originMessageCount: number, destinationList: Array<NotificationItem>, destinationMessageCount: number, dataServiceParameters: {}) {
    this.removeFromList(originList, originMessageCount);
    this.addToList(destinationList, destinationMessageCount);

    // Update the count for the notification bell
    this.notificationService.notificationCount += (destinationList == this.notificationService.archiveNotifications ? -destinationMessageCount : destinationMessageCount);
    // Update database
    this.dataService.put('api/Notifications/Archive', dataServiceParameters).subscribe();
  }



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


  onDelete() {
    if (!this.deleteAll) {

      this.delete(
        {
          notificationGroupId: this.notification.length == 1 ? this.notificationItem.notificationGroupId : 0,
          notificationId: this.notification[this.counterIndex].notificationId,
          employeeMessageIds: this.notification[this.counterIndex].employeeMessageId != null ? [this.notification[this.counterIndex].employeeMessageId] : []
        }, this.notificationItem.count);

    } else {

      let employeeMessageIds = new Array<number>();
      (this.notification as Array<NotificationMessage>).forEach(x => {
        if (x.employeeMessageId != null) employeeMessageIds.push(x.employeeMessageId)
      });

      this.delete(
        {
          notificationGroupId: this.notificationItem.notificationGroupId,
          employeeMessageIds: employeeMessageIds
        }
      );
    }
  }











  delete(dataServiceParameters: {}, messageCount?: number) {
    this.removeFromList(this.notificationService.archiveNotifications, messageCount);

    // Update database
    this.dataService.delete('api/Notifications', dataServiceParameters).subscribe();
  }




  employeeMessageWritten(): boolean {
    let isWritten: boolean = false;

    for (let i = 0; i < this.notification.length; i++) {
      // If a new reply has been written in any of the messages and they're not just empty spaces
      if (!this.notification[i].employeeMessageDate &&
        this.notification[i].employeeMessage != null &&
        this.notification[i].employeeMessage.trim().length > 0) {
        isWritten = true;
        break;
      }
    }
    return isWritten
  }



  onEscape(): void {
    if (!this.contextMenu && this.profilePopupContainer.length == 0 && !this.undoChangesPrompt && !this.deletePrompt) {
      if (!this.employeeMessageWritten()) {
        this.close();
      } else {
        this.openUndoChangesPrompt(this.close);
      }
    }
  }
}