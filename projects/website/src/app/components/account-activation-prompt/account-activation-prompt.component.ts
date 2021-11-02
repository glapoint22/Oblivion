import { Component } from '@angular/core';
import { Modal } from '../../classes/modal';

@Component({
  selector: 'account-activation-prompt',
  templateUrl: './account-activation-prompt.component.html',
  styleUrls: ['./account-activation-prompt.component.scss']
})
export class AccountActivationPromptComponent extends Modal {
  public email: string = "trumpy@usa.com";
}