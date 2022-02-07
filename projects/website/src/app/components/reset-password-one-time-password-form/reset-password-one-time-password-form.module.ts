import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResetPasswordOneTimePasswordFormComponent } from './reset-password-one-time-password-form.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [ResetPasswordOneTimePasswordFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class ResetPasswordOneTimePasswordFormModule { }
