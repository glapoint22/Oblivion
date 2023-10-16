import { Component } from '@angular/core';
import { LazyLoad } from 'common';
import { Subject } from 'rxjs';

@Component({
  selector: 'copied',
  templateUrl: './copied-popup.component.html',
  styleUrls: ['./copied-popup.component.scss']
})
export class CopiedPopupComponent extends LazyLoad {
  private timer!: number;
  public onClose: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.timer = window.setTimeout(() => {
      this.fade();
    }, 2500)
  }


  fade(): void {
    super.fade();
    this.onClose.next();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    window.clearTimeout(this.timer);
  }
}