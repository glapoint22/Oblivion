import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecurringPopupComponent } from './recurring-popup.component';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from '../dropdown/dropdown.module';



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
