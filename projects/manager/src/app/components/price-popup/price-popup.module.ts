import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PricePopupComponent } from './price-popup.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [PricePopupComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [PricePopupComponent]
})
export class PricePopupModule { }
