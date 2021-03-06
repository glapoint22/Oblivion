import { Component } from '@angular/core';
import { LazyLoad } from 'common';

@Component({
  selector: 'email-sent-prompt',
  templateUrl: './email-sent-prompt.component.html',
  styleUrls: ['./email-sent-prompt.component.scss']
})
export class EmailSentPromptComponent extends LazyLoad {
  public email!: string;


  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.setFocus(0);
  }
}