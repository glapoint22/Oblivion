import { Component, ElementRef, ViewChild } from '@angular/core';
import { LazyLoad } from 'common';
import { Subject } from 'rxjs';
import { PopupArrowPosition } from '../../classes/enums';

@Component({
  selector: 'hoplink-popup',
  templateUrl: './hoplink-popup.component.html',
  styleUrls: ['./hoplink-popup.component.scss']
})
export class HoplinkPopupComponent extends LazyLoad {
  @ViewChild('hoplinkInput') hoplinkInput!: ElementRef<HTMLInputElement>;
  public arrowPosition!: PopupArrowPosition;
  public PopupArrowPosition = PopupArrowPosition;
  public hoplink!: string;
  public callback!: Function;
  public onClose: Subject<void> = new Subject<void>();


  ngOnInit() {
    super.ngOnInit();
    window.addEventListener('mousedown', this.mousedown);
  }


  mousedown = () => {
    this.close();
  }


  ngAfterViewInit(): void {
    super.ngAfterViewInit();

    window.setTimeout(() => {
      this.hoplinkInput.nativeElement.focus();
      this.hoplinkInput.nativeElement.select();
    });
  }

  onSubmitClick() {
    this.callback(this.hoplink);
    this.close();
  }


  close(): void {
    super.close();
    this.onClose.next();
  }


  ngOnDestroy() {
    window.removeEventListener('mousedown', this.mousedown);
  }
}