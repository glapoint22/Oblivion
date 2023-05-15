import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PricePopupComponent } from './price-popup.component';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'common';



@NgModule({
  declarations: [PricePopupComponent],
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule
  ],
  exports: [PricePopupComponent]
})
export class PricePopupModule { }
