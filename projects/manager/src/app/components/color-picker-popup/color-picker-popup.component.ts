import { Component, HostListener } from '@angular/core';
import { Color, HSB, HSL, LazyLoad } from 'common';
import { Subject } from 'rxjs';

@Component({
  selector: 'color-picker-popup',
  templateUrl: './color-picker-popup.component.html',
  styleUrls: ['./color-picker-popup.component.scss']
})
export class ColorPickerPopupComponent extends LazyLoad {
  public color!: Color;
  public hue: number = 0;
  public $onChange: Subject<void> = new Subject<void>();
  public $onClose: Subject<void> = new Subject<void>();
  public $onOpen: Subject<void> = new Subject<void>();
  public posX!: number;
  public posY!: number;
  public ringX!: number;
  public ringY!: number;
  public hueHandlePos!: number;
  public alphaHandlePos!: number;
  public arrowPos!: string;
  public hex!: string;
  public ringDark!: boolean;
  private initialColor!: Color;
  private hasSubmitted!: boolean;


  // ------------------------------------------------------------------- Ng On Init -----------------------------------------------------------
  ngOnInit() {
    super.ngOnInit();

    // Set the initial color
    this.initialColor = new Color(this.color.r, this.color.g, this.color.b, this.color.a);
  }






  // -------------------------------------------------------------------- On Open -------------------------------------------------------------
  onOpen(): void {
    this.$onOpen.next();

    // Set the ring position
    this.setRingPosition();

    // Set the hue handle position
    this.setHueHandlePosition();

    // Set the alpha handle position
    this.setAlphaHandlePosition();

    // Set the hex color
    this.hex = this.color.toHex();

    // Set the hue
    this.setHue(this.color.toHSL().h);

    // Set the ring color
    this.setRingColor();
  }




  // ---------------------------------------------------------------- Set Ring Position --------------------------------------------------------
  setRingPosition() {
    const hsb = this.color.toHSB();

    this.ringX = hsb.s;
    this.ringY = 100 - hsb.b;
  }







  // -------------------------------------------------------------- Set Hue Handle Position ------------------------------------------------------
  setHueHandlePosition() {
    const hsl = this.color.toHSL();

    this.hueHandlePos = hsl.h * 150;
    this.hueHandlePos = Math.min(150 - 2, Math.max(2, this.hueHandlePos));
  }








  // -------------------------------------------------------------- Set Alpha Handle Position ------------------------------------------------------
  setAlphaHandlePosition() {
    this.alphaHandlePos = 150 - (this.color.a * 150);
    this.alphaHandlePos = Math.min(150 - 2, Math.max(2, this.alphaHandlePos));
  }









  // ----------------------------------------------------------- On Color Mousedown -----------------------------------------------------------
  onColorMousedown(mousedownEvent: MouseEvent): void {
    const colorPalette = mousedownEvent.currentTarget as HTMLElement;
    const rect = colorPalette.getBoundingClientRect();

    this.moveRing(rect, mousedownEvent.x, mousedownEvent.y);
    this.setColor();
    this.setHex();

    const mousemove = (mousemoveEvent: MouseEvent) => {
      this.moveRing(rect, mousemoveEvent.x, mousemoveEvent.y);
      this.setColor();
      this.setHex();
    }

    window.addEventListener('mousemove', mousemove);
    window.addEventListener('mouseup', () => window.removeEventListener('mousemove', mousemove), { once: true });
  }






  // ----------------------------------------------------------------- Move Ring ------------------------------------------------------------------
  moveRing(colorPaletteRect: DOMRect, x: number, y: number) {
    this.ringX = (Math.min(colorPaletteRect.width, Math.max(0, x - colorPaletteRect.x)) / colorPaletteRect.width) * 100;
    this.ringY = (Math.min(colorPaletteRect.height, Math.max(0, y - colorPaletteRect.y)) / colorPaletteRect.height) * 100;

    this.setRingColor();
  }







