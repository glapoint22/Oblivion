import { Component } from '@angular/core';
import { LazyLoad } from 'common';
import { Subject } from 'rxjs';
import { ReviewNotification } from '../../../classes/notifications/review-notification';

@Component({
  templateUrl: './remove-review-form.component.html',
  styleUrls: ['./remove-review-form.component.scss']
})
export class RemoveReviewFormComponent extends LazyLoad {
  public notification!: ReviewNotification;
  public callback!: Function;
  public onClose: Subject<void> = new Subject<void>();

  ngOnInit() {
    super.ngOnInit();
    document.getElementById('modalBase')?.focus();
  }


  onNotes(notes: HTMLTextAreaElement) {
    this.notification.employeeNotes[this.notification.employeeNotes.length - 1].text = notes.value;
  }


  onRemoveButton() {
    this.close();
    this.callback();
  }


  onEnter(e: KeyboardEvent): void {
    if (this.tabElements[0].nativeElement != document.activeElement && this.tabElements[1].nativeElement != document.activeElement && this.tabElements[2].nativeElement != document.activeElement) {
      this.onRemoveButton();
    }
  }


  close() {
    super.close();
    this.onClose.next();
  }
}