import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { DataService, LazyLoad, LazyLoadingService, SpinnerAction } from 'common';
import { MenuOptionType } from '../../classes/enums';
import { NotificationItem } from '../../classes/notification-item';
import { NotificationMessage } from '../../classes/notification-message';
import { ContextMenuComponent } from '../../components/context-menu/context-menu.component';
import { NotificationService } from '../../services/notification/notification.service';
import { NotificationProfilePopupComponent } from '../notification-profile-popup/notification-profile-popup.component';

@Component({
  templateUrl: './message-notification-popup.component.html',
  styleUrls: ['./message-notification-popup.component.scss']
})
export class MessageNotificationPopupComponent extends LazyLoad {
  private contextMenu!: ContextMenuComponent;

  public messageIndex: number = 0;
  public sendButtonDisabled: boolean = true;
  public notificationItem!: NotificationItem;
  public notification!: Array<NotificationMessage>;
  public profilePopup!: NotificationProfilePopupComponent;

  @ViewChild('profilePopupContainer', { read: ViewContainerRef }) profilePopupContainer!: ViewContainerRef;

  constructor(lazyLoadingService: LazyLoadingService, private dataService: DataService, private notificationService: NotificationService) {
    super(lazyLoadingService)
  }



  ngOnInit() {
    super.ngOnInit();
    this.notificationItem.selected = false;
    this.notificationItem.selectType = null!;

    this.dataService.get<Array<NotificationMessage>>('api/Notifications/Message', [
      { key: 'notificationGroupId', value: this.notificationItem.notificationGroupId },
      { key: 'isNew', value: this.notificationItem.isNew }
    ]).subscribe((notificationMessages: Array<NotificationMessage>) => {
      this.notification = notificationMessages;
    });
  }




  openContextMenu(ellipsis: HTMLElement) {
    if (this.contextMenu) {
      this.contextMenu.close();
      return;
    }
    this.lazyLoadingService.load(async () => {
      const { ContextMenuComponent } = await import('../../components/context-menu/context-menu.component');
      const { ContextMenuModule } = await import('../../components/context-menu/context-menu.module');

      return {
        component: ContextMenuComponent,
        module: ContextMenuModule
      }
    }, SpinnerAction.None).then((contextMenu: ContextMenuComponent) => {
      this.contextMenu = contextMenu;
      contextMenu.xPos = ellipsis.getBoundingClientRect().left + 25;
      contextMenu.yPos = ellipsis.getBoundingClientRect().top + 21;
      contextMenu.parentObj = this;
      contextMenu.options = [
        {
          type: MenuOptionType.MenuItem,
          name: this.notificationItem.isNew ? 'Archive All Messages' : 'Restore as New',
          optionFunction: () => {
            this.notificationItem.isNew ?

              // Archive All
              this.transfer(this.notificationService.newNotifications, null!, this.notificationService.archiveNotifications, this.notificationItem.count, {
                archiveAllMessagesInGroup: true,
                notificationGroupId: this.notificationItem.notificationGroupId
              })

              :

              // Restore
              this.transfer(this.notificationService.archiveNotifications, this.notificationItem.count, this.notificationService.newNotifications, 1, {
                restore: true,
                notificationId: this.notification[this.messageIndex].notificationId,
                notificationGroupId: this.notificationItem.notificationGroupId
              });
          }
        },
        {
          type: MenuOptionType.MenuItem,
          name: 'Restore All Messages as New',
          hidden: this.notificationItem.isNew || (!this.notificationItem.isNew && this.notificationItem.count == 1),
          optionFunction: () => {

            // Restore All
            this.transfer(this.notificationService.archiveNotifications, null!, this.notificationService.newNotifications, this.notificationItem.count, {
              restore: true,
              restoreAllMessagesInGroup: true,
              notificationGroupId: this.notificationItem.notificationGroupId
            });
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
            null
          }
        },
        {
          type: MenuOptionType.MenuItem,
          name: 'Delete All Messages',
          hidden: this.notificationItem.isNew || (!this.notificationItem.isNew && this.notificationItem.count == 1),
          optionFunction: () => {
            null
          }
        }
      ]

      const contextMenuOpenListener = contextMenu.menuOpen.subscribe((menuOpen: boolean) => {
        contextMenuOpenListener.unsubscribe();
        this.contextMenu = null!;
      })
    });
  }





