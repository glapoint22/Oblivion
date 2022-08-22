import { Component, Input } from '@angular/core';
import { NotificationItem } from '../../../classes/notification-item';
import { ImageListComponent } from '../image-list/image-list.component';

@Component({
  selector: 'notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent extends ImageListComponent {
  @Input() sourceList!: Array<NotificationItem>;
}