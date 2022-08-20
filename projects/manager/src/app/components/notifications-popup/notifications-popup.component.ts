import { Component } from '@angular/core';
import { LazyLoad } from 'common';

@Component({
  templateUrl: './notifications-popup.component.html',
  styleUrls: ['./notifications-popup.component.scss']
})
export class NotificationsPopupComponent extends LazyLoad {
  public newTabSelected: boolean = true;
  public orderByDateSelected: boolean = true;
  public orderByArrowUp: boolean = true;


  onNotificationSelect(notification: any) {

  }

  onTypeColumnClick() {
    if(this.orderByDateSelected) this.orderByArrowUp = false;
    this.orderByDateSelected = false;
    this.orderByArrowUp = !this.orderByArrowUp
  }


  onDateColumnClick() {
    if(!this.orderByDateSelected) this.orderByArrowUp = false;
    this.orderByDateSelected = true;
    this.orderByArrowUp = !this.orderByArrowUp
  }
}