import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HoplinkPopupComponent } from './hoplink-popup.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [HoplinkPopupComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    HoplinkPopupComponent
  ]
})
export class HoplinkPopupModule { }
