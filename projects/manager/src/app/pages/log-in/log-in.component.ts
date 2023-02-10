import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AccountService, DataService } from 'common';
import { NotificationService } from '../../services/notification/notification.service';

@Component({
  selector: 'log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent {

  constructor(private dataService: DataService, private accountService: AccountService, private notificationService: NotificationService) { }


  onSubmit(form: NgForm) {
    if (form.valid) {
      this.dataService.post('api/Account/LogIn', {
        email: form.controls.email.value,
        password: form.controls.password.value,
      }).subscribe(() => {
        this.accountService.logIn();
        this.notificationService.getArchivedNotifications();
        this.notificationService.startNotificationTimer();
      });
    }
  }
}