  // ---------------------------------------------------------------- Set Color -----------------------------------------------------------------
  setColor() {
    const hsb: HSB = new HSB(this.hue, this.ringX, 100 - this.ringY);
    const hsl: HSL = hsb.toHSL();
    const rgbColor: Color = Color.HSLToRGB(hsl.h / 360, hsl.s / 100, hsl.l / 100);

    this.color.r = rgbColor.r;
    this.color.g = rgbColor.g;
    this.color.b = rgbColor.b;
  }









  // ------------------------------------------------------------------ Set Hex ------------------------------------------------------------------
  setHex() {
    this.hex = this.color.toHex();
    this.$onChange.next();
  }










  // --------------------------------------------------------------- On Hue Mousedown -------------------------------------------------------------
  onHueBarMousedown(mousedownEvent: MouseEvent) {
    const colorBar = mousedownEvent.currentTarget as HTMLElement;
    const rect = colorBar.getBoundingClientRect();

    this.setHue(this.getHue(rect, mousedownEvent.y));
    this.setColor();
    this.setHex();
    this.setRingColor();

    const mousemove = (mousemoveEvent: MouseEvent) => {
      this.setHue(this.getHue(rect, mousemoveEvent.y));
      this.setColor();
      this.setHex();
      this.setRingColor();
    }

    window.addEventListener('mousemove', mousemove);
    window.addEventListener('mouseup', () => window.removeEventListener('mousemove', mousemove), { once: true });
  }








  // ------------------------------------------------------------------- Get Hue -----------------------------------------------------------------
  getHue(hueBarRect: DOMRect, pos: number): number {
    this.hueHandlePos = Math.min(hueBarRect.height - 2, Math.max(2, pos - hueBarRect.y));
    return ((this.hueHandlePos - 2) / (hueBarRect.height - 4));
  }









  // ------------------------------------------------------------------- Set Hue -----------------------------------------------------------------
  setHue(hue: number) {
    this.hue = hue * 360;
  }









  // --------------------------------------------------------------- On Alpha Mousedown ------------------------------------------------------------
  onAlphaBarMousedown(mousedownEvent: MouseEvent) {
    const colorBar = mousedownEvent.currentTarget as HTMLElement;
    const rect = colorBar.getBoundingClientRect();

    this.setAlpha(rect, mousedownEvent.y);
    this.setHex();

    const mousemove = (mousemoveEvent: MouseEvent) => {
      this.setAlpha(rect, mousemoveEvent.y);
      this.setHex();
    }

    window.addEventListener('mousemove', mousemove);
    window.addEventListener('mouseup', () => window.removeEventListener('mousemove', mousemove), { once: true });
  }









  // ------------------------------------------------------------------- Set Alpha -----------------------------------------------------------------
  setAlpha(alphaBarRect: DOMRect, pos: number) {
    this.alphaHandlePos = Math.min(alphaBarRect.height - 2, Math.max(2, pos - alphaBarRect.y));
    const multiplier = ((this.alphaHandlePos - 2) / (alphaBarRect.height - 4));
    this.color.a = Math.round((1 - multiplier + Number.EPSILON) * 100) / 100;
  }










  // ----------------------------------------------------------------- On Color Input ---------------------------------------------------------------
  onColorInput(input: HTMLInputElement, color: string) {
    !(/^[0-9]*$/i).test(input.value) ? input.value = input.value.replace(/[^0-9]/ig, '') : null;

    if (input.value == '') {
      input.value = '0';
      input.select();
    }

    let value = parseInt(input.value);

    if (value > 255) {
      value = 255;
      input.value = '255';
    }

    switch (color) {
      case 'r':
        this.color.r = value;
        break;

      case 'g':
        this.color.g = value;
        break;

      case 'b':
        this.color.b = value;
        break;
    }


    this.setRingPosition();
    this.setHueHandlePosition();
    this.setHex();
    this.setHue(this.color.toHSL().h);
    this.setRingColor();
  }








