import { Component, ViewChild } from '@angular/core';
import { DataService, LazyLoad, LazyLoadingService, SpinnerAction } from 'common';
import { ListUpdateType, MenuOptionType } from '../../../classes/enums';
import { ListOptions } from '../../../classes/list-options';
import { ListUpdate } from '../../../classes/list-update';
import { NotificationItem } from '../../../classes/notification-item';
import { NotificationService } from '../../../services/notification/notification.service';
import { NotificationListComponent } from '../../lists/notification-list/notification-list.component';
import { MessageNotificationPopupComponent } from '../message-notification-popup/message-notification-popup.component';
import { ProductNotificationPopupComponent } from '../product-notification-popup/product-notification-popup.component';
import { ReviewNotificationPopupComponent } from '../review-notification-popup/review-notification-popup.component';

@Component({
  templateUrl: './notification-list-popup.component.html',
  styleUrls: ['./notification-list-popup.component.scss']
})
export class NotificationListPopupComponent extends LazyLoad {
  private notificationItem!: NotificationItem;

  public newTabSelected: boolean = true;
  public newListZIndex: number = 1;
  public archiveListZIndex: number = 0;
  public newListOptions: ListOptions = {
    editable: false,
    multiselectable: false,
    showSelection: false,
    cursor: 'pointer'
  }

  public archiveListOptions: ListOptions = {
    editable: false,
    multiselectable: false,
    showSelection: false,
    cursor: 'pointer',


    menu: {
      parentObj: this,
      menuOptions: [
        {
          type: MenuOptionType.MenuItem,
          name: 'Restore as New',
          optionFunction: this.restore
        }
      ]
    }
  }


  @ViewChild('archiveList') archiveList!: NotificationListComponent;


  constructor(lazyLoadingService: LazyLoadingService, public notificationService: NotificationService, private dataService: DataService) {
    super(lazyLoadingService)
  }



  ngOnInit() {
    super.ngOnInit();
    window.addEventListener('mousedown', () => this.mousedown());
  }




  mousedown = () => {
    this.close()
  }





  onListUpdate(listUpdate: ListUpdate) {
    if (listUpdate.type == ListUpdateType.SelectedItems) {

      // If the archive tab is selected
      if (!this.newTabSelected) {
        // and we right click on a archived notification item
        if (listUpdate.rightClick) {
          // Allow the selection to be shown
          this.archiveList.listManager.showSelection = true;
          // Record the notification item that was right clicked
          this.notificationItem = listUpdate.selectedItems![0] as NotificationItem;
          return

          // If a archived notification was NOT right clicked (just clicked)
        } else {
          // Clear any selection (if any)
          this.archiveList.listManager.showSelection = false;
        }
      }

      // Regardless of what tab is selected, if a notification item is just clicked (NOT right clicked)
      if (!listUpdate.rightClick) {
        // Close the popup
        super.close();
        // Open the notification that was clicked
        this.openNotificationPopup(listUpdate.selectedItems![0] as NotificationItem);
      }
    }
  }





  openNotificationPopup(notificationItem: NotificationItem) {
    if (notificationItem.notificationType == 0) {
      this.lazyLoadingService.load(async () => {
        const { MessageNotificationPopupComponent } = await import('../message-notification-popup/message-notification-popup.component');
        const { MessageNotificationPopupModule } = await import('../message-notification-popup/message-notification-popup.module');
        return {
          component: MessageNotificationPopupComponent,
          module: MessageNotificationPopupModule
        }
      }, SpinnerAction.None, this.notificationService.notificationPopupContainer)
        .then((messageNotificationPopup: MessageNotificationPopupComponent) => {
          messageNotificationPopup.notificationItem = notificationItem;
          this.notificationService.notificationPopup = messageNotificationPopup;
        })
    }


    if (notificationItem.notificationType == 1) {
      this.lazyLoadingService.load(async () => {
        const { ReviewNotificationPopupComponent: ReviewNotificationPopupComponent } = await import('../review-notification-popup/review-notification-popup.component');
        const { ReviewNotificationPopupModule: ReviewNotificationPopupModule } = await import('../review-notification-popup/review-notification-popup.module');
        return {
          component: ReviewNotificationPopupComponent,
          module: ReviewNotificationPopupModule
        }
      }, SpinnerAction.None, this.notificationService.notificationPopupContainer)
        .then((reviewNotificationPopup: ReviewNotificationPopupComponent) => {
          reviewNotificationPopup.notificationItem = notificationItem;
          this.notificationService.notificationPopup = reviewNotificationPopup;
        })
    }


    if (notificationItem.notificationType >= 17) {
      this.lazyLoadingService.load(async () => {
        const { ProductNotificationPopupComponent } = await import('../product-notification-popup/product-notification-popup.component');
        const { ProductNotificationPopupModule } = await import('../product-notification-popup/product-notification-popup.module');
        return {
          component: ProductNotificationPopupComponent,
          module: ProductNotificationPopupModule
        }
      }, SpinnerAction.None, this.notificationService.notificationPopupContainer)
        .then((productNotificationPopup: ProductNotificationPopupComponent) => {
          productNotificationPopup.notificationItem = notificationItem;
          this.notificationService.notificationPopup = productNotificationPopup;
        })
    }
  }


  restore() {
    this.notificationItem.isNew = true;
    this.notificationItem.selected = false;
    this.notificationItem.selectType = null!;
    this.archiveList.listManager.selectedItem = null!;

    // If the type of this notification is a message, see if the sender of this message happens to have a message sitting in the NEW list
    const newMessageNotificationItem = this.notificationService.newNotifications.find(x => x.notificationType == 0 && x.name == this.notificationItem.name);
    // If the sender of this message notification has a message sitting in the NEW list
    if (newMessageNotificationItem) {
      // Increase the count for the message notification that is sitting in the NEW list by the number of messages in the message notification from the ARCHIVE list
      newMessageNotificationItem.count += this.notificationItem.count;
    }

    // If the notification is anything other than a message notification
    if (this.notificationItem.notificationType != 0 ||
      // Or the notification is a message notification but the sender of that message
      // notification does NOT have a NEW message notification sitting in the NEW list
      !newMessageNotificationItem) {
      // Then put that notification back into the NEW list
      this.notificationService.newNotifications.push(this.notificationItem)
      this.notificationService.newNotifications.sort((a, b) => (a.creationDate > b.creationDate) ? -1 : 1);
    }

    // Remove the notification from the archive list
    this.notificationService.archiveNotifications.splice(this.notificationItem.index!, 1);
    // Update the count for the notification bell
    this.notificationService.notificationCount += this.notificationItem.count;


    // Update database
    this.dataService.put('api/Notifications/Archive',
      {
        restore: true,
        notificationGroupId: this.notificationItem.notificationGroupId,
        restoreAllMessagesInGroup: this.notificationItem.notificationType == 0 ? true : false
      }).subscribe();
  }



  onEscape(): void {
    this.close();
  }

  close(): void {
    // If the context menu is NOT open
    if (!this.archiveList.listManager.contextMenuOpen) {
      // Unselect any notification item that may be selected (if any)
      this.archiveList.listManager.showSelection = false;

      // And if the New tab is selected
      if(this.newTabSelected ||
        // Or if the Archive tab IS selected and NO archived notification item is selected
        (!this.newTabSelected && !this.archiveList.listManager.selectedItem)) {
        // Close the popup
        super.close();
      }
    }
  }


  ngOnDestroy() {
    window.removeEventListener('mousedown', this.mousedown);
  }
}