  openProfilePopup() {
    if (this.profilePopupContainer.length > 0) {
      this.profilePopup.close();
      return;
    }

    this.lazyLoadingService.load(async () => {
      const { NotificationProfilePopupComponent } = await import('../notification-profile-popup/notification-profile-popup.component');
      const { NotificationProfilePopupModule } = await import('../notification-profile-popup/notification-profile-popup.module');
      return {
        component: NotificationProfilePopupComponent,
        module: NotificationProfilePopupModule
      }
    }, SpinnerAction.None, this.profilePopupContainer)
      .then((profilePopup: NotificationProfilePopupComponent) => {
        this.profilePopup = profilePopup;
        profilePopup.user = this.notification[this.messageIndex];
      });
  }



  setSendButtonDisabled() {
    // And if now a new reply has been written in this current message and it's not just empty spaces
    if (!this.notification[this.messageIndex].employeeMessageDate && this.notification[this.messageIndex].employeeMessage != null && this.notification[this.messageIndex].employeeMessage.trim().length > 0) {
      this.sendButtonDisabled = false;

    } else {
      this.sendButtonDisabled = true;
    }
  }


  onEscape(): void {
    if (this.profilePopupContainer.length > 0) {
      this.profilePopup.close();
    } else {
      if (!this.contextMenu) {
        this.close();
      }
    }
  }



  sendMessage() {
    this.dataService.post('api/Notifications/PostMessage', {
      notificationId: this.notification[this.messageIndex].notificationId,
      message: this.notification[this.messageIndex].employeeMessage.trim()
    }).subscribe();

    if (this.notificationItem.isNew) this.archive();
  }



  archive() {
    this.transfer(this.notificationService.newNotifications, this.notificationItem.count, this.notificationService.archiveNotifications, 1, {
      notificationId: this.notification[this.messageIndex].notificationId,
      notificationGroupId: this.notificationItem.notificationGroupId
    });
  }



  removeMessage() {
    // Minus the count for the notification's red circle by one
    this.notificationItem.count -= 1;
    // And then remove the current message from the popup
    this.notification.splice(this.messageIndex, 1);
    // Set the counter so that the first message is being displayed (if not already)
    this.messageIndex = 0;
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



  removeFromOriginList(notifications: Array<NotificationItem>, messageCount?: number) {
    // If we're moving just a message (NOT a notification item)
    //  And there is more than just one message in the message notification
    if (messageCount != null && messageCount > 1) {
      this.removeMessage();

      // But if we're moving just a message (NOT a notification item)
      // And there is only one message in the message notification
      // OR
      // If we ARE moving a notification item
    } else {
      this.removeNotification(notifications);
    }
  }






  addToDestinationList(notifications: Array<NotificationItem>, messageCount: number) {
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
    this.removeFromOriginList(originList, originMessageCount);
    this.addToDestinationList(destinationList, destinationMessageCount);

    // Update the count for the notification bell
    this.notificationService.notificationCount += (destinationList == this.notificationService.archiveNotifications ? -destinationMessageCount : destinationMessageCount);
    // Update database
    this.dataService.put('api/Notifications/Archive', dataServiceParameters).subscribe();
  }



  // 1) Archive: Has only one message (NO messages in archive list)
  // 2) Archive: Has more than one message (NO messages in archive list)
  // 3) Archive: Has only one message (HAS messages in archive list)
  // 4) Archive: Has more than one message (HAS messages in archive list)
  // 5) Archive All: (NO messages in archive list)
  // 6) Archive All: (HAS messages in archive list)
  // 7) Restore: Has only one message (NO messages in new list)
  // 8) Restore: Has more than one message (NO messages in new list)
  // 9) Restore: Has only one message (HAS messages in new list)
  // 10) Restore: Has more than one message (HAS messages in new list)
  // 11) Restore All: (NO messages in new list)
  // 12) Restore All: (HAS messages in new list)
}