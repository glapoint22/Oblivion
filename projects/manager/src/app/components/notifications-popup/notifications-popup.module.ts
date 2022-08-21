import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsPopupComponent } from './notifications-popup.component';
import { SearchModule } from '../search/search.module';
import { IconButtonModule } from '../icon-button/icon-button.module';



@NgModule({
  declarations: [NotificationsPopupComponent],
  imports: [
    CommonModule,
    SearchModule,
    IconButtonModule
  ],
  exports: [NotificationsPopupComponent]
})
export class NotificationsPopupModule { }
