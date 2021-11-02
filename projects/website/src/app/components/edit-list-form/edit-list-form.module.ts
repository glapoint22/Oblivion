import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditListFormComponent } from './edit-list-form.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [EditListFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class EditListFormModule { }
