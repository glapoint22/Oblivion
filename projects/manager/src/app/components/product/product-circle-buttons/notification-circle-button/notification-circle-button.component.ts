import { Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { LazyLoadingService, SpinnerAction } from 'common';
import { NotificationItem } from 'projects/manager/src/app/classes/notifications/notification-item';
import { Product } from 'projects/manager/src/app/classes/product';
import { ProductNotificationPopupComponent } from './../../../notifications/product-notification-popup/product-notification-popup.component';

@Component({
  selector: 'notification-circle-button',
  templateUrl: './notification-circle-button.component.html',
  styleUrls: ['./notification-circle-button.component.scss']
})
export class NotificationCircleButtonComponent {
  private notificationPopup!: ProductNotificationPopupComponent;
  public notificationPopupOpen!: boolean;

  @Input() product!: Product;
  @ViewChild('notificationPopupContainer', { read: ViewContainerRef }) notificationPopupContainer!: ViewContainerRef;

  constructor(private lazyLoadingService: LazyLoadingService) {}
  
  openNotificationPopup(notificationItem?: NotificationItem) {
    // If the popup is already open
    if (this.notificationPopupOpen) {
      // And it's being opened again from the notification list
      if (notificationItem) {
        // Keep it open and select the notification type in the dropdown that's the same as
        // notification type of the notification that was just selected in the notification list
        this.notificationPopup.selectNotificationType(notificationItem, true);

        // But if the circle button is being clicked
      } else {
        // Just close the popup
        this.notificationPopup.close();
      }
      return;
    }


    this.lazyLoadingService.load(async () => {
      const { ProductNotificationPopupComponent } = await import('./../../../notifications/product-notification-popup/product-notification-popup.component');
      const { ProductNotificationPopupModule } = await import('./../../../notifications/product-notification-popup/product-notification-popup.module');
      return {
        component: ProductNotificationPopupComponent,
        module: ProductNotificationPopupModule
      }
    }, SpinnerAction.None, this.notificationPopupContainer)
      .then((notificationPopup: ProductNotificationPopupComponent) => {
        this.notificationPopupOpen = true;
        this.notificationPopup = notificationPopup;
        notificationPopup.fromProduct = true;
        // If this popup is being opened from the notification list
        if (notificationItem) notificationPopup.notificationItem = notificationItem!;
        notificationPopup.notificationItems = this.product.notificationItems;


        const onNotificationPopupCloseListener = this.notificationPopup.onPopupClose.subscribe(() => {
          onNotificationPopupCloseListener.unsubscribe();
          this.notificationPopupOpen = false;
        });
      });
  }
}