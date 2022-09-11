import { Injectable, ViewContainerRef } from '@angular/core';
import { DataService } from 'common';
import { Subject } from 'rxjs';
import { NotificationItem } from '../../classes/notification-item';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  public notificationPopupContainer!: ViewContainerRef;
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
    // window.setTimeout(() => {
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
            this.newNotifications.push(y);
          })
        }
      });
  }


  getArchiveNotifications() {
    this.dataService.get<Array<NotificationItem>>('api/Notifications', [{ key: 'isNew', value: false }])
      .subscribe((notifications: Array<NotificationItem>) => {
        notifications.forEach(x => {
          this.archiveNotifications.push(x);
        })
      })
  }
}
