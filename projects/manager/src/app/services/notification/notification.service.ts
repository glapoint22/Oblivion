import { Injectable, ViewContainerRef } from '@angular/core';
import { DataService } from 'common';
import { Subject } from 'rxjs';
import { NotificationType } from '../../classes/enums';
import { NotificationItem } from '../../classes/notification-item';
import { NotificationPopupComponent } from '../../components/notifications/notification-popup/notification-popup.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private getNotificationsTimer!: number;

  public notificationPopupContainer!: ViewContainerRef;
  public notificationPopup!: NotificationPopupComponent;
  public onNotificationCount: Subject<number> = new Subject<number>();
  public newNotifications!: Array<NotificationItem>;
  public archiveNotifications: Array<NotificationItem> = new Array<NotificationItem>();

  private _notificationCount: number = 0;
  public get notificationCount(): number {
    return this._notificationCount;
  }
  public set notificationCount(v: number) {
    this._notificationCount = v;
    this.onNotificationCount.next(v);
  }


  constructor(private dataService: DataService) {
    this.getNewNotifications();
    this.getArchiveNotifications();
  }


  getNewNotifications() {
    this.getNotificationCount();

    // this.getNotificationsTimer = window.setTimeout(() => {
    //   this.getNewNotifications();
    // }, 50000)
  }

  getNotificationCount() {
    this.dataService.get<{ count: number, notifications: Array<NotificationItem> }>('api/Notifications/Count', [{ key: 'currentCount', value: this.notificationCount }])
      .subscribe((x: { count: number, notifications: Array<NotificationItem> }) => {


        if (x != null) {
          this.notificationCount = x.count;

          this.newNotifications = new Array<NotificationItem>();
          x.notifications.forEach(y => {
            y.name = y.notificationType == NotificationType.Message ? y.email : this.getNotificationName(y.notificationType);
            this.newNotifications.push(y);
          })
        }
      });
  }


  refreshNotifications() {
    clearTimeout(this.getNotificationsTimer);
    this.getNewNotifications();
  }


  getArchiveNotifications() {
    this.dataService.get<Array<NotificationItem>>('api/Notifications', [{ key: 'isNew', value: false }])
      .subscribe((notifications: Array<NotificationItem>) => {
        notifications.forEach(x => {
          x.name = x.notificationType == NotificationType.Message ? x.email : this.getNotificationName(x.notificationType);
          this.archiveNotifications.push(x);
        })
      })
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
    }

    return notificationName;
  }
}
