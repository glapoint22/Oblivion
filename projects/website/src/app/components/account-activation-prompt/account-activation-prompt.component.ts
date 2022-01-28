import { Component, OnInit } from '@angular/core';
import { LazyLoad } from '../../classes/lazy-load';
import { AccountNotActivatedPromptComponent } from '../account-not-activated-prompt/account-not-activated-prompt.component';
import { CreateAccountFormComponent } from '../create-account-form/create-account-form.component';

@Component({
  selector: 'account-activation-prompt',
  templateUrl: './account-activation-prompt.component.html',
  styleUrls: ['./account-activation-prompt.component.scss']
})
export class AccountActivationPromptComponent extends LazyLoad {
  public email!: string;
  public accountNotActivatedPrompt!: AccountNotActivatedPromptComponent;
  public createAccountForm!: CreateAccountFormComponent;


  close() {
    super.close();
    if (this.accountNotActivatedPrompt) this.accountNotActivatedPrompt.close();
    if (this.createAccountForm) this.createAccountForm.close();
  }
}