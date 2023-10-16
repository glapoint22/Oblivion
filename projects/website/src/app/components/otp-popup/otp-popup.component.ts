import { Component } from '@angular/core';
import { LazyLoad } from 'common';
import { Subject } from 'rxjs';

@Component({
  selector: 'otp',
  templateUrl: './otp-popup.component.html',
  styleUrls: ['./otp-popup.component.scss']
})
export class OtpPopupComponent extends LazyLoad {
  private timer!: number;
  public onClose: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.timer = window.setTimeout(() => {
      this.fade();
    }, 3000)
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