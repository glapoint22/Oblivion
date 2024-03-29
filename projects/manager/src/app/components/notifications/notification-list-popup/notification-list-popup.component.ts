import { Component, ViewChild } from '@angular/core';
import { DataService, LazyLoad, LazyLoadingService, NotificationType, SpinnerAction } from 'common';
import { ListUpdateType, MenuOptionType } from '../../../classes/enums';
import { ListOptions } from '../../../classes/list-options';
import { ListUpdate } from '../../../classes/list-update';
import { NotificationItem } from '../../../classes/notifications/notification-item';
import { NotificationService } from '../../../services/notification/notification.service';
import { ProductService } from '../../../services/product/product.service';
import { NotificationListComponent } from '../../lists/notification-list/notification-list.component';
import { ErrorNotificationPopupComponent } from '../error-notification-popup/error-notification-popup.component';
import { MessageNotificationPopupComponent } from '../message-notification-popup/message-notification-popup.component';
import { ProductNotificationPopupComponent } from '../product-notification-popup/product-notification-popup.component';
import { ReviewComplaintNotificationPopupComponent } from '../review-complaint-notification-popup/review-complaint-notification-popup.component';
import { UserAccountNotificationPopupComponent } from '../user-account-notification-popup/user-account-notification-popup.component';

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


  constructor(lazyLoadingService: LazyLoadingService, public notificationService: NotificationService, private dataService: DataService, private productService: ProductService) {
    super(lazyLoadingService)
  }



  ngOnInit() {
    super.ngOnInit();
    window.addEventListener('mousedown', () => this.mousedown());
  }




  mousedown = () => {
    this.close()
  }



  refreshNotifications() {
    this.notificationService.refreshNotifications();
  }


  onListUpdate(listUpdate: ListUpdate) {
    if (listUpdate.type == ListUpdateType.SelectedItems) {

      // If the archive tab is selected
      if (!this.newTabSelected) {
        // and we right click on a archived notification item
        if (listUpdate.rightClick) {

          // If the notification is either a User Name notification or a User Image notification
          if ((listUpdate.selectedItems![0] as NotificationItem).notificationType == NotificationType.UserName ||
            (listUpdate.selectedItems![0] as NotificationItem).notificationType == NotificationType.UserImage ||
            (listUpdate.selectedItems![0] as NotificationItem).notificationType == NotificationType.List ||
            (listUpdate.selectedItems![0] as NotificationItem).notificationType == NotificationType.Review) {

            // Don't allow the context menu to be shown
            listUpdate.selectedItems![0].selectable = false;
            // And don't allow the selection to be shown
            this.archiveList.listManager.showSelection = false;

            // But if it's any other type of notification
          } else {

            // Allow the context menu to be shown
            listUpdate.selectedItems![0].selectable = true;
            // And allow the selection to be shown
            this.archiveList.listManager.showSelection = true;
            // Record the notification item that was right clicked
            this.notificationItem = listUpdate.selectedItems![0] as NotificationItem;
            return
          }

          // If an archived notification was NOT right clicked (just clicked)
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
    // User Name / User Image
    if (notificationItem.notificationType == NotificationType.UserName ||
      notificationItem.notificationType == NotificationType.UserImage ||
      notificationItem.notificationType == NotificationType.List ||
      notificationItem.notificationType == NotificationType.Review) {

      this.lazyLoadingService.load(async () => {
        const { UserAccountNotificationPopupComponent } = await import('../user-account-notification-popup/user-account-notification-popup.component');
        const { UserAccountNotificationPopupModule } = await import('../user-account-notification-popup/user-account-notification-popup.module');
        return {
          component: UserAccountNotificationPopupComponent,
          module: UserAccountNotificationPopupModule
        }
      }, SpinnerAction.None, this.notificationService.notificationPopupContainer)
        .then((userAccountNotificationPopup: UserAccountNotificationPopupComponent) => {
          userAccountNotificationPopup.notificationType = notificationItem.notificationType;
          userAccountNotificationPopup.notificationItem = notificationItem;
          this.notificationService.notificationPopup = userAccountNotificationPopup;
        })
    }

    // Message
    if (notificationItem.notificationType == NotificationType.Message) {
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

    // Review Complaint
    if (notificationItem.notificationType == NotificationType.ReviewComplaint) {
      this.lazyLoadingService.load(async () => {
        const { ReviewComplaintNotificationPopupComponent } = await import('../review-complaint-notification-popup/review-complaint-notification-popup.component');
        const { ReviewComplaintNotificationPopupModule } = await import('../review-complaint-notification-popup/review-complaint-notification-popup.module');
        return {
          component: ReviewComplaintNotificationPopupComponent,
          module: ReviewComplaintNotificationPopupModule
        }
      }, SpinnerAction.None, this.notificationService.notificationPopupContainer)
        .then((reviewNotificationPopup: ReviewComplaintNotificationPopupComponent) => {
          reviewNotificationPopup.notificationItem = notificationItem;
          this.notificationService.notificationPopup = reviewNotificationPopup;
        })
    }

    // Product (Form)
    if (notificationItem.notificationType > NotificationType.ReviewComplaint && notificationItem.notificationType < NotificationType.ProductReportedAsIllegal) {
      this.productService.openNotificationProduct(notificationItem.productId, notificationItem);
    }

    // Product (Non-Form)
    if (notificationItem.notificationType >= NotificationType.ProductReportedAsIllegal && notificationItem.notificationType < NotificationType.Error) {
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

    // Error
    if (notificationItem.notificationType == NotificationType.Error) {
      this.lazyLoadingService.load(async () => {
        const { ErrorNotificationPopupComponent } = await import('../error-notification-popup/error-notification-popup.component');
        const { ErrorNotificationPopupModule } = await import('../error-notification-popup/error-notification-popup.module');
        return {
          component: ErrorNotificationPopupComponent,
          module: ErrorNotificationPopupModule
        }
      }, SpinnerAction.None, this.notificationService.notificationPopupContainer)
        .then((errorNotificationPopup: ErrorNotificationPopupComponent) => {
          errorNotificationPopup.notificationItem = notificationItem;
          this.notificationService.notificationPopup = errorNotificationPopup;
        })
    }
  }


  restore() {
    this.notificationItem.isNew = true;
    this.notificationItem.selected = false;
    this.notificationItem.selectType = null!;
    this.archiveList.listManager.selectedItem = null!;

    // If the type of this notification is a message, see if the sender of this message happens to have a message sitting in the NEW list
    const newMessageNotificationItem = this.notificationService.newNotifications.find(x => x.notificationType == NotificationType.Message && x.name == this.notificationItem.name);
    // If the sender of this message notification has a message sitting in the NEW list
    if (newMessageNotificationItem) {
      // Increase the count for the message notification that is sitting in the NEW list by the number of messages in the message notification from the ARCHIVE list
      newMessageNotificationItem.count += this.notificationItem.count;
    }

    // If the notification is anything other than a message notification
    if (this.notificationItem.notificationType != NotificationType.Message ||
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



    if (this.notificationItem.notificationType == NotificationType.Message) {
      this.dataService.put('api/Notifications/RestoreAllNotifications',
        {
          notificationGroupId: this.notificationItem.notificationGroupId
        }, {
        authorization: true
      }).subscribe();

    } else {

      this.dataService.put('api/Notifications/RestoreGroup',
        {
          notificationGroupId: this.notificationItem.notificationGroupId
        }, {
        authorization: true
      }).subscribe();
    }
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
      if (this.newTabSelected ||
        // Or if the Archive tab IS selected and NO archived notification item is selected
        (!this.newTabSelected && !this.archiveList.listManager.selectedItem)) {
        // Close the popup
        super.close();
      }
    }
  }


  ngOnDestroy() {
    super.ngOnDestroy();
    window.removeEventListener('mousedown', this.mousedown);
  }
}