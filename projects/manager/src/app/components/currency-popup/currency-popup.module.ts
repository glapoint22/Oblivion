import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyPopupComponent } from './currency-popup.component';
import { DropdownModule } from 'common';



@NgModule({
  declarations: [
    CurrencyPopupComponent
  ],
  imports: [
    CommonModule,
    DropdownModule
  ]
})
export class CurrencyPopupModule { }
