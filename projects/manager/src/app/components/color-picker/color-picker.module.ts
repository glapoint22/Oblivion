import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorPickerComponent } from './color-picker.component';
import { NumberFieldModule } from '../number-field/number-field.module';



@NgModule({
  declarations: [ColorPickerComponent],
  imports: [
    CommonModule,
    NumberFieldModule
  ],
  exports: [ColorPickerComponent]
})
export class ColorPickerModule { }
