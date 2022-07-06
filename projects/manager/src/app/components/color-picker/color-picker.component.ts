import { Component, ElementRef, ViewChild } from '@angular/core';
import { Color, HSB, HSL, LazyLoad } from 'common';
import { Subject } from 'rxjs';


@Component({
  selector: 'color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent extends LazyLoad {
  public color!: Color;
  public hue!: number;
  public red!: number;
  public hex!: string;
  public blue!: number;
  public green!: number;
  public alpha!: number;
  public ringX!: number;
  public ringY!: number;
  public hexFocus!: boolean;
  public editMode!: boolean;
  public ringDark!: boolean;
  public hueSliderY!: number;
  @ViewChild('hueBar') hueBar!: ElementRef;
  @ViewChild('colorPalette') colorPalette!: ElementRef;
  public $onChange: Subject<void> = new Subject<void>();
  public $onClose: Subject<void> = new Subject<void>();
  public posX!: number;
  public posY!: number;

  ngAfterViewInit(): void {
    super.ngAfterViewInit();

    window.setTimeout(() => {
      // Set the ring position
      this.setRingPosition(this.color.toHSB());
      // Set the hue slider position
      this.setHueSliderPosition(this.color.toHSL());
      // Set the RGB
      this.setRGB();
      // Set the alpha
      this.alpha = this.color.a;
    });
  }



  // -----------------------------( COLOR DOWN )------------------------------ \\
  colorDown(e: MouseEvent) {
    const setColor = (e: MouseEvent) => {
      const colorContainerLeft: number = this.colorPalette.nativeElement.getBoundingClientRect().x;
      const colorContainerTop: number = this.colorPalette.nativeElement.getBoundingClientRect().y;
      const colorContainerWidth: number = this.colorPalette.nativeElement.offsetWidth;
      const colorContainerHeight: number = this.colorPalette.nativeElement.offsetHeight;
      const cursorPosX: number = e.clientX - colorContainerLeft;
      const cursorPosY: number = e.clientY - colorContainerTop;
      const cursorPercentageX: number = Math.round((cursorPosX / colorContainerWidth) * 100);
      const cursorPercentageY: number = Math.round((cursorPosY / colorContainerHeight) * 100);
      this.ringX = cursorPercentageX;
      this.ringY = cursorPercentageY;
      if (this.ringX <= 0) this.ringX = 0;
      if (this.ringX >= 100) this.ringX = 100;
      if (this.ringY <= 0) this.ringY = 0;
      if (this.ringY >= 100) this.ringY = 100;
      this.setRGB();
    }
    setColor(e);
    // this.cover.showPointerCover = this.preventNoShow = true;

    // Moving the ring
    const ringMove = (e: MouseEvent) => {
      setColor(e);
    }
    // Stop moving the ring
    const ringMoveEnd = () => {
      // this.cover.showPointerCover = this.preventNoShow = false;
      window.removeEventListener("mousemove", ringMove);
      window.removeEventListener("mouseup", ringMoveEnd);
    }
    // Add event listeners
    window.addEventListener("mousemove", ringMove);
    window.addEventListener("mouseup", ringMoveEnd);
  }


  // -----------------------------( HUE DOWN )------------------------------ \\
  hueDown(e: MouseEvent) {
    const setHue = (e: MouseEvent) => {
      this.hueSliderY = e.clientY - this.hueBar.nativeElement.getBoundingClientRect().y - 3;
      if (this.hueSliderY <= 0) this.hueSliderY = 0;
      if (this.hueSliderY >= this.hueBar.nativeElement.getBoundingClientRect().height - 7) this.hueSliderY = this.hueBar.nativeElement.getBoundingClientRect().height - 7;
      this.hue = this.getHue();
      this.setRGB();
    }
    setHue(e)
    // this.cover.showPointerCover = this.preventNoShow = true;
    // Moving the hue slider
    const hueSliderMove = (e: MouseEvent) => {
      setHue(e);
    }
    // Stop moving the hue slider
    const hueSliderMoveEnd = () => {
      // this.cover.showPointerCover = this.preventNoShow = false;
      window.removeEventListener("mousemove", hueSliderMove);
      window.removeEventListener("mouseup", hueSliderMoveEnd);
    }
    // Add event listeners
    window.addEventListener("mousemove", hueSliderMove);
    window.addEventListener("mouseup", hueSliderMoveEnd);
  }


  // -----------------------------( SET RGB )------------------------------ \\
  setRGB(activeElement?: string) {
    this.hue = this.getHue();
    const hsb: HSB = new HSB(this.hue, this.ringX, 100 - this.ringY);
    const hsl: HSL = hsb.toHSL();
    const rgbColor: Color = Color.HSLToRGB(hsl.h / 360, hsl.s / 100, hsl.l / 100);
    rgbColor.a = this.color.a;

    //Update the input fields
    if (activeElement != "hex") this.hex = rgbColor.toHex().substring(1);
    if (activeElement != 'alpha') this.alpha = this.color.a = Color.hexToRGB('#' + this.hex).a;
    this.color.r = rgbColor.r;
    if (activeElement != "red") this.red = rgbColor.r;
    this.color.g = rgbColor.g;
    if (activeElement != "green") this.green = rgbColor.g;
    this.color.b = rgbColor.b;
    if (activeElement != "blue") this.blue = rgbColor.b;

    //Set the ring color
    if (this.ringY < 50) {
      if (this.ringX > 50) {
        if (hsl.h > 200 || hsl.h < 25) {
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

    this.$onChange.next();
  }


  // -----------------------------( ON HEX INPUT CLICK )------------------------------ \\
  onHexInputClick(hexInput: any) {
    window.setTimeout(() => {
      if (!this.editMode) {
        this.editMode = true;
        hexInput.select();
      }
    })
  }


  // -----------------------------( UPDATE RGB )------------------------------ \\
  updateRGB(activeElement: string) {
    // Move the ring
    this.setRingPosition(new Color((this.red * 2.55 * 100), (this.green * 2.55 * 100), (this.blue * 2.55 * 100), 1).toHSB());
    // Move the hue slider 
    this.setHueSliderPosition(new Color((this.red * 2.55 * 100), (this.green * 2.55 * 100), (this.blue * 2.55 * 100), 1).toHSL());
    // Set the rgb
    this.setRGB(activeElement);
  }


  // -----------------------------( UPDATE HEX INPUT )------------------------------ \\
  updateHexInput(hexInput: any) {
    //Only allow hex characters
    !(/^[0123456789abcdef]*$/i).test(hexInput.value) ? hexInput.value = hexInput.value.replace(/[^0123456789abcdef]/ig, '') : null;
    // Update the hex variable from the hex input
    this.hex = hexInput.value;
    // Move the ring
    this.setRingPosition(Color.hexToRGB("#" + this.hex).toHSB());
    // Move the hue slider 
    this.setHueSliderPosition(Color.hexToRGB("#" + this.hex).toHSL());
    // Set the rgb
    this.setRGB("hex");
  }


  // -----------------------------( SET RING POSITION )------------------------------ \\
  setRingPosition(hsb: HSB) {
    this.ringX = hsb.s;
    this.ringY = 100 - hsb.b;
  }


  // -----------------------------( GET HUE )------------------------------ \\
  getHue() {
    const hueContainerHeight = this.hueBar.nativeElement.getBoundingClientRect().height - 7;
    const magicNumber = 360 / hueContainerHeight;
    const hue = 360 - Math.round(this.hueSliderY * magicNumber);

    return hue;
  }


  // -----------------------------( SET HUE SLIDER POSITION )------------------------------ \\
  setHueSliderPosition(hsl: HSL) {
    const hueContainerHeight = this.hueBar.nativeElement.getBoundingClientRect().height - 7;
    const magicNumber = 360 / hueContainerHeight;
    const hue = hsl.h * 360;
    this.hueSliderY = hueContainerHeight - (hue / magicNumber);
  }



  ngOnDestroy() {
    this.$onClose.next();
  }

}