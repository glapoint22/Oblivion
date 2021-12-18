import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderDirective } from './slider.directive';



@NgModule({
  declarations: [SliderDirective],
  imports: [
    CommonModule
  ],
  exports: [SliderDirective]
})
export class SliderModule { }
