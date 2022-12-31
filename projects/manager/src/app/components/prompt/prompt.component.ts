import { Component } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { LazyLoad } from 'common';
import { Subject } from 'rxjs';
import { Button } from '../../classes/button';

@Component({
  selector: 'prompt',
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.scss']
})
export class PromptComponent extends LazyLoad {
  public parentObj!: Object;
  public checkboxChecked: boolean = true;
  public title!: string;
  public message!: SafeHtml;
  public primaryButton: Button = new Button();
  public secondaryButton: Button = new Button();
  public tertiaryButton: Button = new Button();
  public onClose: Subject<void> = new Subject<void>();

  primaryButtonFunction() {
    if (this.primaryButton.buttonFunction) this.primaryButton.buttonFunction!.apply(this.parentObj, this.primaryButton.buttonFunctionParameters);
    this.close();
  }

  secondaryButtonFunction() {
    if (this.secondaryButton.buttonFunction) this.secondaryButton.buttonFunction!.apply(this.parentObj, this.secondaryButton.buttonFunctionParameters);
    this.close();
  }

  tertiaryButtonFunction() {
    if (this.tertiaryButton.buttonFunction) this.tertiaryButton.buttonFunction!.apply(this.parentObj, this.tertiaryButton.buttonFunctionParameters);
    this.close();
  }

  oncheckboxClick() {
    this.checkboxChecked = !this.checkboxChecked;
  }

  close() {
    super.close();
    this.onClose.next();
  }
}