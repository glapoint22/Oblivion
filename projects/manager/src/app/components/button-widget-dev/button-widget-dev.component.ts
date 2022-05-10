import { Component } from '@angular/core';
import { Color } from 'common';
import { ButtonWidgetComponent } from 'widgets';
import { ButtonState } from '../../classes/enums';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'button-widget-dev',
  templateUrl: './button-widget-dev.component.html',
  styleUrls: ['./button-widget-dev.component.scss']
})
export class ButtonWidgetDevComponent extends ButtonWidgetComponent {
  public currentState: ButtonState = ButtonState.Normal;

  // Background Hover Color
  private _backgroundHoverColorDev: Color = Color.hexToRGB(this.backgroundHoverColor);
  public get backgroundHoverColorDev(): Color {
    return this._backgroundHoverColorDev;
  }
  public set backgroundHoverColorDev(color: Color) {
    this.backgroundHoverColor = color.toRGBString();
    this._backgroundHoverColorDev = color;
  }


  // Background Active Color
  private _backgroundActiveColorDev: Color = Color.hexToRGB(this.backgroundActiveColor);
  public get backgroundActiveColorDev(): Color {
    return this._backgroundActiveColorDev;
  }
  public set backgroundActiveColorDev(color: Color) {
    this.backgroundActiveColor = color.toRGBString();
    this._backgroundActiveColorDev = color;
  }



  // Border Hover Color
  private _borderHoverColorDev: Color = Color.hexToRGB(this.borderHoverColor);
  public get borderHoverColorDev(): Color {
    return this._borderHoverColorDev;
  }
  public set borderHoverColorDev(color: Color) {
    this.borderHoverColor = color.toRGBString();
    this._borderHoverColorDev = color;
  }


  // Border Active Color
  private _borderActiveColorDev: Color = Color.hexToRGB(this.borderActiveColor);
  public get borderActiveColorDev(): Color {
    return this._borderActiveColorDev;
  }
  public set borderActiveColorDev(color: Color) {
    this.borderActiveColor = color.toRGBString();
    this._borderActiveColorDev = color;
  }




  // Text Hover Color
  private _textHoverColorDev: Color = Color.hexToRGB(this.textHoverColor);
  public get textHoverColorDev(): Color {
    return this._textHoverColorDev;
  }
  public set textHoverColorDev(color: Color) {
    this.textHoverColor = color.toRGBString();
    this._textHoverColorDev = color;
  }


  // Text Active Color
  private _textActiveColorDev: Color = Color.hexToRGB(this.textActiveColor);
  public get textActiveColorDev(): Color {
    return this._textActiveColorDev;
  }
  public set textActiveColorDev(color: Color) {
    this.textActiveColor = color.toRGBString();
    this._textActiveColorDev = color;
  }


  constructor(public widgetService: WidgetService) { super() }

  ngOnInit() {
    super.ngOnInit();
    this.background.enabled = true;
  }


  // ------------------------------------------------------------ Add Buton Class To Document ----------------------------------------------------------
  addButonClassToDocument(buttonClass: string) {
    const document = this.widgetElement.getRootNode() as Document;
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(buttonClass));
    document.head.appendChild(style);
  }


  // ------------------------------------------------------------ Get Background Color ----------------------------------------------------------
  getBackgroundColor(): string {
    let color: string;

    switch (this.currentState) {
      case ButtonState.Normal:
        color = this.background.rgbColor.toRGBString();
        break;

      case ButtonState.Hover:
        color = this.backgroundHoverColorDev.toRGBString();
        break;

      case ButtonState.Active:
        color = this.backgroundActiveColorDev.toRGBString();
        break;
    }

    return color;
  }





  // --------------------------------------------------------------- Get Border Color ----------------------------------------------------------
  getBorderColor(): string {
    let color: string;

    switch (this.currentState) {
      case ButtonState.Normal:
        color = this.border.rgbColor.toRGBString();
        break;

      case ButtonState.Hover:
        color = this.borderHoverColorDev.toRGBString();
        break;

      case ButtonState.Active:
        color = this.borderActiveColorDev.toRGBString();
        break;
    }

    return color;
  }




  // ----------------------------------------------------------------- Get Text Color -----------------------------------------------------------
  getTextColor(): string {
    let color: string;

    switch (this.currentState) {
      case ButtonState.Normal:
        color = this.caption.rgbColor.toRGBString();
        break;

      case ButtonState.Hover:
        color = this.textHoverColorDev.toRGBString();
        break;

      case ButtonState.Active:
        color = this.textActiveColorDev.toRGBString();
        break;
    }

    return color;
  }



  onHandleMousedown() {
    // this.widgetService.$widgetResize.next('ns-resize');

    // window.addEventListener('mouseup', this.onHandleMouseup);
  }


  onHandleMouseup = () => {
    // this.widgetService.$widgetResize.next('default');

    // window.removeEventListener('mouseup', this.onHandleMouseup);
  }
}
