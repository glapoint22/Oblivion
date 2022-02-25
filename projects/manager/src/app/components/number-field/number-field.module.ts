import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberFieldComponent } from './number-field.component';



@NgModule({
  declarations: [NumberFieldComponent],
  imports: [
    CommonModule
  ],
  exports: [NumberFieldComponent]
})
export class NumberFieldModule { }
