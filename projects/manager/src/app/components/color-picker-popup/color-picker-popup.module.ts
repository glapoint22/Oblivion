import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorPickerPopupComponent } from './color-picker-popup.component';



@NgModule({
  declarations: [ColorPickerPopupComponent],
  imports: [
    CommonModule
  ],
  exports: [ColorPickerPopupComponent]
})
export class ColorPickerPopupModule { }
