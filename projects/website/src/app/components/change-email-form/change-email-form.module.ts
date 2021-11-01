import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeEmailFormComponent } from './change-email-form.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [ChangeEmailFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class ChangeEmailFormModule { }