  // ----------------------------------------------------------------- On Alpha Input ---------------------------------------------------------------
  onAlphaInput(input: HTMLInputElement) {
    !(/^[0-9.]*$/i).test(input.value) ? input.value = input.value.replace(/[^0-9.]/ig, '') : null;

    if (input.value == '' || input.value == '0') {
      input.value = '0';
      input.select();
    }


    let value = parseFloat(input.value);

    if (isNaN(value) || input.value == '0.') {
      value = 0;
      window.setTimeout(() => {
        input.value = '0.';
      });
    }

    if (value > 1) {
      value = 1;
      input.value = '1';
    }
    this.color.a = value;
    this.setAlphaHandlePosition();
    this.setHex();
  }








  // ------------------------------------------------------------------ On Hex Input ---------------------------------------------------------------
  onHexInput(input: HTMLInputElement) {
    !(/^[0-9a-f]*$/i).test(input.value) ? input.value = input.value.replace(/[^0-9a-f]/ig, '') : null;
    !(/^#/).test(input.value) ? input.value = '#' + input.value : null;

    this.hex = input.value;
    const color = Color.hexToRGB(this.hex);

    this.color.r = color.r;
    this.color.g = color.g;
    this.color.b = color.b;
    this.color.a = color.a;
    this.setRingPosition();
    this.setHueHandlePosition();
    this.setAlphaHandlePosition();
    this.setHue(this.color.toHSL().h);
    this.setRingColor();
    this.$onChange.next();
  }









  // ----------------------------------------------------------------- On Color Arrow Down -----------------------------------------------------------
  onColorArrowDown(event: KeyboardEvent, color: string) {
    let direction!: number;

    if (event.key == 'ArrowUp') {
      direction = 1;
    } else if (event.key == 'ArrowDown') {
      direction = -1;
    } else {
      return;
    }

    switch (color) {
      case 'r':
        this.color.r = Math.max(0, Math.min(255, this.color.r + direction));
        break;

      case 'g':
        this.color.g = Math.max(0, Math.min(255, this.color.g + direction));
        break;

      case 'b':
        this.color.b = Math.max(0, Math.min(255, this.color.b + direction));
        break;
    }

    this.setRingPosition();
    this.setHueHandlePosition();
    this.setHex();
    this.setHue(this.color.toHSL().h);
    this.setRingColor();
  }








  // ----------------------------------------------------------------- On Alpha Arrow Down -----------------------------------------------------------
  onAlphaArrowDown(event: KeyboardEvent) {
    let direction!: number;

    if (event.key == 'ArrowUp') {
      direction = 0.1;
    } else if (event.key == 'ArrowDown') {
      direction = -0.1;
    } else {
      return;
    }

    this.color.a = Math.max(0, Math.min(1, this.color.a + direction));
    this.color.a = Math.round(this.color.a * 100) / 100;

    this.setAlphaHandlePosition();
    this.setHex();
  }






  // ------------------------------------------------------------------------ Set Ring Color -------------------------------------------------------------
  setRingColor() {
    if (this.ringY < 50) {
      if (this.ringX > 50) {
        if (this.hue > 200 || this.hue < 25) {
          this.ringDark = false;
        } else {
          this.ringDark = true;
        }
      } else {
        this.ringDark = true;
      }
    } else {
      this.ringDark = false;
    }
  }




  // --------------------------------------------------------------------------- On Enter -----------------------------------------------------------------
  onEnter() {
    this.onSubmit();
  }





  // --------------------------------------------------------------------------- On Submit -----------------------------------------------------------------
  onSubmit() {
    this.hasSubmitted = true;
    this.close();
  }



  


  // --------------------------------------------------------------------------- Close -----------------------------------------------------------------
  close() {
    if (!this.hasSubmitted) {
      this.color.r = this.initialColor.r;
      this.color.g = this.initialColor.g;
      this.color.b = this.initialColor.b;
      this.color.a = this.initialColor.a;
      this.$onChange.next();
    }

    this.$onClose.next();
    super.close();
  }




  // ---------------------------------------------------------------------- On Window Mousedown ----------------------------------------------------
  @HostListener('window:mousedown')
  onWindowMousedown() {
    this.close();
  }
}