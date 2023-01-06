import { Component } from '@angular/core';
import { LazyLoad } from 'common';
import { Subject } from 'rxjs';
import { ReviewComplaintNotification } from '../../../classes/notifications/review-complaint-notification';

@Component({
  templateUrl: './remove-restore-review-form.component.html',
  styleUrls: ['./remove-restore-review-form.component.scss']
})
export class RemoveRestoreReviewFormComponent extends LazyLoad {
  public notification!: ReviewComplaintNotification;
  public employeeNotes!: string;
  public callback!: Function;
  public addStrike!: boolean;
  public newNoteAdded!: boolean;
  public onClose: Subject<void> = new Subject<void>();

  ngOnInit() {
    super.ngOnInit();
    document.getElementById('modalBase')?.focus();
    this.addStrike = !this.notification.reviewDeleted ? true : false;
  }


  onNotes(notes: HTMLTextAreaElement) {
    this.employeeNotes = notes.value.trim();
  }


  oncheckbox() {
    this.addStrike = !this.addStrike;
  }


  onRemoveButton() {
    this.close();
    if(this.notification.employeeNotes.length > 0 && this.employeeNotes.length > 0) this.newNoteAdded = true;
    this.callback(this.addStrike, this.employeeNotes, this.newNoteAdded);
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