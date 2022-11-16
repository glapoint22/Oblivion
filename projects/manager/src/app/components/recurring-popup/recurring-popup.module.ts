import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecurringPopupComponent } from './recurring-popup.component';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'common';



@NgModule({
  declarations: [RecurringPopupComponent],
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule
  ],
  exports: [
    RecurringPopupComponent
  ]
})
export class RecurringPopupModule { }
