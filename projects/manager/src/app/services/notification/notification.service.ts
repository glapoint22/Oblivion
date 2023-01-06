import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, ViewContainerRef } from '@angular/core';
import { AccountService, DataService, LazyLoad, NotificationType } from 'common';
import { Subject } from 'rxjs';
import { NotificationItem } from '../../classes/notifications/notification-item';
import { NotificationQueue } from '../../classes/notifications/notification-queue';
import { NotificationPopupComponent } from '../../components/notifications/notification-popup/notification-popup.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  // Private
  private _notificationCount: number = 0;
  private notificationsTimer!: number;
  private timeinMinutesToCheckFornewNotifications = 1;

  // Public
  public refreshNotificationsInProgress!: boolean;
  public notificationPopupContainer!: ViewContainerRef;
  public notificationPopup!: NotificationPopupComponent;
  public onNotificationCount: Subject<number> = new Subject<number>();
  public newNotifications!: Array<NotificationItem>;
  public archiveNotifications: Array<NotificationItem> = new Array<NotificationItem>();
  public get notificationCount(): number {
    return this._notificationCount;
  }
  public set notificationCount(v: number) {
    this._notificationCount = v;
    this.onNotificationCount.next(v);
  }


  constructor(private dataService: DataService, private accountService: AccountService) {
    this.getArchivedNotifications();
    this.startNotificationTimer();
  }



  startNotificationTimer() {
    // Stop the current timer, if any
    this.stopNotificationTimer();
    
    this.getNewNotifications();

    this.notificationsTimer = window.setInterval(() => {
      this.getNewNotifications();
    }, this.timeinMinutesToCheckFornewNotifications * 1000 * 60)
  }


  stopNotificationTimer() {
    clearInterval(this.notificationsTimer);
  }


  getNewNotifications() {
    // If we are not signed in, stop the notification timer and return
    if (!this.accountService.user) {
      this.stopNotificationTimer();
      return;
    }


    // Query the database to get a count of how many notifications are currently in the queue
    this.dataService.get<NotificationQueue>('api/Notifications/GetNewNotifications', [{ key: 'currentCount', value: this.notificationCount }], {
      authorization: true
    }).subscribe({
      next: (notificationQueue: NotificationQueue) => {
        // If the number of notifications in the queue are different from the number of notifications we have in our list
        if (notificationQueue != null) {
          // Update the count of the list
          this.notificationCount = notificationQueue.count;

          // Update the list
          this.newNotifications = new Array<NotificationItem>();
          notificationQueue.notifications.forEach(y => {
            y.name = y.notificationType == NotificationType.Message ? y.email : this.getNotificationName(y.notificationType);
            this.newNotifications.push(y);
          })
        } else {
          this.onNotificationCount.next(this.notificationCount);
        }
        this.refreshNotificationsInProgress = false;
      },
      error: (error: HttpErrorResponse) => {
        if (error.status == 401 || error.status == 403) {
          this.stopNotificationTimer();
        }
      }
    });
  }




  refreshNotifications() {
    this.refreshNotificationsInProgress = true;
    clearTimeout(this.notificationsTimer);
    this.getNewNotifications();
  }


  getArchivedNotifications() {
    this.dataService.get<Array<NotificationItem>>('api/Notifications/GetArchivedNotifications', undefined, {
      authorization: true
    })
      .subscribe((notifications: Array<NotificationItem>) => {
        notifications.forEach(x => {
          x.name = x.notificationType == NotificationType.Message ? x.email : this.getNotificationName(x.notificationType);
          this.archiveNotifications.push(x);
        })
      })
  }



  // ================================================================( REMOVE NOTIFICATION )================================================================ \\

  removeNotification(notifications: Array<NotificationItem>, notificationItem: NotificationItem, popup: LazyLoad) {
    const notificationItemIndex = notifications.findIndex(x => x.notificationGroupId == notificationItem.notificationGroupId);
    notifications.splice(notificationItemIndex, 1);
    popup.close();
  }




  // ====================================================================( ADD TO LIST )==================================================================== \\

  addToList(notifications: Array<NotificationItem>, messageCount: number, notificationItem: NotificationItem) {
    // See if the sender of this message already has a message notification in the list
    const notificationItemIndex = notifications.findIndex(x => x.notificationGroupId == notificationItem.notificationGroupId);

    // If so
    if (notificationItemIndex != -1) {
      // Make a copy of that message notification that's in the list
      const notificationItemCopy = notifications[notificationItemIndex];
      // Update the count for that message notification's red circle
      notificationItemCopy.count += messageCount;

      // If the message is being added to the archive list
      if (notifications == this.archiveNotifications) {
        // Then remove that message notification from the list and then put it back up at the top of the list
        notifications.splice(notificationItemIndex, 1);
        notifications.unshift(notificationItemCopy);
      }

      // If the sender of this message does NOT have a message in the list
    } else {

      // If the message is being added to the archive list
      if (notifications == this.archiveNotifications) {
        // Create a new message notification and put it at the top of the list
        notifications.unshift(this.createNewNotificationItem(false, messageCount, notificationItem));

        // If the message is being added to the new list
      } else {
        // Create a new message notification and order it in the list based on its creation date
        notifications.push(this.createNewNotificationItem(true, messageCount, notificationItem))
        notifications.sort((a, b) => (a.creationDate > b.creationDate) ? -1 : 1);
      }
    }
  }



  // ===========================================================( CREATE NEW NOTIFICATION ITEM )============================================================ \\

  createNewNotificationItem(isNew: boolean, messageCount: number, notificationItem: NotificationItem): NotificationItem {
    const newNotificationItem = new NotificationItem();
    newNotificationItem.id = notificationItem.id;
    newNotificationItem.name = notificationItem.name;
    newNotificationItem.image = notificationItem.image;
    newNotificationItem.notificationGroupId = notificationItem.notificationGroupId;
    newNotificationItem.notificationType = notificationItem.notificationType;
    newNotificationItem.email = notificationItem.email;
    newNotificationItem.productId = notificationItem.productId;
    newNotificationItem.productName = notificationItem.productName;
    newNotificationItem.userName = notificationItem.userName;
    newNotificationItem.userImage = notificationItem.userImage;
    newNotificationItem.isNew = isNew;
    newNotificationItem.creationDate = notificationItem.creationDate;
    newNotificationItem.count = messageCount;
    return newNotificationItem;
  }




  getNotificationName(notificationType: number): string {
    let notificationName: string = '';

    switch (notificationType) {
      case NotificationType.UserName:
        notificationName = "User Name";
        break;

      case NotificationType.UserImage:
        notificationName = "User Image";
        break;

      case NotificationType.List:
        notificationName = "List";
        break;

      case NotificationType.Review:
        notificationName = "Review";
        break;

      case NotificationType.ReviewComplaint:
        notificationName = "Review Complaint";
        break;

      case NotificationType.ProductNameDoesNotMatchWithProductDescription:
        notificationName = "Product Name Doesn\'t Match With Product Description";
        break;

      case NotificationType.ProductNameDoesNotMatchWithProductImage:
        notificationName = "Product Name Doesn\'t Match With Product Image";
        break;

      case NotificationType.ProductNameOther:
        notificationName = "Product Name (Other)";
        break;

      case NotificationType.ProductPriceTooHigh:
        notificationName = "Product Price Too High";
        break;

      case NotificationType.ProductPriceNotCorrect:
        notificationName = "Product Price Not Correct";
        break;

      case NotificationType.ProductPriceOther:
        notificationName = "Product Price (Other)";
        break;

      case NotificationType.VideosAndImagesAreDifferentFromProduct:
        notificationName = "Videos & Images are Different From Product";
        break;

      case NotificationType.NotEnoughVideosAndImages:
        notificationName = "Not Enough Videos & Images";
        break;

      case NotificationType.VideosAndImagesNotClear:
        notificationName = "Videos & Images Not Clear";
        break;

      case NotificationType.VideosAndImagesMisleading:
        notificationName = "Videos & Images Misleading";
        break;

      case NotificationType.VideosAndImagesOther:
        notificationName = "Videos & Images (Other)";
        break;

      case NotificationType.ProductDescriptionIncorrect:
        notificationName = "Product Description Incorrect";
        break;

      case NotificationType.ProductDescriptionTooVague:
        notificationName = "Product Description Too Vague";
        break;

      case NotificationType.ProductDescriptionMisleading:
        notificationName = "Product Description Misleading";
        break;

      case NotificationType.ProductDescriptionOther:
        notificationName = "Product Description (Other)";
        break;

      case NotificationType.ProductReportedAsIllegal:
        notificationName = "Product Reported As Illegal";
        break;

      case NotificationType.ProductReportedAsHavingAdultContent:
        notificationName = "Product Reported As Having Adult Content";
        break;

      case NotificationType.OffensiveProductOther:
        notificationName = "Offensive Product (Other)";
        break;

      case NotificationType.ProductInactive:
        notificationName = "Product Inactive";
        break;

      case NotificationType.ProductSiteNolongerInService:
        notificationName = "Product site no longer in service";
        break;

      case NotificationType.MissingProductOther:
        notificationName = "Missing Product (Other)";
        break;

      case NotificationType.Error:
        notificationName = "Error";
        break;
    }

    return notificationName;
  }
}
