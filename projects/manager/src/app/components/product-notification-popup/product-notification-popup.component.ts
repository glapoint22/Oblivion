import { Component, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { DataService, LazyLoad, LazyLoadingService, SpinnerAction } from 'common';
import { NotificationItem } from '../../classes/notification-item';
import { NotificationProduct } from '../../classes/notification-product';
import { NotificationUserProfilePopupComponent } from '../notification-user-profile-popup/notification-user-profile-popup.component';

@Component({
  templateUrl: './product-notification-popup.component.html',
  styleUrls: ['./product-notification-popup.component.scss']
})
export class ProductNotificationPopupComponent extends LazyLoad {
  public userIndex: number = 0;
  public employeeIndex: number = 0;
  public notification!: NotificationProduct;
  public notificationItem!: NotificationItem;
  public notificationUserProfilePopup!: NotificationUserProfilePopupComponent;

  @ViewChild('profilePopupContainer', { read: ViewContainerRef }) profilePopupContainer!: ViewContainerRef;
  @ViewChild('notes') notes!: ElementRef<HTMLTextAreaElement>;

  constructor(lazyLoadingService: LazyLoadingService, private dataService: DataService) {
    super(lazyLoadingService)
  }



  ngOnInit() {
    super.ngOnInit();
    window.addEventListener('mousedown', this.mousedown);

    this.dataService.get<NotificationProduct>('api/Notifications/Product', [
      { key: 'productId', value: this.notificationItem.productId },
      { key: 'type', value: this.notificationItem.type },
      { key: 'archiveDate', value: this.notificationItem.archiveDate ? this.notificationItem.archiveDate : '' }
    ]).subscribe((notificationProduct: NotificationProduct) => {
      this.notification = notificationProduct;
    });
  }




  mousedown = () => {
    if (this.notificationUserProfilePopup) this.notificationUserProfilePopup.close();
  }






  openNotificationUserProfilePopup() {
    if (this.profilePopupContainer.length > 0) {
      this.notificationUserProfilePopup.close();
      return;
    }

    this.lazyLoadingService.load(async () => {
      const { NotificationUserProfilePopupComponent } = await import('../notification-user-profile-popup/notification-user-profile-popup.component');
      const { NotificationUserProfilePopupModule } = await import('../notification-user-profile-popup/notification-user-profile-popup.module');
      return {
        component: NotificationUserProfilePopupComponent,
        module: NotificationUserProfilePopupModule
      }
    }, SpinnerAction.None, this.profilePopupContainer)
      .then((notificationUserProfilePopup: NotificationUserProfilePopupComponent) => {
        this.notificationUserProfilePopup = notificationUserProfilePopup;
        notificationUserProfilePopup.user = this.notification.users[this.userIndex];
      });
  }


  onEscape(): void {
    if (this.profilePopupContainer.length > 0) {
      this.notificationUserProfilePopup.close();
    } else {
      super.onEscape();
    }
  }




  close(): void {
    // If no notes were written when this form was opened
    if (!this.notification.employees) {

      // And now if new notes have been written
      if (this.notes.nativeElement.value.trim().length > 0) {
        this.dataService.post('api/Notifications/PostNote', {
          productId: this.notificationItem.productId,
          notificationType: this.notificationItem.type,
          archiveDate: this.notificationItem.archiveDate,
          text: this.notes.nativeElement.value.trim()
        }).subscribe();
      }
    }

    // If this is a new notification and it has NOT been sent to archive yet
    if (this.notificationItem.isNew) {

      // Send it to archive
      // this.dataService.put('api/Notifications/Product/Archive',
      //   {
      //     productId: this.notificationItem.productId,
      //     notificationType: this.notificationItem.type
      //   }).subscribe();
    }

    // Now close
    super.close();
  }





  ngOnDestroy() {
    window.removeEventListener('mousedown', this.mousedown);
  }
}