import { Component } from '@angular/core';
import { LazyLoad } from 'common';
import { Subject } from 'rxjs';
import { ReformListOption } from '../../../classes/enums';
import { ListNotification } from '../../../classes/notifications/list-notification';

@Component({
  templateUrl: './reform-list-form.component.html',
  styleUrls: ['./reform-list-form.component.scss']
})
export class ReformListFormComponent extends LazyLoad {
  private reformListOption!: number;
  public notification!: ListNotification;
  public callback!: Function;
  public checkboxChecked!: boolean;
  public onClose: Subject<void> = new Subject<void>();

  ngOnInit() {
    super.ngOnInit();
    document.getElementById('modalBase')?.focus();
  }



  onCheckboxChange(nameCheckbox: HTMLInputElement, descriptionCheckbox: HTMLInputElement) {
    this.checkboxChecked = nameCheckbox.checked || descriptionCheckbox.checked;
    this.reformListOption = nameCheckbox.checked && !descriptionCheckbox.checked ?
      ReformListOption.ReplaceName :
      !nameCheckbox.checked && descriptionCheckbox.checked ?
        ReformListOption.RemoveDescription :
        ReformListOption.ReplaceNameandRemoveDescription;
  }


  onNotes(notes: HTMLTextAreaElement) {
    this.notification.employeeNotes[this.notification.employeeNotes.length - 1].text = notes.value;
  }


  onReformButton() {
    this.close();
    this.callback(this.reformListOption);
  }


  onEnter(e: KeyboardEvent): void {
    if (this.checkboxChecked && this.tabElements[2].nativeElement != document.activeElement &&  this.tabElements[3].nativeElement != document.activeElement && this.tabElements[4].nativeElement != document.activeElement) {
      this.onReformButton();
    }
  }


  close() {
    super.close();
    this.onClose.next();
  }
}