import { Component, ElementRef, ViewChild } from '@angular/core';
import { LazyLoad } from 'common';
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
}