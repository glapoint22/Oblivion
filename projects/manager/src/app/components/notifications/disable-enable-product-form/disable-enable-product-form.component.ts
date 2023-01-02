import { Component } from '@angular/core';
import { LazyLoad } from 'common';
import { Subject } from 'rxjs';
import { ProductNotification } from '../../../classes/notifications/product-notification';

@Component({
  templateUrl: './disable-enable-product-form.component.html',
  styleUrls: ['./disable-enable-product-form.component.scss']
})
export class DisableEnableProductFormComponent extends LazyLoad {
  public notification!: ProductNotification;
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