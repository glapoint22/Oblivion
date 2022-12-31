import { Component, ElementRef } from '@angular/core';
import { RadioButtonLazyLoad } from 'common';
import { Subject } from 'rxjs';

@Component({
  templateUrl: './reform-list-form.component.html',
  styleUrls: ['./reform-list-form.component.scss']
})
export class ReformListFormComponent extends RadioButtonLazyLoad {
  private reformListOption!: number;
  public callback!: Function;
  public optionSelected!: boolean;
  public onClose: Subject<void> = new Subject<void>();

  ngOnInit() {
    super.ngOnInit();
    document.getElementById('modalBase')?.focus();
  }


  onRadioButtonChange(radioButton: ElementRef<HTMLElement>) {
    this.optionSelected = true;
    this.reformListOption = this.tabElements.indexOf(radioButton);
  }

  onSubmitButton() {
    this.close();
    this.callback(this.reformListOption);
  }


  onEnter(e: KeyboardEvent): void {
    if (this.optionSelected && this.tabElements[3].nativeElement != document.activeElement) {
      this.onSubmitButton();
    }
  }


  close() {
    super.close();
    this.onClose.next();
  }
}