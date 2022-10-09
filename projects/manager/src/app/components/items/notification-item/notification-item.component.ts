import { Component, Input } from '@angular/core';
import { NotificationType } from 'common';
import { NotificationItem } from '../../../classes/notifications/notification-item';
import { ImageItemComponent } from '../image-item/image-item.component';

@Component({
  selector: 'notification-item',
  templateUrl: './notification-item.component.html',
  styleUrls: ['../list-item/list-item.component.scss', './notification-item.component.scss']
})
export class NotificationItemComponent extends ImageItemComponent {
  @Input() item!: NotificationItem;
  public NotificationType = NotificationType;
}