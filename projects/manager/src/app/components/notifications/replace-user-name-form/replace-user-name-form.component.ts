import { Component } from '@angular/core';
import { LazyLoad } from 'common';
import { Subject } from 'rxjs';
import { UserNameNotification } from '../../../classes/notifications/user-name-notification';

@Component({
  templateUrl: './replace-user-name-form.component.html',
  styleUrls: ['./replace-user-name-form.component.scss']
})
export class ReplaceUserNameFormComponent extends LazyLoad {
  public notification!: UserNameNotification;
  public callback!: Function;
  public onClose: Subject<void> = new Subject<void>();

  ngOnInit() {
    super.ngOnInit();
    document.getElementById('modalBase')?.focus();
  }


  onNotes(notes: HTMLTextAreaElement) {
    this.notification.employeeNotes[this.notification.employeeNotes.length - 1].text = notes.value;
  }


  onReplaceButton() {
    this.close();
    this.callback();
  }


  onEnter(e: KeyboardEvent): void {
    if (this.tabElements[0].nativeElement != document.activeElement && this.tabElements[1].nativeElement != document.activeElement && this.tabElements[2].nativeElement != document.activeElement) {
      this.onReplaceButton();
    }
  }


  close() {
    super.close();
    this.onClose.next();
  }
}