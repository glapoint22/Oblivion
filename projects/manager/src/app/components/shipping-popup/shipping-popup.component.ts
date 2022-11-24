import { Component, ElementRef } from '@angular/core';
import { RadioButtonLazyLoad, ShippingType } from 'common';
import { Subject } from 'rxjs';
import { PopupArrowPosition } from '../../classes/enums';

@Component({
  selector: 'shipping-popup',
  templateUrl: './shipping-popup.component.html',
  styleUrls: ['./shipping-popup.component.scss']
})
export class ShippingPopupComponent extends RadioButtonLazyLoad {
  private initialShippingType!: ShippingType;

  public arrowPosition!: PopupArrowPosition;
  public PopupArrowPosition = PopupArrowPosition;
  public shipping!: ShippingType;
  public ShippingType = ShippingType;
  public callback!: Function;
  public onClose: Subject<void> = new Subject<void>();
  public submitButtonDisabled: boolean = true;

  ngOnInit() {
    super.ngOnInit();
    this.initialShippingType = this.shipping;
    window.addEventListener('mousedown', this.mousedown);
  }


  mousedown = () => {
    this.close();
  }

  onSubmitClick() {
    this.callback(this.shipping);
    this.close();
  }

  close(): void {
    super.close();
    this.onClose.next();
  }


  onRadioButtonChange(radioButton: ElementRef<HTMLElement>) {
    this.shipping = this.tabElements.indexOf(radioButton) + 1;
    this.submitButtonDisabled = this.shipping == this.initialShippingType;
  }



  ngOnDestroy() {
    super.ngOnDestroy();
    window.removeEventListener('mousedown', this.mousedown);
  }
}