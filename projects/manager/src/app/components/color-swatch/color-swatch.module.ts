import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorSwatchComponent } from './color-swatch.component';



@NgModule({
  declarations: [ColorSwatchComponent],
  imports: [
    CommonModule
  ],
  exports: [ColorSwatchComponent]
})
export class ColorSwatchModule { }
