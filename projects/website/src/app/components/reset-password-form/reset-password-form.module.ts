import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResetPasswordFormComponent } from './reset-password-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ShowHidePasswordModule } from '../../directives/show-hide-password/show-hide-password.module';



@NgModule({
  declarations: [ResetPasswordFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ShowHidePasswordModule
  ]
})
export class ResetPasswordFormModule { }
