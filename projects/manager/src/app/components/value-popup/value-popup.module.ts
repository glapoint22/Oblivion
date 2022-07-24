import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValuePopupComponent } from './value-popup.component';



@NgModule({
  declarations: [ValuePopupComponent],
  imports: [
    CommonModule
  ],
  exports: [ValuePopupComponent]
})
export class ValuePopupModule { }
