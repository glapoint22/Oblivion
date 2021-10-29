import { Component } from '@angular/core';
import { Modal } from '../../classes/modal';

@Component({
  selector: 'email-sent-prompt',
  templateUrl: './email-sent-prompt.component.html',
  styleUrls: ['./email-sent-prompt.component.scss']
})
export class EmailSentPromptComponent extends Modal {
  public email: string = "";
}
