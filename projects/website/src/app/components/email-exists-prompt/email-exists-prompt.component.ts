import { Component } from '@angular/core';
import { LazyLoad } from '../../classes/lazy-load';
import { CreateAccountFormComponent } from '../create-account-form/create-account-form.component';

@Component({
  selector: 'email-exists-prompt',
  templateUrl: './email-exists-prompt.component.html',
  styleUrls: ['./email-exists-prompt.component.scss']
})
export class EmailExistsPromptComponent extends LazyLoad { 
  public email!: string;
  public createAccountForm!: CreateAccountFormComponent;


  close() {
    super.close();
    if (this.createAccountForm) this.createAccountForm.close();
  }
}