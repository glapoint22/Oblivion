import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecurringPopupComponent } from './recurring-popup.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [RecurringPopupComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    RecurringPopupComponent
  ]
})
export class RecurringPopupModule { }
