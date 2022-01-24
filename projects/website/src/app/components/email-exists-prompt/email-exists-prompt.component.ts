import { Component } from '@angular/core';
import { LazyLoad } from '../../classes/lazy-load';

@Component({
  selector: 'email-exists-prompt',
  templateUrl: './email-exists-prompt.component.html',
  styleUrls: ['./email-exists-prompt.component.scss']
})
export class EmailExistsPromptComponent extends LazyLoad { 
  public email!: string;
}