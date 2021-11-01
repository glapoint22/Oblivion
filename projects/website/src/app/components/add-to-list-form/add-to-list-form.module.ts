import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddToListFormComponent } from './add-to-list-form.component';
import { DropdownModule } from '../dropdown/dropdown.module';



@NgModule({
  declarations: [AddToListFormComponent],
  imports: [
    CommonModule,
    DropdownModule
  ]
})
export class AddToListFormModule { }
