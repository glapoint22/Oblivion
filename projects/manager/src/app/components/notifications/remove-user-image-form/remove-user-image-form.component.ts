import { Component } from '@angular/core';
import { LazyLoad } from 'common';
import { Subject } from 'rxjs';
import { UserImageNotification } from '../../../classes/notifications/user-image-notification';
import { environment } from 'projects/manager/src/environments/environment';

@Component({
  templateUrl: './remove-user-image-form.component.html',
  styleUrls: ['./remove-user-image-form.component.scss']
})
export class RemoveUserImageFormComponent extends LazyLoad {
  public notification!: UserImageNotification;
  public callback!: Function;
  public onClose: Subject<void> = new Subject<void>();
  public websiteImages = environment.websiteImages;

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