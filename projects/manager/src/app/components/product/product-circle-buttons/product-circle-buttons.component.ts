import { Component, Input, ViewChild } from '@angular/core';
import { Product } from '../../../classes/product';
import { NotificationCircleButtonComponent } from './notification-circle-button/notification-circle-button.component';

@Component({
  selector: 'product-circle-buttons',
  templateUrl: './product-circle-buttons.component.html',
  styleUrls: ['./product-circle-buttons.component.scss']
})
export class ProductCircleButtonsComponent {
  @Input() product!: Product;
  @ViewChild('notificationCircleButton') notificationCircleButton!: NotificationCircleButtonComponent;
}