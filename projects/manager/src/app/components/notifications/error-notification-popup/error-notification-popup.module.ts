import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorNotificationPopupComponent } from './error-notification-popup.component';
import { FormsModule } from '@angular/forms';
import { CounterModule } from '../../counter/counter.module';
import { IconButtonModule } from '../../icon-button/icon-button.module';



@NgModule({
  declarations: [ErrorNotificationPopupComponent],
  imports: [
    CommonModule,
    CounterModule,
    IconButtonModule,
    FormsModule
  ]
})
export class ErrorNotificationPopupModule { }
