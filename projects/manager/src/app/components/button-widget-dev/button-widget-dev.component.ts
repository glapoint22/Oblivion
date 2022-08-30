import { Component } from '@angular/core';
import { Color } from 'common';
import { ButtonWidgetComponent, ButtonWidgetData, PaddingType } from 'widgets';
import { BuilderType, ButtonState, WidgetHandle, WidgetInspectorView } from '../../classes/enums';
import { WidgetService } from '../../services/widget/widget.service';

@Component({
  selector: 'button-widget-dev',
  templateUrl: './button-widget-dev.component.html',
  styleUrls: ['./button-widget-dev.component.scss']
})
export class ButtonWidgetDevComponent extends ButtonWidgetComponent {
  public currentState: ButtonState = ButtonState.Normal;
  public widgetHandle = WidgetHandle;
  public widgetInspectorView = WidgetInspectorView;
  public BuilderType = BuilderType;
  public PaddingType = PaddingType;

  // Background Hover Color
  private _backgroundHoverColorDev: Color = Color.hexToRGB(this.backgroundHoverColor);
  public get backgroundHoverColorDev(): Color {
    this.backgroundHoverColor = this._backgroundHoverColorDev.toHex();
    return this._backgroundHoverColorDev;
  }
  public set backgroundHoverColorDev(color: Color) {
    this.backgroundHoverColor = color.toRGBString();
    this._backgroundHoverColorDev = color;
  }


  // Background Active Color
  private _backgroundActiveColorDev: Color = Color.hexToRGB(this.backgroundActiveColor);
  public get backgroundActiveColorDev(): Color {
    this.backgroundActiveColor = this._backgroundActiveColorDev.toHex();
    return this._backgroundActiveColorDev;
  }
  public set backgroundActiveColorDev(color: Color) {
    this.backgroundActiveColor = color.toRGBString();
    this._backgroundActiveColorDev = color;
  }



  // Border Hover Color
  private _borderHoverColorDev: Color = Color.hexToRGB(this.borderHoverColor);
  public get borderHoverColorDev(): Color {
    this.borderHoverColor = this._borderHoverColorDev.toHex();
    return this._borderHoverColorDev;
  }
  public set borderHoverColorDev(color: Color) {
    this.borderHoverColor = color.toRGBString();
    this._borderHoverColorDev = color;
  }


  // Border Active Color
  private _borderActiveColorDev: Color = Color.hexToRGB(this.borderActiveColor);
  public get borderActiveColorDev(): Color {
    this.borderActiveColor = this._borderActiveColorDev.toHex();
    return this._borderActiveColorDev;
  }
  public set borderActiveColorDev(color: Color) {
    this.borderActiveColor = color.toRGBString();
    this._borderActiveColorDev = color;
  }




  // Text Hover Color
  private _textHoverColorDev: Color = Color.hexToRGB(this.textHoverColor);
  public get textHoverColorDev(): Color {
    this.textHoverColor = this._textHoverColorDev.toHex();
    return this._textHoverColorDev;
  }
  public set textHoverColorDev(color: Color) {
    this.textHoverColor = color.toRGBString();
    this._textHoverColorDev = color;
  }


  // Text Active Color
  private _textActiveColorDev: Color = Color.hexToRGB(this.textActiveColor);
  public get textActiveColorDev(): Color {
    this.textActiveColor = this._textActiveColorDev.toHex();
    return this._textActiveColorDev;
  }
  public set textActiveColorDev(color: Color) {
    this.textActiveColor = color.toRGBString();
    this._textActiveColorDev = color;
  }


  constructor(public widgetService: WidgetService) { super() }


  setWidget(buttonWidgetData: ButtonWidgetData): void {
    super.setWidget(buttonWidgetData);

    // Background Color
    if (buttonWidgetData.backgroundHoverColor) this.backgroundHoverColorDev = Color.hexToRGB(buttonWidgetData.backgroundHoverColor);
    if (buttonWidgetData.backgroundActiveColor) this.backgroundActiveColorDev = Color.hexToRGB(buttonWidgetData.backgroundActiveColor);

    // Border Color
    if (buttonWidgetData.borderHoverColor) this.borderHoverColorDev = Color.hexToRGB(buttonWidgetData.borderHoverColor);
    if (buttonWidgetData.borderActiveColor) this.borderActiveColorDev = Color.hexToRGB(buttonWidgetData.borderActiveColor);

    // Text Color
    if (buttonWidgetData.textHoverColor) this.textHoverColorDev = Color.hexToRGB(buttonWidgetData.textHoverColor);
    if (buttonWidgetData.textActiveColor) this.textActiveColorDev = Color.hexToRGB(buttonWidgetData.textActiveColor);
  }


  // ------------------------------------------------------------------- Ng On Init ---------------------------------------------------------------
  ngOnInit() {
    super.ngOnInit();
    this.background.enabled = true;
  }


  // ----------------------------------------------------------------- Get Background Color ----------------------------------------------------------
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
}