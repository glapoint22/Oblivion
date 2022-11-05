import { Component, Input, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { NotificationItem } from '../../../classes/notifications/notification-item';
import { Product } from '../../../classes/product';
import { NotificationCircleButtonComponent } from './notification-circle-button/notification-circle-button.component';

@Component({
  selector: 'product-circle-buttons',
  templateUrl: './product-circle-buttons.component.html',
  styleUrls: ['./product-circle-buttons.component.scss']
})
export class ProductCircleButtonsComponent {
  private onNotificationCircleButtonLoad: Subject<void> = new Subject<void>();
  @Input() product!: Product;
  @ViewChild('notificationCircleButton') notificationCircleButton!: NotificationCircleButtonComponent;


  // ================================================================( NG AFTER VIEW INIT )================================================================= \\

  ngAfterViewInit() {
    this.onNotificationCircleButtonLoad.next();
  }



  // =============================================================( OPEN NOTIFICATION POPUP )=============================================================== \\

  openNotificationPopup(notificationItem: NotificationItem) {
    // If the notification circle button has (NOT) been loaded yet in the view at the time this method gets called
    if (!this.notificationCircleButton) {

      // Wait for the view to finish initializing and then call the method on the notification circle button component
      const onNotificationCircleButtonLoadListener = this.onNotificationCircleButtonLoad.subscribe(() => {
        onNotificationCircleButtonLoadListener.unsubscribe();
        this.notificationCircleButton.openNotificationPopup(notificationItem);
      });

      // But if the notification circle button is (ALREADY) loaded in the view at the time this method gets called
    } else {
      // call the method on the notification circle button component
      this.notificationCircleButton.openNotificationPopup(notificationItem);
    }
  }
}