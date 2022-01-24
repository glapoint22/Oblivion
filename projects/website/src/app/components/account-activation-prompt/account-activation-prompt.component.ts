import { Component } from '@angular/core';
import { LazyLoad } from '../../classes/lazy-load';

@Component({
  selector: 'account-activation-prompt',
  templateUrl: './account-activation-prompt.component.html',
  styleUrls: ['./account-activation-prompt.component.scss']
})
export class AccountActivationPromptComponent extends LazyLoad {
  public email!: string;
}