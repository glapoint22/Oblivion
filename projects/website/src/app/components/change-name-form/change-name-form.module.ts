import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeNameFormComponent } from './change-name-form.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [ChangeNameFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class ChangeNameFormModule { }
