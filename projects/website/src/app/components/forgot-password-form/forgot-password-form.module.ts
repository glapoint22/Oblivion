import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotPasswordFormComponent } from './forgot-password-form.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [ForgotPasswordFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class ForgotPasswordFormModule { }
