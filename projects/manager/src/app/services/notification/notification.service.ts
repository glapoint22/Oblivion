import { Injectable, ViewContainerRef } from '@angular/core';
import { DataService } from 'common';
import { Subject } from 'rxjs';
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

    this.getNotificationsTimer = window.setTimeout(() => {
      this.getNewNotifications();
    }, 50000)
  }

  getNotificationCount() {
    this.dataService.get<{ count: number, notifications: Array<NotificationItem> }>('api/Notifications/Count', [{ key: 'currentCount', value: this.notificationCount }])
      .subscribe((x: { count: number, notifications: Array<NotificationItem> }) => {


        if (x != null) {
          this.notificationCount = x.count;

          this.newNotifications = new Array<NotificationItem>();
          x.notifications.forEach(y => {
            y.name = y.notificationType == 0 ? y.email : this.getNotificationName(y.notificationType);
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
          x.name = x.notificationType == 0 ? x.email : this.getNotificationName(x.notificationType);
          this.archiveNotifications.push(x);
        })
      })
  }




  getNotificationName(notificationType: number): string {
    let notificationName: string = '';

    switch (notificationType) {
      case 1:
        notificationName = "Review Complaint";
        break;

      case 2:
        notificationName = "Product Name Doesn\'t Match With Product Description";
        break;

      case 3:
        notificationName = "Product Name Doesn\'t Match With Product Image";
        break;

      case 4:
        notificationName = "Product Name (Other)";
        break;

      case 5:
        notificationName = "Product Price Too High";
        break;

      case 6:
        notificationName = "Product Price Not Correct";
        break;

      case 7:
        notificationName = "Product Price (Other)";
        break;

      case 8:
        notificationName = "Videos & Images are Different From Product";
        break;

      case 9:
        notificationName = "Not Enough Videos & Images";
        break;

      case 10:
        notificationName = "Videos & Images Not Clear";
        break;

      case 11:
        notificationName = "Videos & Images Misleading";
        break;

      case 12:
        notificationName = "Videos & Images (Other)";
        break;

      case 13:
        notificationName = "Product Description Incorrect";
        break;

      case 14:
        notificationName = "Product Description Too Vague";
        break;

      case 15:
        notificationName = "Product Description Misleading";
        break;

      case 16:
        notificationName = "Product Description (Other)";
        break;

      case 17:
        notificationName = "Product Reported As Illegal";
        break;

      case 18:
        notificationName = "Product Reported As Having Adult Content";
        break;

      case 19:
        notificationName = "Offensive Product (Other)";
        break;


      case 20:
        notificationName = "Product Inactive";
        break;

      case 21:
        notificationName = "Product site no longer in service";
        break;


      case 22:
        notificationName = "Missing Product (Other)";
        break;
    }

    return notificationName;
  }
}
