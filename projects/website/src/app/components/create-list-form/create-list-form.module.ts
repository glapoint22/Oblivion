import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateListFormComponent } from './create-list-form.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [CreateListFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class CreateListFormModule { }
