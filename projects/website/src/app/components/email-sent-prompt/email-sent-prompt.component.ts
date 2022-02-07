import { Component } from '@angular/core';
import { LazyLoad } from '../../classes/lazy-load';

@Component({
  selector: 'email-sent-prompt',
  templateUrl: './email-sent-prompt.component.html',
  styleUrls: ['./email-sent-prompt.component.scss']
})
export class EmailSentPromptComponent extends LazyLoad {
  public email!: string;


  ngAfterViewInit() {
    super.ngAfterViewInit();
    if (this.tabElements) this.tabElements[0].nativeElement.focus();
  }
}