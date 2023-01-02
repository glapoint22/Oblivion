import { Component } from '@angular/core';
import { LazyLoad } from 'common';
import { Subject } from 'rxjs';
import { ReviewComplaintNotification } from '../../../classes/notifications/review-complaint-notification';

@Component({
  templateUrl: './remove-restore-review-form.component.html',
  styleUrls: ['./remove-restore-review-form.component.scss']
})
export class RemoveRestoreReviewFormComponent extends LazyLoad  {
  public notification!: ReviewComplaintNotification;
  public callback!: Function;
  public addStrike!: boolean;
  public onClose: Subject<void> = new Subject<void>();

  ngOnInit() {
    super.ngOnInit();
    document.getElementById('modalBase')?.focus();
    this.addStrike = !this.notification.reviewDeleted ? true : false;
  }


  onNotes(notes: HTMLTextAreaElement) {
    this.notification.employeeNotes[this.notification.employeeNotes.length - 1].text = notes.value;
  }


  oncheckbox() {
    this.addStrike = !this.addStrike;
  }


  onRemoveButton() {
    this.close();
    this.callback(this.addStrike);
  }


  onEnter(e: KeyboardEvent): void {
    if (this.tabElements[0].nativeElement != document.activeElement && this.tabElements[2].nativeElement != document.activeElement && this.tabElements[3].nativeElement != document.activeElement) {
      this.onRemoveButton();
    }
  }


  close() {
    super.close();
    this.onClose.next();
  }
}