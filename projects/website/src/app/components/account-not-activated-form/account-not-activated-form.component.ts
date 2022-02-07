import { Component } from '@angular/core';
import { ActivateAccountFormComponent } from '../activate-account-form/activate-account-form.component';

@Component({
  selector: 'account-not-activated-form',
  templateUrl: './account-not-activated-form.component.html',
  styleUrls: ['./account-not-activated-form.component.scss']
})
export class AccountNotActivatedFormComponent extends ActivateAccountFormComponent { }